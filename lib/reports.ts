import { prisma } from './prisma';
import PDFDocument from 'pdfkit';
import { Workbook } from 'exceljs';
import type { PaymentEvent, Booking, TourPackage } from '@prisma/client';

interface ReportOptions {
  startDate: Date;
  endDate: Date;
  format: 'excel' | 'pdf';
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface PaymentMetadata {
  amount: string | number;
  [key: string]: JsonValue;
}

interface PaymentWithDetails extends Omit<PaymentEvent, 'metadata'> {
  booking: Booking & {
    tourPackage: TourPackage;
  };
  metadata: PaymentMetadata | null;
  totalAmount: number | null;
}

export async function generatePaymentReport(
  options: ReportOptions
): Promise<Buffer> {
  const payments = await prisma.paymentEvent.findMany({
    where: {
      createdAt: {
        gte: options.startDate,
        lte: options.endDate,
      },
    },
    include: {
      booking: {
        include: {
          tourPackage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform payments to include totalAmount
  const paymentsWithAmount = payments.map((payment) => {
    const metadata = payment.metadata as PaymentMetadata | null;
    return {
      ...payment,
      metadata,
      totalAmount: metadata?.amount ? Number(metadata.amount) : null,
    };
  }) as PaymentWithDetails[];

  if (options.format === 'excel') {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Payment Report');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Booking ID', key: 'bookingId', width: 20 },
      { header: 'Customer', key: 'customer', width: 30 },
      { header: 'Tour', key: 'tour', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    paymentsWithAmount.forEach((payment) => {
      worksheet.addRow({
        date: payment.createdAt.toLocaleDateString(),
        bookingId: payment.bookingId,
        customer: payment.booking.customerName,
        tour: payment.booking.tourPackage.title,
        amount: payment.totalAmount || 0,
        status: payment.event,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  } else {
    // Generate PDF report
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Payment Report', { align: 'center' }).moveDown();

      paymentsWithAmount.forEach((payment) => {
        doc
          .fontSize(12)
          .text(`Date: ${payment.createdAt.toLocaleDateString()}`)
          .text(`Booking: ${payment.bookingId}`)
          .text(`Customer: ${payment.booking.customerName}`)
          .text(`Amount: $${payment.totalAmount || 0}`)
          .text(`Status: ${payment.event}`)
          .moveDown();
      });

      doc.end();
    });
  }
}
