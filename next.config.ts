import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // HSTS header - only in production
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }] : []),
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "img-src 'self' data: https: blob:; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "connect-src 'self' https://api.safaricom.co.ke https://*.pusher.com https://js.stripe.com; " +
              "frame-src 'self' https://js.stripe.com; " +
              "frame-ancestors 'none';"
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()'
          }
        ],
      },
      // Disable caching for admin panel
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
      // Disable caching for API endpoints
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;