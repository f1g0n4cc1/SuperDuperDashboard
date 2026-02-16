/**
 * Centralized logging utility for SuperDuperDashboard.
 * In production, this can be swapped with Sentry, LogRocket, or Datadog.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogDetails {
  context?: string;
  user_id?: string;
  metadata?: Record<string, any>;
  error?: Error | unknown;
}

export const logger = {
  log(level: LogLevel, message: string, details?: LogDetails) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    // Always log to console in development
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`${prefix} ${message}`, details);
    }

    // In Production, send to external monitoring service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureMessage(message, { level, extra: details });
      if (level === 'error') {
        console.error(`${prefix} CRITICAL FAILURE: ${message}`, details);
      }
    }
  },

  error(message: string, details?: LogDetails) {
    this.log('error', message, details);
  },

  warn(message: string, details?: LogDetails) {
    this.log('warn', message, details);
  },

  info(message: string, details?: LogDetails) {
    this.log('info', message, details);
  },

  debug(message: string, details?: LogDetails) {
    this.log('debug', message, details);
  }
};
