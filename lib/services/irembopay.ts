import { z } from 'zod';
import { getIremboProductCode, getIremboProductMapping } from './irembopay-product-mapping';

const IREMBOPAY_API_URL = 'https://api.sandbox.irembopay.com';
const IREMBOPAY_PAYMENT_URL = 'https://checkout.sandbox.irembopay.com';

if (!process.env.IREMBO_SECRET_KEY) {
  console.warn('⚠️ IremboPay secret key not found in environment variables');
}

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
  tourPackage: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number().positive(),
    duration: z.number().positive().optional(),
  }),
});

async function generateAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'irembopay-secretKey': process.env.IREMBO_SECRET_KEY!,
    'X-API-Version': '2',
    Accept: 'application/json',
  };
}

function formatIremboPayDate(date: Date): string {
  const rwandaOffset = '+02:00';
  const isoDate = date.toISOString();
  return isoDate.replace('Z', rwandaOffset);
}

interface IremboError {
  code: string;
  detail?: string;
}

interface IremboInvoiceResponseData {
  invoiceNumber: string;
  paymentLinkUrl: string;
  transactionId: string;
  paymentMethod?: string;
  paymentReference?: string;
  paymentStatus?: string;
  amount: number;
  currency: string;
}

export async function createPaymentInvoice(paymentData: z.infer<typeof paymentSchema>) {
  try {
    const validatedData = paymentSchema.parse(paymentData);

    const IREMBOPAY_SECRET_KEY = process.env.IREMBO_SECRET_KEY;
    const PAYMENT_ACCOUNT_IDENTIFIER =
      process.env.IREMBO_PAYMENT_ACCOUNT_ID || 'PI-bd12658823';

    if (!IREMBOPAY_SECRET_KEY) {
      throw new Error('IremboPay secret key not configured');
    }

    const authHeaders = await generateAuthHeaders();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    const expiryAt = formatIremboPayDate(expiryDate);

    const iremboProductCode = getIremboProductCode(validatedData.tourPackage.id);
    if (!iremboProductCode) {
      throw new Error(
        `No IremboPay product mapping found for tour package: ${validatedData.tourPackage.title} (ID: ${validatedData.tourPackage.id}). Please add the mapping.`
      );
    }

    try {
      await getIremboProductMapping(validatedData.tourPackage.id);
    } catch {
      // Validation only
    }

    const requestBody = {
      transactionId: validatedData.reference,
      paymentAccountIdentifier: PAYMENT_ACCOUNT_IDENTIFIER,
      customer: {
        email: validatedData.customerEmail,
        phoneNumber: validatedData.customerPhone,
        name: validatedData.customerName,
      },
      paymentItems: [
        { unitAmount: validatedData.tourPackage.price, quantity: 1, code: iremboProductCode },
      ],
      description: `${validatedData.description} - ${validatedData.tourPackage.title}. After payment, return to ${process.env.NEXT_PUBLIC_APP_URL}`,
      expiryAt,
      language: 'EN',
    };

    const response = await fetch(`${IREMBOPAY_API_URL}/payments/invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const responseText = await response.text();

      let errorData: { errors?: IremboError[]; message?: string; error?: string } | null = null;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = null;
      }

      if (errorData?.errors) {
        const productNotFoundError = errorData.errors.find(
          (err: IremboError) => err.code === 'PRODUCT_NOT_FOUND'
        );
        if (productNotFoundError) {
          throw new Error(`IremboPay product not found: ${iremboProductCode}`);
        }

        const paymentAccountError = errorData.errors.find(
          (err: IremboError) => err.code === 'PAYMENT_ACCOUNT_NOT_FOUND'
        );
        if (paymentAccountError) {
          throw new Error(`IremboPay payment account not found: ${PAYMENT_ACCOUNT_IDENTIFIER}`);
        }
      }

      throw new Error(
        `IremboPay API error: ${response.status} - ${errorData?.message || responseText}`
      );
    }

    const responseData: { success: boolean; data: IremboInvoiceResponseData } = await response.json();

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
    throw error;
  }
}

export function getPaymentUrl(invoiceId: string): string {
  return `${IREMBOPAY_PAYMENT_URL}/checkout/${invoiceId}`;
}

export async function verifyPayment(invoiceReference: string) {
  try {
    const authHeaders = await generateAuthHeaders();

    const response = await fetch(`${IREMBOPAY_API_URL}/payments/invoices/${invoiceReference}`, {
      method: 'GET',
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error(`IremboPay API error: ${response.status}`);
    }

    const responseData: { success: boolean; data?: IremboInvoiceResponseData } = await response.json();

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

// Legacy function names
export const createChargeToken = createPaymentInvoice;
export const verifyTransaction = verifyPayment;