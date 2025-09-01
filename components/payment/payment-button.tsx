'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentErrorBoundary } from './error-boundary';
import Script from 'next/script';

interface PaymentButtonProps {
  amount: number;
  bookingId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
    country?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
}

// Declare IremboPay global variable
declare global {
  interface Window {
    IremboPay: {
      initiate: (config: {
        publicKey: string;
        invoiceNumber: string;
        locale: string;
        callback: (err: unknown, resp: unknown) => void;
      }) => void;
      closeModal: () => void;
      locale: {
        EN: string;
        FR: string;
        RW: string;
      };
    };
  }
}

type PaymentState =
  | 'idle'
  | 'initializing'
  | 'processing'
  | 'failed'
  | 'cancelled';

export function PaymentButton({ bookingId }: PaymentButtonProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset payment state when component mounts or bookingId changes
  useEffect(() => {
    setPaymentState('idle');
    setInvoiceNumber(null);
    setRetryCount(0);
  }, [bookingId]);

  const resetBookingStatus = async () => {
    try {
      // First, get the current booking status
      const bookingResponse = await fetch(`/api/bookings/${bookingId}`);
      if (!bookingResponse.ok) {
        console.error('Failed to fetch booking status for reset');
        return;
      }

      const booking = await bookingResponse.json();

      // Only reset if payment status is PROCESSING
      if (booking.paymentStatus !== 'PROCESSING') {
        console.log(
          'Booking status is not PROCESSING, skipping reset:',
          booking.paymentStatus
        );
        return;
      }

      const resetResponse = await fetch(
        `/api/bookings/${bookingId}/reset-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!resetResponse.ok) {
        const errorData = await resetResponse.json();
        console.error('Failed to reset booking status:', errorData);

        // Handle specific error cases
        if (resetResponse.status === 400) {
          console.log('Reset not needed - booking status already correct');
        } else {
          console.error(
            'Unexpected error resetting booking status:',
            errorData
          );
        }
      } else {
        console.log('Booking status reset successfully');
      }
    } catch (error) {
      console.error('Error during booking status reset:', error);
    }
  };

  const initializePayment = async () => {
    try {
      setPaymentState('initializing');

      // Initialize payment to get invoice number
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment initialization failed');
      }

      const { invoiceId } = await response.json();

      if (!invoiceId) {
        throw new Error('Invoice ID not received');
      }

      setInvoiceNumber(invoiceId);
      return invoiceId;
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentState('failed');

      // Provide more specific error messages
      let errorMessage = 'Payment initialization failed';
      if (error instanceof Error) {
        if (error.message.includes('product mapping')) {
          errorMessage =
            'Tour package configuration error. Please contact support.';
        } else if (error.message.includes('environment')) {
          errorMessage =
            'Payment system configuration error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);

      // Reset booking status back to PENDING only if it was PROCESSING
      await resetBookingStatus();
      return null;
    }
  };

  const openPaymentWidget = (invoiceId: string) => {
    if (!window.IremboPay) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      setPaymentState('failed');
      return;
    }

    setPaymentState('processing');

    // We need to get the public key from environment or use a default for sandbox
    const publicKey =
      process.env.NEXT_PUBLIC_IREMBO_PUBLIC_KEY || 'sandbox-public-key';

    // Set up a timeout to detect if modal was dismissed without callback
    const modalTimeout = setTimeout(() => {
      if (paymentState === 'processing') {
        setPaymentState('cancelled');
        toast.error('Payment was cancelled. You can try again when ready.');
        resetBookingStatus();
      }
    }, 30000); // 30 seconds timeout

    window.IremboPay.initiate({
      publicKey: publicKey,
      invoiceNumber: invoiceId,
      locale: window.IremboPay.locale.EN,
      callback: (err: unknown) => {
        clearTimeout(modalTimeout);

        if (!err) {
          // Payment successful - redirect to success page
          setPaymentState('idle');
          toast.success(
            'Payment completed successfully! Your booking has been confirmed.'
          );
          window.location.href = `/bookings/${bookingId}/success`;
        } else {
          // Payment failed or cancelled
          console.error('Payment error:', err);
          setPaymentState('failed');

          // Determine if it was cancelled or failed based on error
          const errorMessage = String(err).toLowerCase();
          if (
            errorMessage.includes('cancel') ||
            errorMessage.includes('dismiss')
          ) {
            setPaymentState('cancelled');
            toast.error('Payment was cancelled. You can try again when ready.');
          } else {
            toast.error('Payment failed. Please try again or contact support.');
          }

          // Reset booking status back to PENDING only if needed
          resetBookingStatus();

          // Close the modal if it's still open
          if (window.IremboPay.closeModal) {
            window.IremboPay.closeModal();
          }
        }
      },
    });
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast.error(
        'Payment system is still loading. Please wait a moment and try again.'
      );
      return;
    }

    setRetryCount((prev) => prev + 1);

    // If we already have an invoice number and it's not a retry, use it
    if (invoiceNumber && retryCount <= 1) {
      openPaymentWidget(invoiceNumber);
      return;
    }

    // Otherwise, initialize payment first (or re-initialize for retries)
    const invoiceId = await initializePayment();
    if (invoiceId) {
      openPaymentWidget(invoiceId);
    }
  };

  const handleRetry = () => {
    setPaymentState('idle');
    setInvoiceNumber(null); // Force re-initialization
    handlePayment();
  };

  const getButtonContent = () => {
    switch (paymentState) {
      case 'initializing':
        return (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Initializing Payment...
          </>
        );
      case 'processing':
        return (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Processing...
          </>
        );
      case 'failed':
        return (
          <>
            <RefreshCw className='mr-2 h-4 w-4' />
            Retry Payment
          </>
        );
      case 'cancelled':
        return (
          <>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </>
        );
      default:
        if (!isScriptLoaded) {
          return (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Loading Payment System...
            </>
          );
        }
        return 'Pay Now';
    }
  };

  const isButtonDisabled = () => {
    return (
      !isScriptLoaded ||
      paymentState === 'initializing' ||
      paymentState === 'processing'
    );
  };

  const getButtonVariant = () => {
    if (paymentState === 'failed' || paymentState === 'cancelled') {
      return 'outline';
    }
    return 'default';
  };

  return (
    <PaymentErrorBoundary>
      {/* Load IremboPay JavaScript widget */}
      <Script
        src='https://dashboard.sandbox.irembopay.com/assets/payment/inline.js'
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => {
          console.error('Failed to load IremboPay script');
          setPaymentState('failed');
          toast.error(
            'Failed to load payment system. Please refresh and try again.'
          );
        }}
      />

      <div className='space-y-2'>
        <Button
          onClick={
            paymentState === 'failed' || paymentState === 'cancelled'
              ? handleRetry
              : handlePayment
          }
          disabled={isButtonDisabled()}
          variant={getButtonVariant()}
          className='w-full'
        >
          {getButtonContent()}
        </Button>

        {(paymentState === 'failed' || paymentState === 'cancelled') && (
          <p className='text-sm text-gray-600 text-center'>
            {paymentState === 'cancelled'
              ? 'Payment was cancelled. Your booking is still available.'
              : 'Payment failed. Your booking is still available.'}
          </p>
        )}

        {retryCount > 2 && (
          <p className='text-sm text-amber-600 text-center'>
            Having trouble?{' '}
            <a href='/contact' className='underline'>
              Contact support
            </a>{' '}
            for assistance.
          </p>
        )}
      </div>
    </PaymentErrorBoundary>
  );
}
