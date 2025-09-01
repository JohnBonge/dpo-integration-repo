'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const navigation = [
  { name: 'Packages', href: '/packages' },
  { name: 'Why Ingoma Tours', href: '/why-ingoma' },
  { name: 'Community', href: '/community' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkBookingOpen, setCheckBookingOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleCheckBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      window.location.href = `/bookings/search?email=${encodeURIComponent(
        email.trim()
      )}`;
    }
  };

  const CheckBookingDialog = () => (
    <Dialog open={checkBookingOpen} onOpenChange={setCheckBookingOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Search className='h-4 w-4' />
          Check My Booking
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Check Your Booking</DialogTitle>
          <DialogDescription>
            Enter your email address to find and view your booking details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCheckBooking} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setCheckBookingOpen(false);
                setEmail('');
              }}
            >
              Cancel
            </Button>
            <Button type='submit'>
              <Search className='h-4 w-4 mr-2' />
              Search Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <header className='bg-white shadow-sm'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'>
        <div className='flex lg:flex-1'>
          <Link href='/' className='-m-1.5'>
            <Image
              className='h-16 w-auto'
              src='https://res.cloudinary.com/diffklgzw/image/upload/v1750415949/ingoma_logo_kureof.png'
              alt='Ingoma Tours'
              width={120}
              height={32}
              priority
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>

        {/* Desktop menu */}
        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600'
            >
              {item.name}
            </Link>
          ))}
          <div className='hidden md:flex items-center space-x-4'>
            <CheckBookingDialog />
          </div>
        </div>

        {/* Removed sign out button but kept the spacing */}
        <div className='hidden lg:flex lg:flex-1 lg:justify-end' />

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <div className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
              <div className='flex items-center justify-between'>
                <Link href='/' className='-m-1.5 p-1.5'>
                  <Image
                    className='h-8 w-auto'
                    src='/logo.png'
                    alt='Ingoma Tours'
                    width={120}
                    height={32}
                  />
                </Link>
                <button
                  type='button'
                  className='-m-2.5 rounded-md p-2.5 text-gray-700'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='mt-6 flow-root'>
                <div className='-my-6 divide-y divide-gray-500/10'>
                  <div className='space-y-2 py-6'>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className='block md:hidden mt-4'>
                      <CheckBookingDialog />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
