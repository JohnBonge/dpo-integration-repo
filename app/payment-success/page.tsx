import { PaymentConfirmation } from '@/components/payment/payment-confirmation';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  const bookingId = searchParams.bookingId;

  if (!bookingId) {
    redirect('/');
  }

  return (
    <PaymentConfirmation
      status='success'
      bookingId={bookingId as string}
      message='Your payment was successful and your booking has been confirmed. You will receive a confirmation email shortly.'
    />
  );
}
