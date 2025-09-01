import Image from 'next/image';
import { Clock, Building2, Users } from 'lucide-react';
import { CorporateContactForm } from '@/components/forms/corporate-contact-form';

export default function CorporatePackagePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <div className='relative h-[400px] mb-8 rounded-lg overflow-hidden'>
            <Image
              src='https://res.cloudinary.com/diffklgzw/image/upload/v1731060258/35221342536_43ef1b1e3b_k_bvc1en.jpg'
              alt='Corporate Tour Package'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 66vw'
              quality={75}
              priority
            />
          </div>

          <h1 className='text-3xl font-bold mb-4'>Corporate Tour Package</h1>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex items-center'>
              <Clock className='w-4 h-4 mr-2' />
              <span>Customizable duration</span>
            </div>
            <div className='flex items-center'>
              <Building2 className='w-4 h-4 mr-2' />
              <span>Corporate only</span>
            </div>
            <div className='flex items-center'>
              <Users className='w-4 h-4 mr-2' />
              <span>Group tours</span>
            </div>
          </div>

          <div className='prose max-w-none mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>About This Package</h2>
            <p className='text-gray-600 mb-4'>
              Our Corporate Tour Package is specially designed to cater to
              businesses looking for exceptional team-building experiences,
              conference venues, or corporate retreats in Rwanda. We understand
              that every organization has unique needs and objectives, which is
              why we offer fully customizable packages that can be tailored to
              your specific requirements.
            </p>

            <h3 className='text-xl font-semibold mb-3'>What We Offer:</h3>
            <ul className='list-disc pl-6 mb-6 text-gray-600'>
              <li>
                Customizable itineraries to match your schedule and preferences
              </li>
              <li>Professional event coordination and management</li>
              <li>Team building activities and workshops</li>
              <li>Conference and meeting facilities</li>
              <li>Luxury accommodation options</li>
              <li>Transportation and logistics management</li>
              <li>Cultural experiences and excursions</li>
              <li>Catering services</li>
            </ul>

            <h3 className='text-xl font-semibold mb-3'>Perfect For:</h3>
            <ul className='list-disc pl-6 mb-6 text-gray-600'>
              <li>Team building retreats</li>
              <li>Corporate conferences</li>
              <li>Executive meetings</li>
              <li>Incentive travel programs</li>
              <li>Client appreciation events</li>
            </ul>
          </div>
        </div>

        <div className='md:col-span-1'>
          <div className='sticky top-4'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-xl font-semibold mb-4'>
                Request Information
              </h3>
              <p className='text-2xl font-bold mb-2'>
                From $10,000
                <span className='text-sm text-gray-500 block'>per package</span>
              </p>
              <p className='text-sm text-gray-600 mb-6'>
                * Final price depends on group size and package customization
              </p>
              <CorporateContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
