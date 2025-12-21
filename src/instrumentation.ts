/**
 * Next.js Instrumentation
 *
 * This file is loaded before the server starts.
 * Used to set up MSW for E2E testing when E2E_MSW_ENABLED is set.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only register for Node.js runtime - skip Edge runtime entirely
  // Edge runtime doesn't support MSW's Node.js interceptors
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Check if we should enable MSW for E2E testing
    if (process.env.E2E_MSW_ENABLED === 'true') {
      // Use require() instead of import() to avoid Turbopack static analysis
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { server } = require('../e2e/msw/server');

      server.listen({
        onUnhandledRequest: 'bypass',
      });

      console.log('[MSW] Mock server started for E2E tests');
    }
  }
}
