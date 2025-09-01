'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormInputs {
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  image: FileList;
}

export function ShareStoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    const formData = new FormData();

    try {
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('authorName', data.authorName);
      formData.append('authorEmail', data.authorEmail);
      formData.append('image', data.image[0]);

      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit story');
      }

      toast.success('Story submitted successfully!');
      router.push('/community');
    } catch (error) {
      console.error('Story submission error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit story'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <Input
          {...register('title', { required: 'Title is required' })}
          placeholder='Story Title'
        />
        {errors.title && (
          <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('authorName', { required: 'Name is required' })}
          placeholder='Your Name'
        />
        {errors.authorName && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.authorName.message}
          </p>
        )}
      </div>

      <div>
        <Input
          {...register('authorEmail', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type='email'
          placeholder='Your Email'
        />
        {errors.authorEmail && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.authorEmail.message}
          </p>
        )}
      </div>

      <div>
        <Textarea
          {...register('content', {
            required: 'Story content is required',
            minLength: {
              value: 50,
              message: 'Story must be at least 50 characters',
            },
          })}
          rows={6}
          placeholder='Share your story...'
        />
        {errors.content && (
          <p className='text-red-500 text-sm mt-1'>{errors.content.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('image', { required: 'Image is required' })}
          type='file'
          accept='image/jpeg,image/png,image/webp'
        />
        {errors.image && (
          <p className='text-red-500 text-sm mt-1'>{errors.image.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Story'}
      </Button>
    </form>
  );
}
