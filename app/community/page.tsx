import { Suspense } from 'react';
import { StoryCard, StoryCardSkeleton } from '@/components/community/StoryCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/shared-metadata';
import { getApprovedStories } from '@/lib/cache/stories';

export const metadata: Metadata = {
  title: 'Travel Community Stories & Experiences',
  description:
    'Read authentic travel stories and experiences from our community members who have explored Rwanda with Ingoma Tours.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Rwanda Travel Stories - Ingoma Tours Community',
    description:
      'Real stories from travelers who have experienced Rwanda with Ingoma Tours.',
  },
};

function StoriesLoading() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function StoryList() {
  const stories = await getApprovedStories();

  if (stories.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>
          No stories have been published yet. Be the first to share your story!
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

export const revalidate = 0;

export default function CommunityPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Community Stories</h1>
        <Button asChild>
          <Link href='/community/share'>Share Your Story</Link>
        </Button>
      </div>

      <Suspense fallback={<StoriesLoading />}>
        <StoryList />
      </Suspense>
    </div>
  );
}
