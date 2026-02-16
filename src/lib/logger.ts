/**
 * Centralized logging utility for SuperDuperDashboard.
 * In production, this can be swapped with Sentry, LogRocket, or Datadog.
 */

import * as Sentry from "@sentry/react";

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
    
    // 1. Development: Always log to console
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`${prefix} ${message}`, details);
    }

    // 2. Production: Send critical data to Sentry
    if (import.meta.env.PROD) {
      if (level === 'error' || level === 'warn') {
        Sentry.captureMessage(message, {
          level: level === 'error' ? 'error' : 'warning',
          extra: {
            context: details?.context,
            metadata: details?.metadata,
            timestamp
          },
          user: details?.user_id ? { id: details.user_id } : undefined,
        });

        if (details?.error) {
          Sentry.captureException(details.error);
        }
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
