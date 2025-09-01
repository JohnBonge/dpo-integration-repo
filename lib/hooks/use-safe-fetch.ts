import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useSafeFetch<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const safeFetch = useCallback(async (url: string): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const cached = sessionStorage.getItem(url);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          // 5 minutes
          return data;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      sessionStorage.setItem(
        url,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch');
      setError(error);
      toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { safeFetch, isLoading, error };
}
