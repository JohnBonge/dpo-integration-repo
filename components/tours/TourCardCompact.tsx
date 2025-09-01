import Link from 'next/link';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface TourCardCompactProps {
  tour: {
    id: string;
    title: string;
    duration: number;
    price: number | { toString: () => string };
    coverImage: string;
  };
}

export default function TourCardCompact({ tour }: TourCardCompactProps) {
  const slug = tour.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const price =
    typeof tour.price === 'number' ? tour.price : Number(tour.price.toString());

  return (
    <Link href={`/tours/${encodeURIComponent(slug)}`}>
      <div className='flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors'>
        <div className='relative h-20 w-20 flex-shrink-0'>
          {tour.coverImage ? (
            <Image
              src={tour.coverImage}
              alt={tour.title}
              fill
              className='object-cover rounded-lg'
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
              <span>{tour.duration} days</span>
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
