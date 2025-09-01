export default function Loading() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-md mx-auto text-center'>
        <div className='animate-pulse'>
          <div className='h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4' />
          <div className='h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2' />
          <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto' />
        </div>
      </div>
    </div>
  );
}
