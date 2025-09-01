import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  variant?: 'default' | 'compact';
}

export function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'compact') {
    return (
      <div className='flex gap-4 p-2'>
        <Skeleton className='h-20 w-20 rounded-lg flex-shrink-0' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <Skeleton className='h-48 w-full' />
      <div className='p-4 space-y-3'>
        <Skeleton className='h-6 w-3/4' />
        <div className='flex gap-4'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-16 w-full' />
        <div className='flex justify-between items-center'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
      </div>
    </div>
  );
}
