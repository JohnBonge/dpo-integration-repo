import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { PageTransition } from '@/components/motion/page-transition';
import { StoryStatus } from '@prisma/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: {
    id: string;
  };
}

async function getStory(id: string) {
  try {
    const story = await prisma.story.findUnique({
      where: {
        id,
        status: StoryStatus.APPROVED,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        authorName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!story) return null;

    return {
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

export default async function StoryPage({ params }: PageProps) {
  const story = await getStory(params.id);

  if (!story) {
    notFound();
  }

  return (
    <PageTransition>
      <article className='container mx-auto px-4 py-12 max-w-4xl'>
        <header className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>{story.title}</h1>
          <div className='flex items-center text-gray-500'>
            <span>{story.authorName}</span>
            <span className='mx-2'>•</span>
            <span>{format(new Date(story.createdAt), 'MMMM d, yyyy')}</span>
          </div>
        </header>

        {story.image && (
          <div className='relative w-full h-[400px] mb-8 rounded-lg overflow-hidden'>
            <Image
              src={story.image}
              alt={story.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        )}

        <div className='prose prose-lg max-w-none'>
          <Markdown
            remarkPlugins={[remarkGfm]}
            className='prose prose-slate prose-headings:font-bold prose-a:text-yellow-500'
          >
            {story.content}
          </Markdown>
        </div>
      </article>
    </PageTransition>
  );
}
