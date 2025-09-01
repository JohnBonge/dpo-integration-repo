import { useQuery } from '@tanstack/react-query';
import type { Tour } from '@/types/tour';

async function fetchTours(): Promise<Tour[]> {
  const response = await fetch('/api/tours');
  if (!response.ok) {
    throw new Error('Failed to fetch tours');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: fetchTours,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data for 30 minutes
  });
}
