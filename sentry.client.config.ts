/**
 * Sentry Client Configuration
 *
 * This file configures Sentry error tracking for the client (browser) side.
 * To enable full Sentry integration:
 *
 * 1. Install the Sentry SDK:
 *    npm install @sentry/nextjs
 *
 * 2. Uncomment the code below
 *
 * 3. Set environment variables:
 *    - NEXT_PUBLIC_SENTRY_DSN: Your Sentry DSN
 *    - NEXT_PUBLIC_SENTRY_ENVIRONMENT: Environment (production, staging, etc.)
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import { getSentryConfig, isSentryEnabled } from '@/lib/sentry';

// Uncomment when @sentry/nextjs is installed:
// import * as Sentry from '@sentry/nextjs';

if (isSentryEnabled()) {
  const _config = getSentryConfig();

  // Uncomment when @sentry/nextjs is installed:
  // Sentry.init({
  //   dsn: config.dsn,
  //   environment: config.environment,
  //   release: config.release,
  //
  //   // Performance monitoring
  //   tracesSampleRate: config.tracesSampleRate,
  //
  //   // Session Replay
  //   replaysSessionSampleRate: config.replaysSessionSampleRate,
  //   replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
  //
  //   // Integrations
  //   integrations: [
  //     Sentry.replayIntegration({
  //       maskAllText: true,
  //       blockAllMedia: true,
  //     }),
  //   ],
  //
  //   // Filter out noisy errors
  //   beforeSend(event, hint) {
  //     const error = hint.originalException;
  //
  //     // Ignore ResizeObserver errors (browser quirk)
  //     if (error instanceof Error && error.message.includes('ResizeObserver')) {
  //       return null;
  //     }
  //
  //     // Ignore network errors for analytics
  //     if (error instanceof Error && error.message.includes('Failed to fetch')) {
  //       return null;
  //     }
  //
  //     return event;
  //   },
  // });

  console.info('[Sentry] Client SDK configured (install @sentry/nextjs to enable)');
}
