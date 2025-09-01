import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit-logs';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'crypto';

function verifyWebhookSignature(body: string, headers: Headers): boolean {
  const webhookSecret = process.env.IREMBO_SECRET_KEY;

  if (!webhookSecret) {
    return false;
  }

  const signatureHeader = headers.get('irembopay-signature');
  if (!signatureHeader) {
    return false;
  }

  try {
    // Parse signature header: "t=<timestamp>,s=<signature>"
    const elements = signatureHeader.split(',');
    let timestamp: string | null = null;
    let signature: string | null = null;

    for (const element of elements) {
      const [prefix, value] = element.trim().split('=');
      if (prefix === 't') timestamp = value;
      if (prefix === 's') signature = value;
    }

    if (!timestamp || !signature) {
      return false;
    }

    // Create expected signature
    const signedPayload = `${timestamp}#${body}`;
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    // Compare signatures
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    const isValid = timingSafeEqual(expectedBuffer, receivedBuffer);

    // Check timestamp (5 minute tolerance)
    const currentTime = Date.now();
    const timestampInt = parseInt(timestamp, 10);
    if (!isNaN(timestampInt)) {
      const timeDifference = Math.abs(currentTime - timestampInt);
      if (timeDifference > 300 * 1000) {
        return false;
      }
    }

    return isValid;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(body, request.headers)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse webhook data
    let webhookData: unknown;
    try {
      webhookData = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate webhook structure
    if (
      !webhookData ||
      typeof webhookData !== 'object' ||
      webhookData === null ||
      !('data' in webhookData)
    ) {
      return NextResponse.json(
        { error: 'Invalid webhook data structure' },
        { status: 400 }
      );
    }

    const paymentData = (webhookData as { data: Record<string, unknown> }).data;
    const invoiceNumber =
      typeof paymentData.invoiceNumber === 'string'
        ? paymentData.invoiceNumber
        : '';
    const transactionId =
      typeof paymentData.transactionId === 'string'
        ? paymentData.transactionId
        : '';

    // Find booking
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { paymentIntentId: invoiceNumber },
          { paymentIntentId: transactionId },
          { id: invoiceNumber },
          { id: transactionId },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking based on payment status
    const paymentStatus =
      typeof paymentData.paymentStatus === 'string'
        ? paymentData.paymentStatus.toUpperCase()
        : '';

    const updateData: Record<string, unknown> = {
      paymentIntentId: invoiceNumber || transactionId,
    };

    if (paymentStatus === 'PAID') {
      updateData.paymentStatus = PaymentStatus.PAID;
      updateData.status = BookingStatus.CONFIRMED;
      updateData.paidAt = paymentData.paidAt
        ? new Date(String(paymentData.paidAt))
        : new Date();
      updateData.confirmedAt = new Date();
    } else if (paymentStatus === 'FAILED') {
      updateData.paymentStatus = PaymentStatus.FAILED;
    }

    // Update booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: updateData,
    });

    // Create payment event
    try {
      await prisma.paymentEvent.create({
        data: {
          bookingId: booking.id,
          event:
            paymentStatus === 'PAID' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
          metadata: {
            invoiceNumber: String(paymentData.invoiceNumber || ''),
            transactionId: String(paymentData.transactionId || ''),
            amount: Number(paymentData.amount) || 0,
            paymentStatus: String(paymentData.paymentStatus || ''),
            currency: String(paymentData.currency || ''),
          },
        },
      });
    } catch {
      // Continue even if payment event creation fails
    }

    // Create audit log
    try {
      await createAuditLog({
        action: 'PAYMENT_COMPLETED',
        bookingId: booking.id,
        metadata: {
          invoiceNumber,
          transactionId,
          paymentStatus,
          verifiedAt: new Date().toISOString(),
        },
      });
    } catch {
      // Continue even if audit log creation fails
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
