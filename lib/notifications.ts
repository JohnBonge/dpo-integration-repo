import { Booking, User } from '@prisma/client';
import { sendEmail } from './email';
import { broadcastPaymentEvent } from '@/lib/services/real-time-monitoring';

type NotificationType = 'success' | 'failure' | 'refund' | 'retry';

interface NotificationOptions {
  type: NotificationType;
  booking: Booking;
  user?: User;
  metadata?: Record<string, string | number | boolean>;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

interface Templates {
  success: EmailTemplate;
  failure: EmailTemplate;
  refund: EmailTemplate;
  retry: EmailTemplate;
}

export async function sendPaymentNotification(options: NotificationOptions) {
  const { type, booking, metadata } = options;

  // Send email notification
  const emailTemplate = getEmailTemplate(type, booking);
  if (booking.customerEmail) {
    await sendEmail({
      to: booking.customerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
  }

  // Send admin notification
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `Admin Alert: ${type} Payment - ${booking.id}`,
      html: getAdminEmailTemplate(type, booking, metadata),
    });
  }

  // Convert Decimal to number for the event
  const amount = Number(booking.totalAmount);

  // Broadcast real-time notification
  broadcastPaymentEvent({
    type: 'PAYMENT_STATUS',
    data: {
      type,
      bookingId: booking.id,
      customerName: booking.customerName,
      amount,
      timestamp: new Date().toISOString(),
      metadata,
    },
  });
}

function getEmailTemplate(
  type: NotificationType,
  booking: Booking
): EmailTemplate {
  const templates: Templates = {
    success: {
      subject: 'Payment Successful - Ingoma Tours',
      html: `
        <h1>Payment Successful!</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your payment of $${booking.totalAmount} has been successfully processed.</p>
        <p>Booking Reference: ${booking.id}</p>
      `,
    },
    failure: {
      subject: 'Payment Failed - Ingoma Tours',
      html: `
        <h1>Payment Failed</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your payment of $${booking.totalAmount} was unsuccessful.</p>
        <p>Please try again or contact our support team.</p>
      `,
    },
    refund: {
      subject: 'Payment Refunded - Ingoma Tours',
      html: `
        <h1>Payment Refunded</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your payment of $${booking.totalAmount} has been refunded.</p>
        <p>Booking Reference: ${booking.id}</p>
      `,
    },
    retry: {
      subject: 'Payment Retry Required - Ingoma Tours',
      html: `
        <h1>Payment Retry Required</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your payment of $${booking.totalAmount} requires another attempt.</p>
        <p>Please try again or contact our support team.</p>
      `,
    },
  };

  return templates[type];
}

function getAdminEmailTemplate(
  type: NotificationType,
  booking: Booking,
  metadata?: Record<string, string | number | boolean>
): string {
  return `
    <h2>Payment ${type} Alert</h2>
    <p>Booking Details:</p>
    <ul>
      <li>ID: ${booking.id}</li>
      <li>Customer: ${booking.customerName}</li>
      <li>Amount: $${booking.totalAmount}</li>
      <li>Time: ${new Date().toLocaleString()}</li>
    </ul>
    ${metadata ? `<pre>${JSON.stringify(metadata, null, 2)}</pre>` : ''}
  `;
}
