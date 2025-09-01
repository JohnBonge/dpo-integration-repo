'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQ } from '@/types/faq';
import Markdown from 'react-markdown';

interface FAQSectionProps {
  category: string;
  faqs: FAQ[];
}

export function FAQSection({ category, faqs }: FAQSectionProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900'>{category}</h2>
      <Accordion type='single' collapsible className='space-y-2'>
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className='border rounded-lg px-4'
          >
            <AccordionTrigger className='text-left hover:no-underline py-4'>
              <span className='text-gray-800 font-medium'>{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className='text-gray-600 pb-4'>
              <Markdown className='prose  prose-sm prose-text:text-gray-600'>
                {faq.answer}
              </Markdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
