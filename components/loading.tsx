import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4'>
      <Skeleton className='h-8 w-8 rounded-full' />
      <Skeleton className='h-4 w-24' />
    </div>
  );
}
