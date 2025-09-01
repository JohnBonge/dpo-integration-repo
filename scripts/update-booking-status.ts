import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { BookingStatus, PaymentStatus } from '@prisma/client';

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function updateBookingStatus(bookingId: string, invoiceId: string) {
  try {
    console.log(`🔄 Updating booking status for: ${bookingId}`);

    // Get current booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tourPackage: true },
    });

    if (!booking) {
      console.log('❌ Booking not found');
      return;
    }

    console.log('📋 Current booking status:', booking.status);
    console.log('💳 Current payment status:', booking.paymentStatus);

    // Update booking to CONFIRMED and PAID
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        paidAt: new Date(),
        confirmedAt: new Date(),
        paymentIntentId: invoiceId,
      },
    });

    console.log('✅ Updated booking status to:', updatedBooking.status);
    console.log('✅ Updated payment status to:', updatedBooking.paymentStatus);
    console.log('✅ Paid at:', updatedBooking.paidAt);
    console.log('✅ Confirmed at:', updatedBooking.confirmedAt);

    // Create payment event record
    await prisma.paymentEvent.create({
      data: {
        bookingId: booking.id,
        event: 'PAYMENT_SUCCESS',
        metadata: {
          invoiceId: invoiceId,
          paymentStatus: 'PAID',
          manualUpdate: true,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    console.log('📝 Created payment success event');
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get arguments from command line
const bookingId = process.argv[2];
const invoiceId = process.argv[3];

if (!bookingId || !invoiceId) {
  console.log(
    'Usage: npx tsx scripts/update-booking-status.ts <booking-id> <invoice-id>'
  );
  console.log(
    'Example: npx tsx scripts/update-booking-status.ts cmc922lau0001mfqi6oho2m36 880623495523'
  );
  process.exit(1);
}

updateBookingStatus(bookingId, invoiceId);
