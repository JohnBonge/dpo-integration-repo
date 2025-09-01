import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
  limit?: number;
}

export class RateLimit {
  private tokenCache: LRUCache<string, number[]>;
  private interval: number;
  private limit: number;

  constructor(options?: RateLimitOptions) {
    this.tokenCache = new LRUCache({
      max: options?.uniqueTokenPerInterval || 500,
      ttl: options?.interval || 60000,
    });
    this.interval = options?.interval || 60000;
    this.limit = options?.limit || 30;
  }

  async check(token: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const timestamps = this.tokenCache.get(token) || [];
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.interval
    );

    if (validTimestamps.length >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: Math.ceil((validTimestamps[0] + this.interval - now) / 1000),
      };
    }

    validTimestamps.push(now);
    this.tokenCache.set(token, validTimestamps);

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - validTimestamps.length,
      reset: Math.ceil((now + this.interval - Date.now()) / 1000),
    };
  }
}

// Create a more lenient rate limiter for the tours API
const toursLimiter = new RateLimit({
  interval: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute
});

export async function rateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const result = await toursLimiter.check(ip);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        reset: result.reset,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': result.reset.toString(),
        },
      }
    );
  }

  return null;
}
