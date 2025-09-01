export default function PackagesLoading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='animate-pulse space-y-4'>
        <div className='h-8 w-1/4 bg-gray-200 rounded'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-gray-200 h-64 rounded-lg'></div>
          ))}
        </div>
      </div>
    </div>
  );
}
