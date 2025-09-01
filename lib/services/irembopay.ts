import { z } from 'zod';
import {
  getIremboProductCode,
  getIremboProductMapping,
} from './irembopay-product-mapping';

// Constants for IremboPay API configuration
// Using sandbox URLs for testing with sandbox keys
const IREMBOPAY_API_URL = 'https://api.sandbox.irembopay.com';
const IREMBOPAY_PAYMENT_URL = 'https://checkout.sandbox.irembopay.com';

// Check if credentials exist
if (!process.env.IREMBO_SECRET_KEY) {
  console.warn('⚠️ IremboPay secret key not found in environment variables');
}

// Enhanced schema to support tour package information
const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  reference: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerPhone: z.string(),
  description: z.string(),
  callbackUrl: z.string().url().optional(),
  returnUrl: z.string().url().optional(),
  // New fields for tour package information
  tourPackage: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number().positive(),
    duration: z.number().positive().optional(),
  }),
});

// Authentication helper function - using correct IremboPay headers
async function generateAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'irembopay-secretKey': process.env.IREMBO_SECRET_KEY!,
    'X-API-Version': '2',
    Accept: 'application/json',
  };
}

// Helper function to format date in IremboPay's expected format
function formatIremboPayDate(date: Date): string {
  // IremboPay expects: 2022-11-27T16:24:51.000+02:00
  // Using Rwanda timezone (+02:00)
  const rwandaOffset = '+02:00';
  const isoDate = date.toISOString();

  // Replace Z with Rwanda timezone offset
  return isoDate.replace('Z', rwandaOffset);
}

// Main function to create a payment invoice using IremboPay's invoice API
export async function createPaymentInvoice(
  paymentData: z.infer<typeof paymentSchema>
) {
  try {
    // Validate input data
    const validatedData = paymentSchema.parse(paymentData);

    // Creating IremboPay invoice for tour package

    // Check required environment variables
    const IREMBOPAY_SECRET_KEY = process.env.IREMBO_SECRET_KEY;
    const PAYMENT_ACCOUNT_IDENTIFIER =
      process.env.IREMBO_PAYMENT_ACCOUNT_ID || 'PI-bd12658823';

    if (!IREMBOPAY_SECRET_KEY) {
      throw new Error('IremboPay secret key not configured');
    }

    // Generate authentication headers
    const authHeaders = await generateAuthHeaders();

    // Set expiry date 24 hours from now in IremboPay format
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    const expiryAt = formatIremboPayDate(expiryDate);

    // Get the correct IremboPay product code and validate dynamic data
    const iremboProductCode = getIremboProductCode(
      validatedData.tourPackage.id
    );

    if (!iremboProductCode) {
      throw new Error(
        `No IremboPay product mapping found for tour package: ${validatedData.tourPackage.title} (ID: ${validatedData.tourPackage.id}). ` +
          'Please add the mapping in lib/services/irembopay-product-mapping.ts'
      );
    }

    // Get dynamic mapping to ensure data consistency (optional validation)
    try {
      await getIremboProductMapping(validatedData.tourPackage.id);
      // Validation completed - mapping exists and is current
    } catch (error) {
      // Continue with payment - this is just for validation
    }

    // Product mapping verified for tour package

    // JSON request body for IremboPay Invoice API
    // NOTE: IremboPay doesn't support return URLs in their invoice API
    // Users will remain on IremboPay's checkout page after payment completion
    // We include instructions in the description to guide users back to our site
    const requestBody = {
      transactionId: validatedData.reference,
      paymentAccountIdentifier: PAYMENT_ACCOUNT_IDENTIFIER,
      customer: {
        email: validatedData.customerEmail,
        phoneNumber: validatedData.customerPhone,
        name: validatedData.customerName,
      },
      paymentItems: [
        {
          unitAmount: validatedData.tourPackage.price,
          quantity: 1,
          code: iremboProductCode,
        },
      ],
      description: `${validatedData.description} - ${validatedData.tourPackage.title}. After payment, please return to ${process.env.NEXT_PUBLIC_APP_URL} to view your booking confirmation.`,
      expiryAt: expiryAt,
      language: 'EN',
    };

    // Send request to IremboPay Invoice API

    const response = await fetch(`${IREMBOPAY_API_URL}/payments/invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const responseText = await response.text();

      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = null;
      }

      // Handle specific error cases
      if (errorData?.errors) {
        const productNotFoundError = errorData.errors.find(
          (err: { code: string; detail?: string }) =>
            err.code === 'PRODUCT_NOT_FOUND'
        );

        if (productNotFoundError) {
          throw new Error(
            `IremboPay product not found: ${iremboProductCode}. Please check your IremboPay dashboard and update the product mapping.`
          );
        }

        const paymentAccountError = errorData.errors.find(
          (err: { code: string; detail?: string }) =>
            err.code === 'PAYMENT_ACCOUNT_NOT_FOUND'
        );

        if (paymentAccountError) {
          throw new Error(
            `IremboPay payment account not found: ${PAYMENT_ACCOUNT_IDENTIFIER}. Please check your IremboPay dashboard configuration.`
          );
        }
      }

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        responseText ||
        `HTTP ${response.status}`;
      throw new Error(
        `IremboPay API error: ${response.status} - ${errorMessage}`
      );
    }

    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      return {
        invoiceId: responseData.data.invoiceNumber,
        paymentUrl: responseData.data.paymentLinkUrl,
        reference: responseData.data.transactionId,
        status: responseData.data.paymentStatus?.toLowerCase() || 'pending',
        amount: responseData.data.amount,
        currency: responseData.data.currency,
      };
    }

    throw new Error('No payment invoice created');
  } catch (error) {
    console.error('IremboPay payment initialization error:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    console.error(
      'Error message:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw error;
  }
}

// Get the payment page URL using the invoice ID
export function getPaymentUrl(invoiceId: string): string {
  return `${IREMBOPAY_PAYMENT_URL}/checkout/${invoiceId}`;
}

// Verify the payment status using the correct IremboPay endpoint
export async function verifyPayment(invoiceReference: string) {
  try {
    // Generate authentication headers
    const authHeaders = await generateAuthHeaders();

    const response = await fetch(
      `${IREMBOPAY_API_URL}/payments/invoices/${invoiceReference}`,
      {
        method: 'GET',
        headers: authHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(`IremboPay API error: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: responseData.success,
      status: responseData.data?.paymentStatus?.toLowerCase(),
      isPaid: responseData.data?.paymentStatus === 'PAID',
      amount: responseData.data?.amount,
      reference: responseData.data?.transactionId,
      paymentMethod: responseData.data?.paymentMethod,
      paymentReference: responseData.data?.paymentReference,
    };
  } catch (error) {
    console.error('IremboPay Verify Error:', error);
    return { success: false, isPaid: false };
  }
}

// Legacy function names for backward compatibility
export const createChargeToken = createPaymentInvoice;
export const verifyTransaction = verifyPayment;
