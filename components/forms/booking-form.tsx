'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addDays } from 'date-fns';

import Select from 'react-select';

import { Label } from '@/components/ui/label';
import { SingleValue } from 'react-select';

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  participants: z.number().min(1, 'At least 1 participant is required'),
  startDate: z.date({
    required_error: 'Please select a date',
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  tourId: string;
  tourPrice: number;
}

interface CountryOption {
  value: string;
  label: string;
  idd: {
    root: string;
    suffixes: string[];
  };
}

export function BookingForm({ tourId, tourPrice }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [countryCode, setCountryCode] = useState<string>('');
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const participants = watch('participants', 1);
  const totalPrice = tourPrice * participants;

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,idd'
        );
        const data = await response.json();

        const options = data
          .map(
            (country: {
              name: { common: string };
              idd: { root: string; suffixes: string[] };
            }) => ({
              value: country.name.common,
              label: country.name.common,
              idd: country.idd,
            })
          )
          .sort((a: CountryOption, b: CountryOption) =>
            a.label.localeCompare(b.label)
          );

        setCountryOptions(options);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }

    fetchCountries();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tourId,
          startDate: data.startDate.toISOString(),
          phone: data.phone,
          country: data.country,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const booking = await response.json();

      toast.success(
        'Booking created! Please complete payment to confirm your reservation.'
      );

      router.push(`/bookings/confirm?bookingId=${booking.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create booking'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const countryToPhoneCode: Record<string, string> = {
    Canada: '+1',
    'United States': '+1',
    'United Kingdom': '+44',
    // Add more special cases if needed
  };

  const handleCountryChange = (value: SingleValue<CountryOption>) => {
    if (value?.value) {
      setValue('country', value.value);
      // Check special cases first
      if (countryToPhoneCode[value.value]) {
        setCountryCode(countryToPhoneCode[value.value]);
      } else if (value.idd?.root && value.idd?.suffixes?.[0]) {
        const root = value.idd.root.replace(/\./g, '');
        const suffix =
          value.idd.suffixes.length === 1 ? value.idd.suffixes[0] : '';
        setCountryCode(`${root}${suffix}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 '>
      <div>
        <Label htmlFor='name'>Name</Label>
        <Input
          placeholder='Full Name'
          {...register('customerName')}
          className={cn(
            'focus:border-yellow-500',
            errors.customerName && 'border-red-500'
          )}
        />
        {errors.customerName && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.customerName.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          placeholder='Enter your email'
          id='email'
          type='email'
          {...register('customerEmail')}
          className={cn(errors.customerEmail && 'border-red-500')}
        />
        {errors.customerEmail && (
          <span className='text-sm text-red-500'>
            {errors.customerEmail.message}
          </span>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='country'>Country</Label>
        <Select
          id='country'
          options={countryOptions}
          className={cn('basic-single', errors.country && 'border-red-500')}
          classNamePrefix='select'
          placeholder='Select your country'
          onChange={handleCountryChange}
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#9CA3AF', // gray-400
              backgroundColor: 'white',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#6B7280', // gray-500
              },
              '&:focus-within': {
                borderColor: '#EAB308', // yellow-500
                boxShadow: '0 0 0 1px rgba(234, 179, 8, 0.2)', // yellow-500/20
              },
            }),
            option: (base, { isSelected, isFocused }) => ({
              ...base,
              backgroundColor: isSelected
                ? '#EAB308'
                : isFocused
                ? '#FEF3C7'
                : 'white',
              color: isSelected ? 'white' : '#111827',
              '&:active': {
                backgroundColor: '#FEF3C7',
              },
            }),
            menu: (base) => ({
              ...base,
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }),
          }}
        />
        {errors.country && (
          <span className='text-sm text-red-500'>{errors.country.message}</span>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='phone'>Phone Number</Label>
        <div className='flex gap-2'>
          <div className='flex-shrink-0 w-16'>
            <Input
              id='countryCode'
              disabled
              value={countryCode}
              className='bg-muted text-center'
            />
          </div>
          <Input
            id='phone'
            type='tel'
            {...register('phone')}
            className={cn(errors.phone && 'border-red-500')}
            placeholder='Enter phone number'
          />
        </div>
        {errors.phone && (
          <span className='text-sm text-red-500'>{errors.phone.message}</span>
        )}
      </div>

      <div>
        <Input
          type='number'
          placeholder='Number of Participants'
          {...register('participants', { valueAsNumber: true })}
          defaultValue={1}
          min={1}
          className={cn(errors.participants && 'border-red-500')}
        />
        {errors.participants && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.participants.message}
          </p>
        )}
      </div>

      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='center' className='p-0'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setValue('startDate', date as Date);
                setOpen(false);
              }}
              initialFocus
              disabled={(date) => date < addDays(new Date(), -1)}
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div className='space-y-2 p-4 bg-gray-50 rounded-lg border'>
        <div className='text-lg font-semibold'>
          Total Price: ${totalPrice.toFixed(2)}
        </div>
        <div className='text-sm text-gray-600'>
          <div className='flex justify-between'>
            <span>Booking Fee (50% deposit):</span>
            <span className='font-medium text-green-600'>
              ${(totalPrice * 0.5).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Book Now'}
      </Button>
    </form>
  );
}
