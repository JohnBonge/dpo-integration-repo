'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

type Review = {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  source: string;
  createdAt: string;
};

export default function ReviewSection({ tourId }: { tourId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // In a real app, this would fetch reviews for the specific tourId
    setReviews([
      {
        id: '1',
        rating: 5,
        comment:
          'Amazing experience! The guides were knowledgeable and friendly.',
        authorName: 'John Doe',
        source: 'Google',
        createdAt: '2024-02-15',
      },
      // Add more reviews...
    ]);
  }, [tourId]);

  return (
    <div className='mt-12'>
      <h2 className='text-2xl font-bold mb-6'>Reviews</h2>
      <div className='space-y-6'>
        {reviews.map((review) => (
          <div key={review.id} className='border-b pb-6'>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center space-x-2'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='font-medium'>{review.authorName}</span>
              </div>
              <span className='text-sm text-gray-500'>via {review.source}</span>
            </div>
            <p className='text-gray-600'>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
