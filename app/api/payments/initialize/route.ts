import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createAuditLog } from '@/lib/audit-logs';
import { createPaymentInvoice } from '@/lib/services/irembopay';



export const dynamic = 'force-dynamic';

// Validation schema for request body
const requestSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
});

export async function POST(request: Request) {
  try {
    // ✅ Validate environment variables
    if (!process.env.IREMBO_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('Required environment variables missing');
    }

    // ✅ Parse request body
    const data = await request.json();
    const { bookingId } = requestSchema.parse(data);

    // ✅ Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tourPackage: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // ✅ Clean up phone number
    const formattedPhone = booking.phone?.replace(/[^\d+]/g, '') || '';

    // ✅ Calculate deposit
    const totalAmount = Number(booking.totalAmount);
    const depositAmount = totalAmount * 0.5;

    // ✅ Prepare payment data
    const paymentData = {
      amount: depositAmount,
      currency: 'USD',
      reference: booking.id,
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      customerPhone: formattedPhone,
      description: `50% Deposit for tour booking: ${booking.tourPackage.title} (Total: $${totalAmount}, Deposit: $${depositAmount})`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}/success`,
      tourPackage: {
        id: booking.tourPackage.id,
        title: booking.tourPackage.title,
        price: depositAmount,
        duration: booking.tourPackage.duration,
      },
    };

    // ✅ Call IremboPay API
   const { invoiceId, paymentUrl, reference } = await createPaymentInvoice(paymentData);

   

    // ✅ Update booking with payment intent
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentIntentId: invoiceId,
        paymentStatus: 'PROCESSING',
      },
    });

    // ✅ Log audit trail
    await createAuditLog({
      action: 'PAYMENT_INITIALIZED',
      metadata: {
        bookingId: booking.id,
        totalAmount: booking.totalAmount,
        depositAmount,
        customerEmail: booking.customerEmail,
        invoiceId,
        transactionId: reference,
      },
    });

    // ✅ Return response
    return NextResponse.json({ invoiceId, paymentUrl });
  } catch (error) {
    console.error('IremboPay payment initialization error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking ID', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to initialize payment',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}