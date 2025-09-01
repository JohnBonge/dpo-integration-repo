import { getTourBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Clock, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
// import ReviewSection from '@/components/tours/ReviewSection';
import RelatedTours from '@/components/tours/RelatedTours';
import { BookingForm } from '@/components/forms/booking-form';
import Image from 'next/image';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/shared-metadata';
// import type { Tour } from '@/types/tour';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const resolvedParams = { slug: decodeURIComponent(params.slug) };
  const tour = await getTourBySlug(resolvedParams.slug);

  if (!tour) {
    return {
      title: 'Tour Not Found',
      description: 'The requested tour could not be found.',
    };
  }

  const price =
    typeof tour.price === 'number'
      ? tour.price
      : parseFloat(String(tour.price));

  return {
    title: `${tour.title} - Rwanda Tour Package`,
    description: tour.description.slice(0, 155) + '...',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: tour.title,
      description: tour.description.slice(0, 155) + '...',
      images: [
        {
          url: tour.coverImage || '',
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
      type: 'article',
      tags: ['Rwanda Tours', 'Travel'],
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.title,
      description: tour.description.slice(0, 155) + '...',
      images: [tour.coverImage || ''],
    },
    alternates: {
      canonical: `https://ingomatours.com/tours/${resolvedParams.slug}`,
    },
    other: {
      price: `${price}`,
      duration: `${tour.duration} days`,
    },
  };
}

export default async function TourPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const tour = await getTourBySlug(resolvedParams.slug);

  if (!tour) {
    notFound();
  }

  const price = Number(tour.price);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <div className='relative h-[400px] mb-8 rounded-lg overflow-hidden'>
            {tour.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 66vw'
                quality={75}
                priority
              />
            ) : (
              <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-400'>No image available</span>
              </div>
            )}
          </div>

          <h1 className='text-3xl font-bold mb-4'>{tour.title}</h1>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex items-center'>
              <Clock className='w-4 h-4 mr-2' />
              <span>{tour.duration} day&apos;s</span>
            </div>
            <div className='flex items-center'>
              <Users className='w-4 h-4 mr-2' />
              <span>Group tour</span>
            </div>
          </div>
          <div className='prose max-w-none mb-8'>
            <ReactMarkdown>{tour.description}</ReactMarkdown>
          </div>

          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className='mt-8'>
              <h2 className='text-2xl font-bold mb-4'>Itinerary</h2>
              <Accordion type='single' collapsible className='w-full'>
                {tour.itinerary.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`}>
                    <AccordionTrigger className='text-xl font-semibold'>
                      Day {day.day}: {day.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='prose max-w-none'>
                        <ReactMarkdown>{day.description}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* <ReviewSection tourId={tour.id} /> */}
        </div>

        <div className='md:col-span-1'>
          <div className='sticky top-4'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-xl font-semibold mb-4'>Book This Tour</h3>
              <p className='text-2xl font-bold mb-6'>
                ${price.toLocaleString()}
              </p>
              <BookingForm tourId={tour.id} tourPrice={price} />
            </div>

            <RelatedTours currentTourId={tour.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
