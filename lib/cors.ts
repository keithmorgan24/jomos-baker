/**
 * CORS Configuration
 * Restricts API access to your domain only
 */

const ALLOWED_ORIGINS = [
  'https://jomobakers.co.ke',
  'https://www.jomobakers.co.ke',
  'http://localhost:3000', // Development only
];

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export function getCORSHeaders(origin?: string): Record<string, string> {
  const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin) || (IS_DEVELOPMENT && origin?.includes('localhost'));

  if (!isAllowed && !IS_DEVELOPMENT) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': isAllowed && origin ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function validateCORSOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (IS_DEVELOPMENT && origin.includes('localhost')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Handle CORS preflight requests (OPTIONS)
 * Use in API routes: 
 *   if (request.method === 'OPTIONS') {
 *     return handleCORSPreflight(request);
 *   }
 */
export function handleCORSPreflight(request: Request) {
  const origin = request.headers.get('origin');
  
  if (!validateCORSOrigin(origin || undefined)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 200,
    headers: getCORSHeaders(origin || undefined),
  });
}
