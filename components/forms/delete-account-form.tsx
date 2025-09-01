'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export function DeleteAccountForm() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <label className='text-sm font-medium'>Confirm Password</label>
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <ConfirmationDialog
        title='Delete Account'
        description='Are you sure you want to delete your account? This action cannot be undone.'
        trigger={
          <Button variant='destructive' disabled={!password}>
            Delete Account
          </Button>
        }
        onConfirm={handleDeleteAccount}
        isLoading={isLoading}
        confirmText='Delete Account'
        variant='destructive'
      />
    </div>
  );
}
