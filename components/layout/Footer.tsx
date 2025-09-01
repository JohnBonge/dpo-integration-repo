import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram } from 'lucide-react';

const menuItems = [
  { name: 'Packages', href: '/packages' },
  { name: 'Why Ingoma Tours', href: '/why-ingoma' },
  { name: 'Community', href: '/community' },
  { name: 'FAQs', href: '/faqs' },
];

const supportItems = [
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
];

export default function Footer() {
  return (
    <footer className='bg-green-950 text-white'>
      <div className='mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Company Info */}
          <div>
            <h3 className='text-sm font-semibold'>About Ingoma Tours</h3>
            <p className='mt-4 text-sm text-gray-300'>
              Ingoma Tours Company is a premier tour guide service based in
              Rwanda, dedicated to offering unforgettable travel experiences
              that showcase the beauty and culture of this remarkable country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-sm font-semibold'>Quick Links</h3>
            <ul className='mt-4 space-y-2'>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-sm text-gray-300 hover:text-white'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-sm font-semibold'>Support</h3>
            <ul className='mt-4 space-y-2'>
              {supportItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-sm text-gray-300 hover:text-white'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className='text-sm font-semibold'>Follow Us</h3>
            <div className='mt-4 flex space-x-4'>
              <Link
                href='https://twitter.com/ingomatours'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <Twitter className='h-5 w-5' />
              </Link>
              <Link
                href='https://instagram.com/ingomatours'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <Instagram className='h-5 w-5' />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 border-t border-green-900 pt-8'>
        <p className='text-center pb-8 text-xs text-gray-400'>
          © {new Date().getFullYear()} Ingoma Tours. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
