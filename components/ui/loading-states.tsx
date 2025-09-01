interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className='animate-spin rounded-full border-b-2 border-primary h-full w-full' />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className='p-4 space-y-4'>
      <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
      <div className='h-4 bg-gray-200 rounded animate-pulse w-1/2' />
      <div className='h-4 bg-gray-200 rounded animate-pulse w-5/6' />
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className='space-y-4'>
      <div className='h-8 bg-gray-200 rounded animate-pulse' />
      {[...Array(5)].map((_, i) => (
        <div key={i} className='h-12 bg-gray-100 rounded animate-pulse' />
      ))}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-xl'>
        <LoadingSpinner size='lg' />
        <p className='mt-4 text-center'>Loading...</p>
      </div>
    </div>
  );
}
