'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { PageTransition } from '@/components/motion/page-transition';
import { AnimatedSection } from '@/components/motion/animated-section';
import { AnimatedCard } from '@/components/motion/animated-card';

export default function ContactPage() {
  return (
    <PageTransition>
      <div className='py-24'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <AnimatedSection className='mb-12'>
              <h1 className='text-4xl font-bold mb-6'>Contact Us</h1>
              <p className='text-gray-600'>
                Have questions? We&apos;d love to hear from you. Send us a
                message and we&apos;ll respond as soon as possible.
              </p>
            </AnimatedSection>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              {/* Contact Information */}
              <AnimatedSection className='space-y-8' delay={0.2}>
                <AnimatedCard>
                  <div className='flex items-center mb-4'>
                    <Mail className='h-5 w-5 mr-2' />
                    <h3 className='font-semibold'>Email</h3>
                  </div>
                  <p className='text-gray-600'>info@ingomatours.com</p>
                </AnimatedCard>
                <AnimatedCard index={1}>
                  <div className='flex items-center mb-4'>
                    <Phone className='h-5 w-5 mr-2' />
                    <h3 className='font-semibold'>Phone</h3>
                  </div>
                  <p className='text-gray-600'>+250 781499058</p>
                </AnimatedCard>
                <AnimatedCard index={2}>
                  <div className='flex items-center mb-4'>
                    <MapPin className='h-5 w-5 mr-2' />
                    <h3 className='font-semibold'>Address</h3>
                  </div>
                  <p className='text-gray-600'>
                    KG 72 street 3
                    <br />
                    Kigali, Rwanda
                  </p>
                </AnimatedCard>
              </AnimatedSection>

              {/* Contact Form */}
              <AnimatedSection className='md:col-span-2' delay={0.4}>
                <ContactForm />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
