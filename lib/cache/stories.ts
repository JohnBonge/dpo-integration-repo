import { StoryStatus } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export const getApprovedStories = cache(async () => {
  const stories = await prisma.story.findMany({
    where: {
      status: StoryStatus.APPROVED,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    updatedAt: new Date(story.updatedAt),
  }));
});
