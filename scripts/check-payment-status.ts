import { config } from 'dotenv';
import { verifyPayment } from '../lib/services/irembopay';

// Load environment variables from .env file
config();

async function checkPaymentStatus(invoiceId: string) {
  try {
    console.log(
      `🔍 Checking IremboPay payment status for invoice: ${invoiceId}`
    );

    const result = await verifyPayment(invoiceId);

    console.log('\n💳 IremboPay Payment Status:');
    console.log('- Success:', result.success);
    console.log('- Status:', result.status);
    console.log('- Is Paid:', result.isPaid);
    console.log('- Amount:', result.amount);
    console.log('- Reference:', result.reference);
    console.log('- Payment Method:', result.paymentMethod);
    console.log('- Payment Reference:', result.paymentReference);
  } catch (error) {
    console.error('❌ Error checking payment status:', error);
  }
}

// Get invoice ID from command line arguments
const invoiceId = process.argv[2];

if (!invoiceId) {
  console.log('Usage: npx tsx scripts/check-payment-status.ts <invoice-id>');
  console.log('Example: npx tsx scripts/check-payment-status.ts 880623495523');
  process.exit(1);
}

checkPaymentStatus(invoiceId);
