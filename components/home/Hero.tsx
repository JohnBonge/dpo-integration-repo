'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { AnimatedText } from '@/components/motion/animated-text';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className='relative isolate overflow-hidden bg-gray-900'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-black/60' />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0, ease: 'easeOut' }}
          src='https://res.cloudinary.com/diffklgzw/image/upload/v1731060255/50489669208_fc63428e08_o_jvm2ky.jpg'
          alt='Hero background'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:mx-0 relative z-10'>
          <AnimatedHeading className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            Discover Your Next Adventure
          </AnimatedHeading>
          <AnimatedText
            className='mt-6 text-base leading-8 text-gray-300'
            delay={0.2}
          >
            Where Adventure and Rhythm Collide! Immerse yourself in the vibrant
            culture of East Africa through exhilarating tours, live music, and
            incredible DJs. Join us for experiential cultural, adventure,
            culinary, wellness, and evening tours.
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='mt-10 flex items-center gap-x-6'
          >
            <Button asChild size='lg'>
              <Link href='/packages'>Explore Tours</Link>
            </Button>
            <Link
              href='/contact'
              className='text-sm font-semibold leading-6 text-white'
            >
              Contact Us <span aria-hidden='true'>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
