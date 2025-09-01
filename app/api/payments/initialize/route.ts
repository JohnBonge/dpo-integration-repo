import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPaymentInvoice } from '@/lib/services/irembopay';
import { z } from 'zod';
import { createAuditLog } from '@/lib/audit-logs';

export const dynamic = 'force-dynamic';

// Updated validation schema to accept any string for bookingId
const requestSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
});

export async function POST(request: Request) {
  try {
    // Environment variables validation
    if (!process.env.IREMBO_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('Required environment variables missing');
    }

    const data = await request.json();
    const { bookingId } = requestSchema.parse(data);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tourPackage: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Format phone number (remove spaces, special chars)
    const formattedPhone = booking.phone?.replace(/[^\d+]/g, '') || '';

    // Calculate 50% deposit amount
    const totalAmount = Number(booking.totalAmount);
    const depositAmount = totalAmount * 0.5;

    // Calculate 50% deposit for payment

    // Prepare payment data with DEPOSIT AMOUNT (50%) instead of full amount
    const paymentData = {
      amount: depositAmount, // Changed from Number(booking.totalAmount) to depositAmount
      currency: 'USD', // Updated to USD to match IremboPay dashboard products
      reference: booking.id,
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      customerPhone: formattedPhone,
      description: `50% Deposit for tour booking: ${booking.tourPackage.title} (Total: $${totalAmount}, Deposit: $${depositAmount})`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}/success`,
      // Pass tour package information for IremboPay product creation
      tourPackage: {
        id: booking.tourPackage.id,
        title: booking.tourPackage.title,
        price: depositAmount, // Use deposit amount for IremboPay product mapping
        duration: booking.tourPackage.duration,
      },
    };

    // Sending payment data to IremboPay

    // Create payment invoice and get payment URL
    const { invoiceId, paymentUrl, reference } = await createPaymentInvoice(
      paymentData
    );

    // Update booking with payment details for webhook processing
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentIntentId: invoiceId, // Store the invoice ID so webhook can find the booking
        paymentStatus: 'PROCESSING',
      },
    });

    // Booking updated with payment details

    // Create audit log for payment initialization
    await createAuditLog({
      action: 'PAYMENT_INITIALIZED',
      metadata: {
        bookingId: booking.id,
        totalAmount: booking.totalAmount,
        depositAmount: depositAmount,
        customerEmail: booking.customerEmail,
        invoiceId,
        transactionId: reference,
      },
    });

    // Return both invoiceId and payment URL
    return NextResponse.json({ invoiceId, paymentUrl });
  } catch (error) {
    console.error('IremboPay payment initialization error:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    console.error(
      'Error message:',
      error instanceof Error ? error.message : String(error)
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking ID', details: error.errors },
        { status: 400 }
      );
    }

    // Return more detailed error information for debugging
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
