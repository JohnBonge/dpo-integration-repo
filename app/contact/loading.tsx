import Loading from '@/components/loading';

export default function ContactLoading() {
  return (
    <div className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <Loading />
        </div>
      </div>
    </div>
  );
}
