import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className='container mx-auto px-4 py-24'>
      <Card className='max-w-md mx-auto text-center p-6'>
        <XCircle className='w-16 h-16 mx-auto mb-6 text-red-500' />
        <h1 className='text-2xl font-bold mb-4'>Payment Failed</h1>
        <p className='mb-8 text-gray-600'>
          Your payment was unsuccessful. Please try again or contact our support
          team for assistance.
        </p>
        <div className='space-y-4'>
          <Button asChild className='w-full'>
            <Link href='/support'>Contact Support</Link>
          </Button>
          <Button asChild variant='outline' className='w-full'>
            <Link href='/'>Return Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
