'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface EmailVerificationProps {
  token?: string;
  email?: string;
  userId?: string;
}

export function EmailVerification({
  token,
  email,
  userId,
}: EmailVerificationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: verificationToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify email');
        }

        setIsVerified(true);
        toast.success('Email verified successfully');
        setTimeout(() => router.push('/auth/login'), 2000);
      } catch (error) {
        console.error('Email verification error:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to verify email'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  const resendVerification = async () => {
    if (!email || !userId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email');
      }

      toast.success('Verification email sent');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='p-6 w-full max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Email Verification</h1>
      {isVerified ? (
        <div className='text-center'>
          <p className='text-green-600 mb-4'>Your email has been verified!</p>
          <p className='text-gray-600'>Redirecting to login...</p>
        </div>
      ) : (
        <div className='space-y-4'>
          <p className='text-gray-600'>
            {token
              ? 'Verifying your email...'
              : 'Please check your email for the verification link.'}
          </p>
          {!token && (
            <Button
              onClick={resendVerification}
              className='w-full'
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
