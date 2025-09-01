import type { TourPackage } from '@prisma/client';

interface BookingDetails {
  customerName: string;
  startDate: Date;
  participants: number;
  tourPackage: TourPackage & {
    title: string;
    price: number;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateBookingConfirmationEmail(
  booking: BookingDetails
): string {
  const depositAmount = Number(booking.tourPackage.price) * 0.5;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2C5282;">Booking Confirmed!</h1>
      <p>Dear ${booking.customerName},</p>
      <p>Thank you for booking with Ingoma Tours. Your booking has been confirmed and your deposit payment has been received.</p>
      
      <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #2D3748; margin-bottom: 15px;">Booking Details:</h2>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Tour:</strong> ${booking.tourPackage.title}</li>
          <li><strong>Start Date:</strong> ${new Date(
            booking.startDate
          ).toLocaleDateString()}</li>
          <li><strong>Participants:</strong> ${booking.participants}</li>
          <li><strong>Total Price:</strong> ${formatCurrency(
            booking.tourPackage.price
          )}</li>
          <li><strong>Deposit Paid:</strong> ${formatCurrency(
            depositAmount
          )}</li>
          <li><strong>Balance Due:</strong> ${formatCurrency(
            depositAmount
          )} </li>
        </ul>
      </div>

      <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>Ingoma Tours Team</p>
    </div>
  `;
}
