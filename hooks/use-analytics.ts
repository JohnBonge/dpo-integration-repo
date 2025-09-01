import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { AnalyticsMessage } from '@/types/analytics';

interface UseAnalyticsReturn {
  data: AnalyticsMessage | null;
  error: Error | null;
  isConnecting: boolean;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const connect = useCallback(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
    );

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnecting(false);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as AnalyticsMessage;
        setData(message);
      } catch (err) {
        console.error('WebSocket message error:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to parse message')
        );
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(new Error('WebSocket connection error'));
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      setIsConnecting(true);
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();

    return () => {
      ws.close();
    };
  }, [connect]);

  useEffect(() => {
    if (error) {
      toast.error('Analytics connection error. Retrying...');
    }
  }, [error]);

  return { data, error, isConnecting };
}
