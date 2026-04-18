// In-memory rate limiter for development/small deployments
// For production at scale, use Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SimpleRateLimiter {
  private store = new Map<string, RateLimitEntry>();

  isLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    entry.count += 1;
    if (entry.count > limit) {
      return true;
    }

    return false;
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

export const rateLimiter = new SimpleRateLimiter();

// Preset limiters
export const loginLimiter = {
  isLimited: (ip: string) => rateLimiter.isLimited(`login:${ip}`, 5, 15 * 60 * 1000), // 5 attempts per 15 min
};

export const paymentLimiter = {
  isLimited: (ip: string) => rateLimiter.isLimited(`payment:${ip}`, 3, 60 * 1000), // 3 attempts per minute
};

export const apiLimiter = {
  isLimited: (ip: string) => rateLimiter.isLimited(`api:${ip}`, 100, 60 * 1000), // 100 requests per minute
};

export const registerLimiter = {
  isLimited: (ip: string) => rateLimiter.isLimited(`register:${ip}`, 5, 3600 * 1000), // 5 per hour
};
