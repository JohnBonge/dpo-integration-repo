import { useState, useEffect } from 'react';

interface AnalyticsData {
  activeUsers: number;
  recentBookings: number;
  revenue: number;
  timestamp: string;
}

export function useRealTimeAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || 'ws://ingomatours.com'
    );

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'STATS_UPDATE') {
          setData(message.data);
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(new Error('WebSocket connection error'));
    };

    return () => {
      ws.close();
    };
  }, []);

  return { data, error };
}
