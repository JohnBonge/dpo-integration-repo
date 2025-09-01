import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const minPrice = Number(searchParams.get('minPrice')) || undefined;
    const maxPrice = Number(searchParams.get('maxPrice')) || undefined;
    const duration = Number(searchParams.get('duration')) || undefined;

    // Build where conditions
    const whereConditions: Prisma.TourPackageWhereInput = {};
    const andConditions: Prisma.TourPackageWhereInput[] = [];

    // Add search query if provided
    if (query) {
      whereConditions.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Add price range if provided
    if (minPrice || maxPrice) {
      andConditions.push({
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      });
    }

    // Add duration if provided
    if (duration) {
      andConditions.push({ duration });
    }

    // Add AND conditions if any exist
    if (andConditions.length > 0) {
      whereConditions.AND = andConditions;
    }

    const tours = await prisma.tourPackage.findMany({
      where: whereConditions,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        duration: true,
        location: true,
        coverImage: true,
        itinerary: {
          select: {
            id: true,
            day: true,
            title: true,
            description: true,
          },
        },
        reviews: {
          take: 3,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Search tours error:', error);
    return NextResponse.json(
      { error: 'Failed to search tours' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
