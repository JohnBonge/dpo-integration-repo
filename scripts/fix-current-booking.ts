#!/usr/bin/env tsx

import { prisma } from '../lib/prisma';
import { BookingStatus, PaymentStatus } from '@prisma/client';

async function fixCurrentBooking() {
  console.log('🔧 Fixing Current Booking Status');

  // The booking from the dashboard
  const invoiceNumber = '880714864676';
  const bookingId = 'cmd2yzd7q0001mf1p83fjn6eq';

  try {
    // Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: bookingId }, { paymentIntentId: invoiceNumber }],
      },
      include: { tourPackage: true },
    });

    if (!booking) {
      console.error('❌ Booking not found');
      return;
    }

    console.log('📋 Current Booking Status:');
    console.log('- ID:', booking.id);
    console.log('- Customer:', booking.customerName);
    console.log('- Tour:', booking.tourPackage.title);
    console.log('- Status:', booking.status);
    console.log('- Payment Status:', booking.paymentStatus);
    console.log('- Payment Intent ID:', booking.paymentIntentId);
    console.log('- Amount:', booking.totalAmount);

    // Update to CONFIRMED/PAID
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        paidAt: new Date(),
        confirmedAt: new Date(),
        paymentIntentId: invoiceNumber, // Ensure this is set
      },
    });

    console.log('\n✅ Booking Updated Successfully:');
    console.log('- Status:', updatedBooking.status);
    console.log('- Payment Status:', updatedBooking.paymentStatus);
    console.log('- Paid At:', updatedBooking.paidAt);
    console.log('- Confirmed At:', updatedBooking.confirmedAt);

    // Create payment event
    await prisma.paymentEvent.create({
      data: {
        bookingId: booking.id,
        event: 'PAYMENT_SUCCESS',
        metadata: {
          invoiceNumber: invoiceNumber,
          amount: 100,
          currency: 'USD',
          paymentStatus: 'PAID',
          manuallyFixed: true,
          fixedAt: new Date().toISOString(),
        },
      },
    });

    console.log('✅ Payment event created');

    console.log('\n🎉 Booking successfully fixed!');
    console.log('The customer should now see their booking as CONFIRMED.');
  } catch (error) {
    console.error('❌ Error fixing booking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCurrentBooking().catch(console.error);
