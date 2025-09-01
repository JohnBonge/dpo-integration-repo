import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className='container mx-auto px-4 py-24'>
      <div className='max-w-md mx-auto text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Payment Failed</h1>
        <p className='mb-8'>
          Something went wrong with your payment. Please try again.
        </p>
        <Button asChild>
          <Link href='/'>Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
