import { Booking, Prisma } from '@prisma/client';

// Create a type that includes only the fields we need
interface InvoiceBooking extends Booking {
  tourPackage: {
    title: string;
    price: Prisma.Decimal;
  };
}

export function formatCurrency(amount: number | Prisma.Decimal): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}

export function generateInvoiceHTML(booking: InvoiceBooking) {
  const totalPrice = Number(booking.tourPackage.price);
  const depositAmount = totalPrice * 0.5;
  const balanceAmount = totalPrice - depositAmount;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .invoice { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin-bottom: 30px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { padding: 10px; border: 1px solid #ddd; }
          .total { margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>Ingoma Tours</h1>
            <h2>Booking Invoice</h2>
          </div>
          
          <div class="details">
            <p><strong>Booking Reference:</strong> ${booking.id}</p>
            <p><strong>Date:</strong> ${new Date(
              booking.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Email:</strong> ${booking.customerEmail}</p>
          </div>

          <table class="table">
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>${booking.tourPackage.title} (${
    booking.participants
  } participants)</td>
              <td>${formatCurrency(totalPrice)}</td>
            </tr>
            <tr>
              <td>Deposit Paid</td>
              <td>${formatCurrency(depositAmount)}</td>
            </tr>
            <tr>
              <td>Balance Due</td>
              <td>${formatCurrency(balanceAmount)}</td>
            </tr>
          </table>

          <div class="total">
            <h3>Total: ${formatCurrency(totalPrice)}</h3>
          </div>

          <div class="footer">
            <p>Thank you for choosing Ingoma Tours!</p>
            <p>Balance payment is due 30 days before the tour date.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
