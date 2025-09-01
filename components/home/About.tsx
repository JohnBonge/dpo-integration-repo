'use client';

import Image from 'next/image';
import { AnimatedSection } from '@/components/motion/animated-section';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { AnimatedText } from '@/components/motion/animated-text';
import { AnimatedList } from '@/components/motion/animated-list';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-2 items-center'>
          <AnimatedSection>
            <AnimatedHeading className='text-3xl font-bold mb-6'>
              Why Choose Ingoma Tours?
            </AnimatedHeading>
            <div className='space-y-4'>
              <AnimatedText className='text-base'>
                Ingoma Tours Company is a premier tour guide service based in
                Rwanda, dedicated to offering unforgettable travel experiences
                that showcase the beauty and culture of this remarkable country.
                Our packages are thoughtfully designed to include the most
                breathtaking adventures, from the awe- inspiring Gorilla
                Trekking experience in the misty mountains, to authentic local
                cultural immersions that connect travelers with Rwanda’s rich
                heritage.
              </AnimatedText>
              <AnimatedText delay={0.2}>
                Our expert local guides, sustainable practices, and deep
                connection to local communities ensure that every journey with
                us is authentic, responsible, and unforgettable.
              </AnimatedText>
              <AnimatedList delay={0.4} className='space-y-2'>
                {[
                  'Expert Local Guides',
                  'Sustainable Tourism',
                  'Authentic Experiences',
                  'Customizable Itineraries',
                ].map((item) => (
                  <li key={item} className='flex items-center space-x-2'>
                    <svg
                      className='h-5 w-5 text-green-500'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path d='M5 13l4 4L19 7'></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </AnimatedList>
            </div>
          </AnimatedSection>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className='relative h-[500px] rounded-lg overflow-hidden'
          >
            <Image
              src='https://res.cloudinary.com/diffklgzw/image/upload/t_Banner 16:9/v1732989126/IMG_7860_2_copy_nj7xxm.jpg'
              alt='Safari experience'
              fill
              className='object-cover'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
