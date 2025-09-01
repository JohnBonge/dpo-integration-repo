import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getFaqs = cache(async () => {
  try {
    // Add logging to debug production issues
    console.log('Fetching FAQs from database...');

    // Test database connection first
    await prisma.$connect();

    const faqs = await prisma.faq.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
      // Add select to optimize query
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        order: true,
      },
    });

    // Log success
    console.log(`Successfully fetched ${faqs.length} FAQs`);

    // Disconnect after query
    await prisma.$disconnect();

    if (!faqs || faqs.length === 0) {
      console.log('No FAQs found in database');
      return [];
    }

    return faqs;
  } catch (error) {
    // Detailed error logging
    console.error('Error fetching FAQs:', error);

    // Ensure database connection is closed on error
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }

    // Throw a more specific error
    throw new Error(
      error instanceof Error
        ? `Failed to load FAQs: ${error.message}`
        : 'Failed to load FAQs'
    );
  }
});

export const revalidate = 360; // Cache for 6 minutes
