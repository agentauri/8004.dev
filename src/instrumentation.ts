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
    console.log('[Instrumentation] Node.js runtime detected');
    console.log('[Instrumentation] E2E_MSW_ENABLED:', process.env.E2E_MSW_ENABLED);

    // Check if we should enable MSW for E2E testing
    if (process.env.E2E_MSW_ENABLED === 'true') {
      try {
        // Use require() instead of import() to avoid Turbopack static analysis
        // Path is relative to project root, not compiled output
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { server } = require('../e2e/msw/server');

        server.listen({
          onUnhandledRequest: 'bypass',
        });

        console.log('[MSW] Mock server started for E2E tests');
      } catch (error) {
        console.error('[MSW] Failed to start mock server:', error);
      }
    }
  }
}
