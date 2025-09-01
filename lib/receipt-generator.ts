import { Booking, TourPackage } from '@prisma/client';
import PDFDocument from 'pdfkit';

interface BookingWithTour extends Booking {
  tourPackage: TourPackage;
}

export async function generateReceipt(
  booking: BookingWithTour
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add company logo
      // doc.image('path/to/logo.png', 50, 45, { width: 50 });

      // Add receipt header
      doc
        .fontSize(20)
        .text('Payment Receipt', 50, 50)
        .fontSize(10)
        .text(`Receipt Date: ${new Date().toLocaleDateString()}`)
        .text(`Booking Reference: ${booking.id}`)
        .text(`Transaction ID: ${booking.paymentIntentId}`);

      // Add customer details
      doc
        .moveDown()
        .fontSize(12)
        .text('Customer Details')
        .fontSize(10)
        .text(`Name: ${booking.customerName}`)
        .text(`Email: ${booking.customerEmail}`);

      // Add booking details
      doc
        .moveDown()
        .fontSize(12)
        .text('Booking Details')
        .fontSize(10)
        .text(`Tour: ${booking.tourPackage.title}`)
        .text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`)
        .text(`Participants: ${booking.participants}`);

      // Add payment details
      const depositAmount = Number(booking.totalAmount) * 0.5;
      doc
        .moveDown()
        .fontSize(12)
        .text('Payment Details')
        .fontSize(10)
        .text(`Total Amount: $${Number(booking.totalAmount).toFixed(2)}`)
        .text(`Deposit Paid: $${depositAmount.toFixed(2)}`)
        .text(`Balance Due: $${depositAmount.toFixed(2)}`);

      // Add footer
      doc
        .moveDown()
        .fontSize(8)
        .text('Thank you for choosing Ingoma Tours!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
