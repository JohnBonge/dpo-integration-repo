import Link from 'next/link';
import { Clock, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function CorporatePackageCard() {
  return (
    <Link href='/packages/corporate-tour-package'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
        <div className='relative h-48'>
          <Image
            src='https://res.cloudinary.com/diffklgzw/image/upload/v1731060258/35221342536_43ef1b1e3b_k_bvc1en.jpg'
            alt='Corporate Package'
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            loading='lazy'
            quality={75}
          />
        </div>

        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-2'>Corporate Tour Package</h3>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
            <div className='flex items-center'>
              <Clock className='w-4 h-4 mr-1' />
              <span>Customizable duration</span>
            </div>
            <div className='flex items-center'>
              <Building2 className='w-4 h-4 mr-1' />
              <span>Corporate only</span>
            </div>
          </div>

          <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
            Tailored corporate experiences for team building, conferences, and
            business retreats in Rwanda. Custom itineraries and professional
            event coordination available.
          </p>

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-bold inline-flex items-baseline gap-1'>
                From $10,000
                <span className='text-sm text-gray-500'>/package</span>
              </p>
            </div>
            <span className='text-[hsl(45,93%,47%)] text-sm'>
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
