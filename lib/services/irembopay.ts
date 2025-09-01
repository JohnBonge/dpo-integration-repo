export async function createPaymentInvoice(paymentData: any) {
  // Return placeholder values so your route builds successfully
  return {
    invoiceId: 'INV-STUB-12345',
    paymentUrl: 'https://example.com/pay/INV-STUB-12345',
    reference: paymentData.reference || 'REF-STUB-12345',
  };
}