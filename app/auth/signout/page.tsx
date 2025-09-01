'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut({
          callbackUrl: '/',
          redirect: true,
        });
      } catch (error) {
        console.error('Sign out error:', error);
        // Fallback redirect
        router.push('/');
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p>Signing out...</p>
    </div>
  );
}
