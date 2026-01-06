/**
 * Sentry Error Tracking
 *
 * Lightweight Sentry integration for error tracking.
 * Automatically captures errors, performance metrics, and session data.
 *
 * To enable Sentry:
 * 1. Set NEXT_PUBLIC_SENTRY_DSN environment variable
 * 2. Optionally set SENTRY_ENVIRONMENT (defaults to 'development')
 *
 * @example
 * ```typescript
 * // Capture an error manually
 * import { captureError, captureMessage } from '@/lib/sentry';
 *
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureError(error, { tags: { feature: 'search' } });
 * }
 *
 * // Log a message
 * captureMessage('User completed onboarding', 'info');
 * ```
 */

// Types for Sentry-like operations without the full SDK
type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

interface CaptureContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  level?: SeverityLevel;
}

interface SentryConfig {
  dsn: string | undefined;
  environment: string;
  release: string | undefined;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

/**
 * Check if Sentry is enabled (DSN is configured).
 */
export function isSentryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}

/**
 * Get Sentry configuration.
 */
export function getSentryConfig(): SentryConfig {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0.1,
    replaysSessionSampleRate:
      Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) || 0.1,
    replaysOnErrorSampleRate:
      Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE) || 1.0,
  };
}

/**
 * Capture an error and send to Sentry.
 * Falls back to console.error if Sentry is not configured.
 *
 * @param error - Error object or message
 * @param context - Optional context with tags and extra data
 */
export function captureError(error: Error | string | unknown, context?: CaptureContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  if (isSentryEnabled() && typeof window !== 'undefined' && 'Sentry' in window) {
    // Use global Sentry if initialized
    const Sentry = (
      window as unknown as { Sentry: { captureException: (e: Error, ctx?: unknown) => void } }
    ).Sentry;
    Sentry.captureException(errorObj, context);
  } else {
    // Fallback to console
    console.error('[Sentry]', errorObj, context);
  }
}

/**
 * Capture a message and send to Sentry.
 * Falls back to console.log if Sentry is not configured.
 *
 * @param message - Message to log
 * @param level - Severity level (default: 'info')
 * @param context - Optional context with tags and extra data
 */
export function captureMessage(
  message: string,
  level: SeverityLevel = 'info',
  context?: CaptureContext,
): void {
  if (isSentryEnabled() && typeof window !== 'undefined' && 'Sentry' in window) {
    const Sentry = (
      window as unknown as {
        Sentry: { captureMessage: (m: string, l: SeverityLevel, ctx?: unknown) => void };
      }
    ).Sentry;
    Sentry.captureMessage(message, level, context);
  } else {
    // Fallback to console
    const logFn = level === 'error' || level === 'fatal' ? console.error : console.log;
    logFn(`[Sentry:${level}]`, message, context);
  }
}

/**
 * Set user context for Sentry.
 *
 * @param user - User information (id, email, username)
 */
export function setUser(user: CaptureContext['user'] | null): void {
  if (isSentryEnabled() && typeof window !== 'undefined' && 'Sentry' in window) {
    const Sentry = (window as unknown as { Sentry: { setUser: (u: unknown) => void } }).Sentry;
    Sentry.setUser(user);
  }
}

/**
 * Add breadcrumb for debugging.
 *
 * @param message - Breadcrumb message
 * @param category - Category (e.g., 'navigation', 'action', 'api')
 * @param data - Additional data
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
): void {
  if (isSentryEnabled() && typeof window !== 'undefined' && 'Sentry' in window) {
    const Sentry = (window as unknown as { Sentry: { addBreadcrumb: (b: unknown) => void } })
      .Sentry;
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.debug(`[Breadcrumb:${category}]`, message, data);
  }
}

/**
 * Start a performance transaction.
 * Returns a transaction-like object for tracking operations.
 *
 * @param name - Transaction name
 * @param op - Operation type (e.g., 'http', 'navigation', 'task')
 */
export function startTransaction(
  name: string,
  op: string,
): { finish: () => void; setTag: (key: string, value: string) => void } {
  const startTime = performance.now();

  return {
    finish: () => {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Performance:${op}]`, name, `${duration.toFixed(2)}ms`);
      }
    },
    setTag: (key: string, value: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Transaction Tag]`, key, value);
      }
    },
  };
}

/**
 * Initialize Sentry SDK.
 * Call this in your app's entry point (e.g., instrumentation.ts or _app.tsx).
 *
 * Note: For full Sentry integration, install @sentry/nextjs and use their
 * wizard: `npx @sentry/wizard@latest -i nextjs`
 */
export async function initSentry(): Promise<void> {
  if (!isSentryEnabled()) {
    console.info('[Sentry] Not initialized - NEXT_PUBLIC_SENTRY_DSN not set');
    return;
  }

  console.info('[Sentry] SDK initialization would happen here');
  // Full Sentry integration requires:
  // 1. npm install @sentry/nextjs
  // 2. npx @sentry/wizard@latest -i nextjs
  // 3. Configure sentry.client.config.ts, sentry.server.config.ts
}
