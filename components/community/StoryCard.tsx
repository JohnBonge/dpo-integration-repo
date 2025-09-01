import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Story } from '@prisma/client';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/community/story/${story.id}`}>
      <Card className='h-full hover:shadow-lg transition-shadow duration-200'>
        {story.image && (
          <div className='relative w-full h-48'>
            <Image
              src={story.image}
              alt={story.title}
              fill
              className='object-cover rounded-t-lg'
              loading='lazy'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              placeholder='blur'
              blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02Ky8wOUQ5NjpHOC0vQVE9PkJHTE5NUVdRVVFBTkFNUUH/2wBDAR'
            />
          </div>
        )}
        <CardHeader>
          <h3 className='text-xl font-bold line-clamp-2'>{story.title}</h3>
          <div className='text-sm text-gray-500'>
            <span>{story.authorName}</span>
            <span className='mx-2'>•</span>
            <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600 line-clamp-3'>{story.content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function StoryCardSkeleton() {
  return (
    <Card className='h-full'>
      <div className='w-full h-48'>
        <Skeleton className='w-full h-full rounded-t-lg' />
      </div>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
        <Skeleton className='h-4 w-1/2 mt-2' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-5/6' />
      </CardContent>
    </Card>
  );
}
