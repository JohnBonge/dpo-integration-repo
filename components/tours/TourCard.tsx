import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import type { Tour } from '@/types/tour';

interface TourCardProps {
  tour: Pick<
    Tour,
    | 'id'
    | 'title'
    | 'slug'
    | 'description'
    | 'duration'
    | 'price'
    | 'location'
    | 'coverImage'
  >;
  variant?: 'default' | 'compact';
}

export default function TourCard({ tour, variant = 'default' }: TourCardProps) {
  const price = Number(tour.price);

  if (variant === 'compact') {
    return (
      <Link href={`/tours/${tour.slug}`}>
        <div className='flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors'>
          <div className='relative h-20 w-20 flex-shrink-0'>
            {tour.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                className='object-cover rounded-lg'
                sizes='80px'
              />
            ) : (
              <div className='w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'>
                <span className='text-gray-400 text-xs'>No image</span>
              </div>
            )}
          </div>

          <div className='flex-1'>
            <h4 className='font-medium text-sm mb-1 line-clamp-2'>
              {tour.title}
            </h4>
            <div className='flex items-center justify-between'>
              <div className='flex items-center text-xs text-gray-600'>
                <Clock className='w-3 h-3 mr-1' />
                <span>{tour.duration} day&apos;s</span>
              </div>
              <span className='text-sm font-semibold'>
                ${price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
        <div className='relative h-48'>
          {tour.coverImage ? (
            <Image
              src={tour.coverImage}
              alt={tour.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              loading='lazy'
              quality={75}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-400'>No image available</span>
            </div>
          )}
        </div>

        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-2'>{tour.title}</h3>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
            <div className='flex items-center'>
              <Clock className='w-4 h-4 mr-1' />
              <span>{tour.duration} day&apos;s</span>
            </div>
            <div className='flex items-center'>
              <MapPin className='w-4 h-4 mr-1' />
              <span>{tour.location}</span>
            </div>
          </div>

          <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
            {tour.description}
          </p>

          <div className='flex justify-between items-center'>
            <div>
              <p className='text-lg font-bold inline-flex items-baseline gap-1'>
                ${price.toLocaleString()}
                <span className='text-sm text-gray-500'>/person</span>
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
