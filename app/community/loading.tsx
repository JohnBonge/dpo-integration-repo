import Loading from '@/components/loading';

export default function CommunityLoading() {
  return (
    <div className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-6'>Ingoma Tours Community</h1>
          <Loading />
        </div>
      </div>
    </div>
  );
}
