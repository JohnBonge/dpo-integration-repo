'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ItineraryDay = {
  day: number;
  description: string;
};

export default function TourItinerary({
  itinerary,
}: {
  itinerary: ItineraryDay[];
}) {
  return (
    <div className='mb-12'>
      <h2 className='text-2xl font-bold mb-6'>Day by Day Itinerary</h2>
      <Accordion type='single' collapsible className='w-full space-y-4'>
        {itinerary.map((day) => (
          <AccordionItem
            key={day.day}
            value={`day-${day.day}`}
            className='border rounded-lg px-4'
          >
            <AccordionTrigger className='py-4 hover:no-underline'>
              <span className='font-medium'>Day {day.day}</span>
            </AccordionTrigger>
            <AccordionContent className='py-4 text-gray-600'>
              {day.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
