/**
 * Environment validation for production-critical secrets
 * Run this on application startup to fail fast if secrets are misconfigured
 */

function validateEnvironment(): void {
  const errors: string[] = [];

  // Check JWT_SECRET length (minimum 64 characters = 512 bits)
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    errors.push('JWT_SECRET is not set');
  } else if (jwtSecret.length < 64) {
    errors.push(`JWT_SECRET is too short (${jwtSecret.length} chars). Minimum 64 characters (512 bits) required.`);
  }

  // Check ADMIN_PASSWORD_HASH exists
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash) {
    errors.push('ADMIN_PASSWORD_HASH is not set');
  } else if (!adminHash.startsWith('$2b$') && !adminHash.startsWith('$2a$')) {
    errors.push('ADMIN_PASSWORD_HASH does not appear to be a valid bcrypt hash (must start with $2b$ or $2a$)');
  }

  // Check ADMIN_SESSION_SECRET length
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!sessionSecret) {
    errors.push('ADMIN_SESSION_SECRET is not set');
  } else if (sessionSecret.length < 64) {
    errors.push(`ADMIN_SESSION_SECRET is too short (${sessionSecret.length} chars). Minimum 64 characters required.`);
  }

  // Check MONGODB_URI in production
  if (process.env.NODE_ENV === 'production') {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      errors.push('MONGODB_URI is not set');
    } else if (!mongoUri.includes('?')) {
      errors.push('MONGODB_URI appears invalid (missing query parameters)');
    }
  }

  // If any errors, throw and fail startup
  if (errors.length > 0) {
    console.error('❌ CRITICAL: Environment validation failed:');
    errors.forEach(err => console.error(`   - ${err}`));
    throw new Error('Failed environment validation. Fix the errors above and restart.');
  }

  console.log('✅ Environment validation passed');
}

// Run validation on module load (application startup)
if (typeof window === 'undefined') {
  // Only run on server-side
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Fatal error during environment validation:', error);
    process.exit(1);
  }
}

export { validateEnvironment };
