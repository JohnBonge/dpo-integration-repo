import { Card } from '@/components/ui/card';
import { AnimatedSection } from '@/components/motion/animated-section';
import Image from 'next/image';

const hotelPartners = [
  {
    name: 'Marriott Hotels',
    logo: '/logo_images/mariot.png',
    description: 'Premium accommodations worldwide',
    colors:
      'from-red-100 to-red-200 group-hover:from-red-200 group-hover:to-red-300',
    textColor: 'text-red-600',
    initials: 'MAR',
  },
  {
    name: 'Ngorongoro Serena Lodge',
    logo: '/logo_images/Serena.png',
    description: 'Iconic luxury in Tanzania',
    colors:
      'from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300',
    textColor: 'text-green-600',
    initials: 'SER',
  },
  {
    name: 'Tarangire Ecolodge',
    logo: '/logo_images/sarangire.png',
    description: 'Eco-friendly luxury experience',
    colors:
      'from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300',
    textColor: 'text-emerald-600',
    initials: 'SAR',
  },
  {
    name: 'Sambora Lodge',
    logo: '/logo_images/sambora.png',
    description: 'Premium lodge accommodation',
    colors:
      'from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300',
    textColor: 'text-amber-600',
    initials: 'SAM',
  },
  {
    name: 'Rushel Lodge',
    logo: '/logo_images/RUSHEL_LOGO.png',
    description: 'Boutique mountain retreat',
    colors:
      'from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300',
    textColor: 'text-blue-600',
    initials: 'RUS',
  },
  {
    name: 'Ecolodge Rwanda',
    logo: '/logo_images/ecolodge.png',
    description: 'Sustainable luxury accommodation',
    colors:
      'from-teal-100 to-teal-200 group-hover:from-teal-200 group-hover:to-teal-300',
    textColor: 'text-teal-600',
    initials: 'ECO',
  },
];

export function HotelPartners() {
  return (
    <section className='py-8 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <AnimatedSection>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Our Hotel Partners
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              We partner with premium hotels to ensure your stay is as memorable
              as your tour experience
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {hotelPartners.map((hotel) => (
              <Card
                key={hotel.name}
                className='p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 group'
              >
                <div className='flex flex-col items-center text-center space-y-3'>
                  {/* Actual hotel logo */}
                  <div className='w-16 h-16 relative rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center'>
                    <Image
                      src={hotel.logo}
                      alt={`${hotel.name} logo`}
                      width={48}
                      height={48}
                      className='object-contain max-w-12 max-h-12'
                    />
                  </div>

                  <div>
                    <h3 className='font-semibold text-sm text-gray-900 mb-1'>
                      {hotel.name}
                    </h3>
                    <p className='text-xs text-gray-500 leading-tight'>
                      {hotel.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className='text-center mt-8'>
            <p className='text-sm text-gray-500'>
              + Many more premium accommodations across the East Africa.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
