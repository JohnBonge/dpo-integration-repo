'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';

export function TrustBadges() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const badges = [
    {
      name: 'Trustpilot',
      logo: 'https://res.cloudinary.com/diffklgzw/image/upload/v1732982934/Trustpilot-Logo-removebg-preview_vzjgpr.png',
      rating: 4.3,
      starColor: '#00B67A',
      url: 'https://www.trustpilot.com/review/ingomatours.com',
      width: 120,
      height: 30,
    },
    {
      name: 'Google Reviews',
      logo: 'https://res.cloudinary.com/diffklgzw/image/upload/v1732982934/google-removebg-preview_hke9l1.png',
      rating: 4.9,
      starColor: '#FBC02D',
      url: 'https://g.co/kgs/Nb1513',
      width: 100,
      height: 30,
    },
    {
      name: 'Tripadvisor',
      logo: 'https://res.cloudinary.com/diffklgzw/image/upload/v1732982934/Tripadvisor-Logo-2020-present-removebg-preview_k0gvfd.png',
      rating: 4.9,
      starColor: '#00AA6C',
      url: 'https://www.tripadvisor.com/Attraction_Review-g293829-d26286187-Reviews-Ingoma_Tours-Kigali_Kigali_Province.html',
      width: 120,
      height: 30,
    },
  ];

  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-8'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-4'>Trusted By Travelers</h2>
          <p className='text-gray-600'>
            See what our customers say about us on trusted platforms
          </p>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {badges.map((badge) => (
            <motion.div key={badge.name} variants={itemVariants}>
              <Link
                href={badge.url}
                target='_blank'
                className='flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow'
              >
                <div className='mb-4'>
                  <Image
                    src={badge.logo}
                    alt={`${badge.name} logo`}
                    width={badge.width}
                    height={badge.height}
                    className='h-12 object-contain'
                  />
                </div>
                <div className='flex items-center mb-2'>
                  {[...Array(5)].map((_, i) => {
                    const starValue = badge.rating - i;
                    let starOpacity = 1;

                    if (starValue < 1 && starValue > 0) {
                      // For partial stars
                      starOpacity = starValue;
                    } else if (starValue <= 0) {
                      // For empty stars
                      starOpacity = 0;
                    }

                    return (
                      <div key={i} className='relative'>
                        {/* Background star (gray) */}
                        <StarIcon
                          className='w-5 h-5 fill-current'
                          style={{ color: '#E5E7EB' }}
                        />
                        {/* Foreground star (colored with opacity for partial filling) */}
                        <StarIcon
                          className='w-5 h-5 fill-current absolute top-0 left-0'
                          style={{
                            color: badge.starColor,
                            opacity: starOpacity,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <span className='text-sm font-semibold'>
                  {badge.rating} out of 5
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
