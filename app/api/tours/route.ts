import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be positive'),
  location: z.string().min(1, 'Location is required'),
  coverImage: z.string().url('A valid image URL is required'),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z
    .array(
      z.object({
        day: z.number(),
        title: z.string(),
        description: z.string(),
      })
    )
    .default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = tourSchema.parse(body);

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tour = await prisma.tourPackage.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        duration: validatedData.duration,
        price: validatedData.price,
        location: validatedData.location,
        coverImage: validatedData.coverImage,
        included: validatedData.included,
        excluded: validatedData.excluded,
        itinerary:
          validatedData.itinerary.length > 0
            ? {
                create: validatedData.itinerary,
              }
            : undefined,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Tour creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create tour package' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tours = await prisma.tourPackage.findMany({
      include: {
        itinerary: true,
      },
      orderBy: {
        price: 'desc',
      },
    });

    const formattedTours = tours.map((tour) => ({
      ...tour,
      price: Number(tour.price),
      dates: tour.dates.map((date) => date.toISOString()),
      createdAt: tour.createdAt.toISOString(),
      updatedAt: tour.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedTours);
  } catch (error) {
    console.error('Failed to fetch tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}
