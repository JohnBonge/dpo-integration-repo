import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/shared-metadata';
import { getFaqs } from '@/lib/cache/faqs';
import { FAQSection } from '@/components/faq/faq-section';
import type { FAQ } from '@/types/faq';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const faqs = (await getFaqs()) as FAQ[];

    // Get unique categories using Array.from to handle Set iteration
    const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

    // Create a description that includes categories
    const categoryList = categories.join(', ');
    const description = `Find answers to frequently asked questions about ${categoryList} when traveling with Ingoma Tours in Rwanda.`;

    // Generate keywords from FAQ questions and categories
    const keywords = [
      'Rwanda FAQs',
      'Rwanda travel questions',
      ...categories,
      ...faqs.slice(0, 5).map((faq) => faq.question), // Include first 5 questions as keywords
    ];

    return {
      title: 'Frequently Asked Questions about Rwanda Tours',
      description,
      openGraph: {
        ...defaultMetadata.openGraph,
        title: 'Rwanda Tours FAQ - Ingoma Tours',
        description,
        type: 'website', // Changed from 'faq' to valid OpenGraph type
      },
      keywords: keywords.join(', '),
      other: {
        'faq-count': `${faqs.length}`,
        'faq-categories': categoryList,
      },
    };
  } catch (error) {
    // Fallback metadata if FAQs can't be loaded
    return {
      title: 'Frequently Asked Questions - Ingoma Tours',
      description:
        'Find answers to common questions about traveling in Rwanda with Ingoma Tours.',
      openGraph: {
        ...defaultMetadata.openGraph,
        title: 'Ingoma Tours FAQ',
        description: 'Common questions about traveling in Rwanda',
      },
    };
  }
}

export default async function FAQsPage() {
  try {
    const faqs = (await getFaqs()) as FAQ[];

    const groupedFaqs = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Frequently Asked Questions
        </h1>

        <div className='space-y-6'>
          {Object.entries(groupedFaqs).map(([category, faqs]) => (
            <FAQSection key={category} category={category} faqs={faqs} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return <div>Failed to load FAQs. Please try again later.</div>;
  }
}
