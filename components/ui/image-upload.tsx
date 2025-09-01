'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <input
        type='file'
        accept='image/*'
        onChange={handleUpload}
        className='hidden'
        id='image-upload'
      />
      <label htmlFor='image-upload' className='cursor-pointer'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative w-40 h-40 rounded-lg border-2 border-dashed'>
            {value ? (
              <Image
                src={value}
                alt='Upload'
                fill
                className='object-cover rounded-lg'
              />
            ) : (
              <div className='flex flex-col items-center justify-center h-full'>
                <Upload className='h-10 w-10 text-gray-400' />
                <span className='text-sm text-gray-500'>Upload Image</span>
              </div>
            )}
          </div>
          <Button type='button' disabled={isUploading} variant='outline'>
            {isUploading ? 'Uploading...' : 'Change Image'}
          </Button>
        </div>
      </label>
    </div>
  );
}
