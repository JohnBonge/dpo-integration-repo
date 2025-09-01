'use client';

import Link from 'next/link';
import { Compass, Users, Clock, Phone } from 'lucide-react';
import { AnimatedSection } from '@/components/motion/animated-section';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { AnimatedText } from '@/components/motion/animated-text';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Expert Guides',
    description: 'Local guides with deep knowledge and passion',
    icon: Users,
    href: '/why-ingoma',
  },
  {
    name: 'Custom Tours',
    description: 'Tailored experiences for your preferences',
    icon: Compass,
    href: '/packages',
  },
  {
    name: 'Flexible Booking',
    description: 'Easy scheduling and free cancellation',
    icon: Clock,
    href: '/packages',
  },
  {
    name: '24/7 Support',
    description: 'Always here to help during your journey',
    icon: Phone,
    href: '/contact',
  },
];

export default function CtaSection() {
  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <AnimatedSection className='text-center mb-12'>
          <AnimatedHeading className='text-3xl font-bold mb-4'>
            Why Travel with Us?
          </AnimatedHeading>
          <AnimatedText className='text-gray-600 max-w-2xl mx-auto'>
            Experience the difference with Ingoma Tours. We provide exceptional
            service and unforgettable adventures across Africa.
          </AnimatedText>
        </AnimatedSection>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Link
                href={feature.href}
                className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 block'
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='p-2 bg-primary/10 rounded-full mb-4'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>{feature.name}</h3>
                  <p className='text-gray-600 text-sm'>{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
