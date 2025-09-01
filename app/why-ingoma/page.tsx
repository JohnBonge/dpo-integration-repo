import Image from 'next/image';
import { Shield, Leaf, Users, Globe } from 'lucide-react';
import { AnimatedSection } from '@/components/motion/animated-section';
import { PageTransition } from '@/components/motion/page-transition';
import { MotionDiv } from '@/components/ui/motion';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/shared-metadata';

const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'Your safety is our top priority with experienced guides and well-maintained equipment.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Tourism',
    description:
      "We practice responsible tourism to preserve Africa's natural beauty.",
  },
  {
    icon: Users,
    title: 'Local Expertise',
    description:
      'Our guides are locals with deep knowledge of the regions we explore.',
  },
  {
    icon: Globe,
    title: 'Cultural Immersion',
    description:
      'Experience authentic African culture through meaningful interactions.',
  },
];

export const metadata: Metadata = {
  title: 'Why Choose Ingoma Tours - Your Premier Rwanda Tour Guide',
  description:
    'Discover why Ingoma Tours is your best choice for exploring Rwanda. Expert local guides, sustainable tourism practices, and authentic cultural experiences.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Why Choose Ingoma Tours',
    description:
      'Experience Rwanda with expert local guides and authentic cultural experiences.',
    images: [
      {
        url: 'https://res.cloudinary.com/diffklgzw/image/upload/t_Banner 16:9/v1731060255/IMG_3317_2_ws7wez.jpg',
        width: 1200,
        height: 630,
        alt: 'Ingoma Tours Experience',
      },
    ],
  },
};

export default function WhyIngomaPage() {
  return (
    <PageTransition>
      <div className='py-24'>
        <div className='container mx-auto px-4'>
          {/* Hero Section */}
          <AnimatedSection className='text-center mb-16'>
            <h1 className='text-4xl font-bold mb-6'>
              Why Choose Ingoma Tours?
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We&apos;re more than just a tour company - we&apos;re your gateway
              to authentic African experiences.
            </p>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection className='mb-24' delay={0.2}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {features.map((feature, index) => (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className='text-center'
                >
                  <div className='inline-flex p-3 rounded-full bg-primary/10 mb-4'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </MotionDiv>
              ))}
            </div>
          </AnimatedSection>

          {/* Mission Section */}
          <AnimatedSection
            className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24'
            delay={0.4}
          >
            <div className='relative h-[400px] rounded-lg overflow-hidden'>
              <Image
                src='https://res.cloudinary.com/diffklgzw/image/upload/t_Banner 16:9/v1731060255/IMG_3317_2_ws7wez.jpg'
                alt='Our mission'
                fill
                className='object-cover'
                loading='lazy'
                sizes='(max-width: 768px) 100vw, 50vw'
                placeholder='blur'
                blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02Ky8wOUQ5NjpHOC0vQVE9PkJHTE5NUVdRVVFBTkFNUUH/2wBDAR'
              />
            </div>
            <div>
              <h2 className='text-3xl font-bold mb-6'>Our Mission</h2>
              <div className='prose prose-md'>
                <p>
                  Our mission at Ingoma Tours is to deliver exceptional,
                  personalized tour services that celebrate Rwanda’s unique
                  landscapes, wildlife, and cultural richness. Through
                  responsible tourism, we aim to create transformative
                  experiences for travelers, promote local craftsmanship, and
                  support conservation efforts. We are dedicated to making every
                  journey a meaningful adventure, leaving both visitors and
                  local communities enriched and empowered.
                </p>
                <p>
                  We believe that travel should not only enrich the lives of our
                  guests but also positively impact the destinations we visit.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Values Section */}
          <AnimatedSection className='bg-gray-50 rounded-lg p-12' delay={0.6}>
            <h2 className='text-3xl font-bold text-center mb-12'>Our Values</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  title: 'Authenticity',
                  description:
                    'We provide genuine experiences that showcase the real Africa.',
                },
                {
                  title: 'Responsibility',
                  description:
                    'We prioritize sustainable and ethical tourism practices.',
                },
                {
                  title: 'Excellence',
                  description:
                    'We strive for the highest quality in everything we do.',
                },
              ].map((value) => (
                <div key={value.title} className='text-center'>
                  <h3 className='text-xl font-semibold mb-2'>{value.title}</h3>
                  <p className='text-gray-600'>{value.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}
