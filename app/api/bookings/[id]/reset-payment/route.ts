import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';
import { createAuditLog } from '@/lib/audit-logs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tourPackage: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only reset if payment is in PROCESSING state
    if (booking.paymentStatus !== PaymentStatus.PROCESSING) {
      return NextResponse.json(
        {
          error: 'Booking payment status cannot be reset',
          currentStatus: booking.paymentStatus,
        },
        { status: 400 }
      );
    }

    // Reset booking payment status back to PENDING
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: PaymentStatus.PENDING,
        paymentIntentId: null, // Clear the payment intent ID
      },
    });

    // Create audit log for payment reset
    await createAuditLog({
      action: 'PAYMENT_RESET',
      metadata: {
        bookingId: booking.id,
        previousPaymentStatus: booking.paymentStatus,
        newPaymentStatus: PaymentStatus.PENDING,
        customerEmail: booking.customerEmail,
        reason: 'Payment cancelled or dismissed by user',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking payment status reset successfully',
      paymentStatus: updatedBooking.paymentStatus,
    });
  } catch (error) {
    console.error('Error resetting booking payment status:', error);

    return NextResponse.json(
      {
        error: 'Failed to reset booking payment status',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
