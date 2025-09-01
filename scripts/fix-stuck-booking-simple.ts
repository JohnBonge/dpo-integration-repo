#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { BookingStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStuckBooking() {
  console.log('🔧 Fixing stuck booking from IremboPay payment...');

  try {
    // The booking ID from the screenshot
    const bookingId = 'cmc94pqdu0003mfvzhhfhan';
    const invoiceNumber = '880623211210';

    console.log(`Looking for booking: ${bookingId}`);

    // Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: bookingId },
          { paymentIntentId: invoiceNumber },
          { paymentIntentId: bookingId },
        ],
      },
      include: { tourPackage: true },
    });

    if (!booking) {
      console.error('❌ Booking not found');
      return;
    }

    console.log('✅ Found booking:', {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      customerName: booking.customerName,
      tourTitle: booking.tourPackage.title,
    });

    if (booking.paymentStatus === 'PAID' && booking.status === 'CONFIRMED') {
      console.log('✅ Booking is already correctly updated');
      return;
    }

    console.log('🔄 Updating booking status to PAID and CONFIRMED...');

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: BookingStatus.CONFIRMED,
        paidAt: new Date(),
        confirmedAt: new Date(),
        paymentIntentId: invoiceNumber,
      },
    });

    console.log('✅ Booking updated successfully:', {
      id: updatedBooking.id,
      status: updatedBooking.status,
      paymentStatus: updatedBooking.paymentStatus,
    });

    // Create payment event record
    await prisma.paymentEvent.create({
      data: {
        bookingId: booking.id,
        event: 'PAYMENT_SUCCESS_MANUAL_FIX',
        metadata: {
          invoiceNumber,
          transactionId: booking.id,
          paymentStatus: 'PAID',
          fixedAt: new Date().toISOString(),
          reason: 'Manual fix due to webhook URL misconfiguration',
        },
      },
    });

    console.log('✅ Payment event created');
    console.log('🎉 Booking fix completed successfully!');
  } catch (error) {
    console.error('❌ Error fixing booking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixStuckBooking();
