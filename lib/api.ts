import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

import type { Tour } from '@/types/tour';
import type { TourPackage, Itinerary } from '@prisma/client';
import { APIError, ValidationError } from '@/lib/errors/api-error';
import { tourSchema, type TourInput } from '@/lib/validations/tour';
import { Logger } from '@/lib/logger';
import { sanitizeTourData } from '@/lib/utils/sanitize';
import {
  validatePrice,
  validateDates,
  validateItineraryOrder,
} from '@/lib/utils/validate';

interface TourWithItinerary extends TourPackage {
  itinerary: Itinerary[];
}

export function validateTour(tour: TourWithItinerary): void {
  try {
    const sanitizedData = sanitizeTourData(tour);

    // Validate price
    validatePrice(sanitizedData.price);

    // Validate dates if they exist
    if (sanitizedData.dates?.length) {
      validateDates(sanitizedData.dates);
    }

    // Validate itinerary order
    if (sanitizedData.itinerary?.length) {
      if (!validateItineraryOrder(sanitizedData.itinerary)) {
        throw new Error('Itinerary days must be in sequential order');
      }
    }

    tourSchema.parse(sanitizedData);
  } catch (error) {
    Logger.error('Tour validation failed', error, { tourId: tour.id });
    throw new ValidationError('Invalid tour data', error);
  }
}

export async function getTours(): Promise<Tour[]> {
  try {
    const tours = await prisma.tourPackage.findMany({
      include: {
        itinerary: {
          orderBy: {
            day: 'asc',
          },
        },
      },
      orderBy: {
        price: 'desc',
      },
    });

    // Format each tour to match the Tour interface
    return tours.map((tour) => ({
      id: tour.id,
      name: tour.title,
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      duration: tour.duration,
      price: Number(tour.price),
      location: tour.location,
      coverImage: tour.coverImage,
      included: tour.included,
      excluded: tour.excluded,
      dates: tour.dates.map((date) => date.toISOString()),
      createdAt: tour.createdAt.toISOString(),
      updatedAt: tour.updatedAt.toISOString(),
      itinerary: tour.itinerary.map((item) => ({
        id: item.id,
        day: item.day,
        title: item.title,
        description: item.description,
      })),
    }));
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw new APIError('Failed to fetch tours', 'FETCH_ERROR', 500, error);
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const tour = await prisma.tourPackage.findFirst({
      where: {
        slug: slug,
      },
      include: {
        itinerary: {
          orderBy: {
            day: 'asc',
          },
        },
      },
    });

    if (!tour) {
      return null;
    }

    return {
      ...tour,
      price: Number(tour.price),
      dates: tour.dates.map((date) => date.toISOString()),
      createdAt: tour.createdAt.toISOString(),
      updatedAt: tour.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null; // Return null instead of throwing error
  }
}

// Add a new function to validate tour data before creation/update
export function validateTourData(data: unknown): TourInput {
  try {
    return tourSchema.parse(data);
  } catch (error) {
    throw new ValidationError('Invalid tour data', error);
  }
}

// Add this function for client components
export async function fetchTours() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tours`);
    if (!response.ok) {
      throw new Error('Failed to fetch tours');
    }
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function handleError(error: unknown) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
