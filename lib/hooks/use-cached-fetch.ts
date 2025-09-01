import { useSafeFetch } from './use-safe-fetch';
import { useEffect, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseCachedFetchOptions {
  skipInitialFetch?: boolean;
}

export function useCachedFetch<T>(options: UseCachedFetchOptions = {}) {
  const { skipInitialFetch = false } = options;
  const { safeFetch, isLoading, error } = useSafeFetch<T>();
  const [data, setData] = useState<T | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url || skipInitialFetch) return;

    const fetchData = async () => {
      const cached = cache.get(url) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        return;
      }

      const result = await safeFetch(url);
      if (result) {
        cache.set(url, { data: result, timestamp: Date.now() });
        setData(result);
      }
    };

    fetchData();
  }, [url, safeFetch, skipInitialFetch]);

  const clearCache = (urlToClear?: string) => {
    if (urlToClear) {
      cache.delete(urlToClear);
    } else if (url) {
      cache.delete(url);
    }
  };

  const forceRefresh = async () => {
    if (url) {
      clearCache(url);
      const result = await safeFetch(url);
      if (result) {
        cache.set(url, { data: result, timestamp: Date.now() });
        setData(result);
      }
    }
  };

  const fetchUrl = (newUrl: string) => {
    setUrl(newUrl);
  };

  return {
    data,
    isLoading,
    error,
    clearCache,
    forceRefresh,
    fetchUrl,
  };
}
