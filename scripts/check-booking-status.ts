#!/usr/bin/env tsx

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function checkBookingStatus() {
  console.log('🔍 Checking booking status...');

  try {
    const bookingId = 'cmc94pqdu0003mfvzhhfhan';
    const invoiceNumber = '880623211210';

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: bookingId }, { paymentIntentId: invoiceNumber }],
      },
      include: { tourPackage: true },
    });

    if (!booking) {
      console.log('❌ Booking not found');
      return;
    }

    console.log('✅ Booking found:');
    console.log('  ID:', booking.id);
    console.log('  Customer:', booking.customerName);
    console.log('  Tour:', booking.tourPackage.title);
    console.log('  Status:', booking.status);
    console.log('  Payment Status:', booking.paymentStatus);
    console.log(
      '  Total Amount:',
      `$${Number(booking.totalAmount).toFixed(2)}`
    );
    console.log(
      '  Deposit Amount (50%):',
      `$${(Number(booking.totalAmount) / 2).toFixed(2)}`
    );
    console.log('  Payment Intent ID:', booking.paymentIntentId);
    console.log('  Paid At:', booking.paidAt);
    console.log('  Confirmed At:', booking.confirmedAt);

    if (booking.paymentStatus === 'PAID' && booking.status === 'CONFIRMED') {
      console.log('🎉 Booking is correctly updated!');
    } else {
      console.log('⚠️ Booking needs to be updated');
    }
  } catch (error) {
    console.error('❌ Error checking booking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookingStatus();
