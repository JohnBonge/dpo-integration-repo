import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tour = await prisma.tourPackage.findFirst({
      where: {
        slug: params.slug,
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
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const formattedTour = {
      ...tour,
      price: Number(tour.price),
      dates: tour.dates.map((date) => date.toISOString()),
      createdAt: tour.createdAt.toISOString(),
      updatedAt: tour.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedTour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();

    // Convert dates back to proper format
    const formattedData = {
      ...data,
      dates: data.dates.map((date: string) => new Date(date)),
      price: new Prisma.Decimal(data.price),
    };

    const tour = await prisma.tourPackage.update({
      where: { slug: params.slug },
      data: {
        ...formattedData,
        itinerary: {
          deleteMany: {},
          create: data.itinerary,
        },
      },
      include: {
        itinerary: true,
      },
    });

    return NextResponse.json({
      ...tour,
      price: Number(tour.price),
      dates: tour.dates.map((date) => date.toISOString()),
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}
