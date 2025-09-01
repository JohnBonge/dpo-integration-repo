'use client';

import React from 'react';
import { ShareStoryForm } from '@/components/community/ShareStoryForm';

export default function ShareStoryPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Share Your Story</h1>
        <ShareStoryForm />
      </div>
    </div>
  );
}
