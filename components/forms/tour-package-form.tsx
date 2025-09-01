'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { tourSchema } from '@/lib/validations/tour';
import type { TourInput } from '@/lib/validations/tour';

import { sanitizeTourData } from '@/lib/utils/sanitize';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MDEditor from '@uiw/react-md-editor';

interface TourPackageFormProps {
  initialData?: Partial<{
    id: string;
    slug: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    location: string;
    coverImage: string;
    dates: Date[];
    itinerary: {
      day: number;
      title: string;
      description: string;
    }[];
  }>;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function TourPackageForm({
  initialData,
  onClose,
  onSuccess,
}: TourPackageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TourInput>({
    resolver: zodResolver(tourSchema),
    defaultValues: sanitizeTourData(
      initialData || {
        title: '',
        description: '',
        duration: 1,
        price: 0,
        location: '',
        coverImage: '',
        dates: [],
        itinerary: [
          {
            day: 1,
            title: '',
            description: '',
          },
        ],
      }
    ),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'itinerary',
  });

  const onSubmit = async (data: TourInput) => {
    try {
      setIsLoading(true);
      const sanitizedData = sanitizeTourData(data);

      console.log('Submitting tour data:', {
        ...(initialData?.id ? { id: initialData.id } : {}),
        ...sanitizedData,
      });

      const url = initialData ? `/api/tours/${initialData.slug}` : '/api/tours';

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tour');
      }

      toast.success(
        initialData ? 'Tour updated successfully' : 'Tour created successfully'
      );
      router.push('/dashboard/tours');
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save tour'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addNewDay = () => {
    const lastDay = fields[fields.length - 1]?.day || 0;
    append({
      day: lastDay + 1,
      title: '',
      description: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter tour title' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  preview='edit'
                  height={200}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                    step={0.01}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter tour location' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='coverImage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter image URL' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-medium'>Itinerary</h3>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addNewDay}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Day
            </Button>
          </div>

          <div className='space-y-4'>
            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-4 items-start'>
                <FormField
                  control={form.control}
                  name={`itinerary.${index}.day`}
                  render={({ field }) => (
                    <FormItem className='flex-none w-20'>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder='Day'
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex-1 space-y-2'>
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder='Day title' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <MDEditor
                            value={field.value}
                            onChange={field.onChange}
                            preview='edit'
                            height={150}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => remove(index)}
                >
                  <Minus className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          {onClose && (
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : initialData
              ? 'Update Tour'
              : 'Create Tour'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
