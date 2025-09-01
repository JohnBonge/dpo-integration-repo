import { LRUCache } from 'lru-cache';
import type { Tour } from '@/types/tour';

// Define the types of data we'll cache
type CacheData = {
  'all-tours': Tour[];
  [key: `tour-${string}`]: Tour;
};

const cache = new LRUCache<keyof CacheData, CacheData[keyof CacheData]>({
  max: 100, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function getCachedData<K extends keyof CacheData>(
  key: K
): CacheData[K] | undefined {
  return cache.get(key) as CacheData[K];
}

export function setCachedData<K extends keyof CacheData>(
  key: K,
  data: CacheData[K],
  ttl?: number
): void {
  cache.set(key, data, { ttl });
}

export function invalidateCache(key: keyof CacheData): void {
  cache.delete(key);
}

// Helper functions for tours
export function getCachedTours(): Tour[] | undefined {
  return getCachedData('all-tours');
}

export function setCachedTours(tours: Tour[], ttl?: number): void {
  setCachedData('all-tours', tours, ttl);
}
