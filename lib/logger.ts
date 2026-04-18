/**
 * Structured logging for production auditing
 * All logs include timestamp, context, and severity level
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  ip?: string;
}

class StructuredLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, userId?: string, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      ip,
    };

    const formatted = this.formatLog(entry);

    // Output to console (production logs usually go to stdout)
    if (level === 'error' || level === 'critical') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, any>, userId?: string, ip?: string) {
    this.log('info', message, context, userId, ip);
  }

  warn(message: string, context?: Record<string, any>, userId?: string, ip?: string) {
    this.log('warn', message, context, userId, ip);
  }

  error(message: string, context?: Record<string, any>, userId?: string, ip?: string) {
    this.log('error', message, context, userId, ip);
  }

  critical(message: string, context?: Record<string, any>, userId?: string, ip?: string) {
    this.log('critical', message, context, userId, ip);
  }

  // Audit-specific logs
  logAuthAttempt(success: boolean, userId: string, ip: string, reason?: string) {
    this.log(
      success ? 'info' : 'warn',
      `Authentication ${success ? 'success' : 'failed'}`,
      { reason },
      userId,
      ip
    );
  }

  logPaymentEvent(event: 'initiated' | 'success' | 'failed', orderId: string, amount: number, context?: Record<string, any>) {
    this.log(
      event === 'failed' ? 'warn' : 'info',
      `Payment ${event}`,
      { orderId, amount, ...context }
    );
  }

  logAdminAction(action: string, userId: string, resource: string, changes?: Record<string, any>) {
    this.log(
      'info',
      `Admin action: ${action}`,
      { resource, changes },
      userId
    );
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>, ip?: string) {
    const levelMap = {
      low: 'info',
      medium: 'warn',
      high: 'error',
      critical: 'critical',
    } as const;

    this.log(
      levelMap[severity],
      `Security event: ${event}`,
      context,
      undefined,
      ip
    );
  }

  logDatabaseQuery(query: string, duration: number, success: boolean) {
    if (duration > 1000) {
      this.warn(
        `Slow database query (${duration}ms)`,
        { query }
      );
    } else if (this.isDevelopment) {
      this.debug(`Query executed (${duration}ms)`, { query });
    }
  }
}

export const logger = new StructuredLogger();
