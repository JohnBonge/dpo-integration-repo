'use client';

import { TourPackageForm } from '@/components/forms/tour-package-form';

export default function NewTourPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Create New Tour Package</h1>
        <TourPackageForm />
      </div>
    </div>
  );
}
