import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getOptimizedTours = cache(async () => {
  const tours = await prisma.tourPackage.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      duration: true,
      location: true,
      coverImage: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 50,
  });

  return tours;
});
