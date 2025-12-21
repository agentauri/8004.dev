/**
 * MSW server setup for Node.js
 *
 * This server intercepts HTTP requests at the Node.js level,
 * allowing us to mock backend API calls made by Next.js server-side code.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance for Node.js
 * Used by Playwright tests via global setup/teardown
 */
export const server = setupServer(...handlers);

/**
 * Start the MSW server
 * Call this in Playwright global setup
 */
export function startMswServer(): void {
  server.listen({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests (e.g., to localhost)
  });
  console.log('[MSW] Mock server started');
}

/**
 * Stop the MSW server
 * Call this in Playwright global teardown
 */
export function stopMswServer(): void {
  server.close();
  console.log('[MSW] Mock server stopped');
}

/**
 * Reset handlers to initial state
 * Call this between tests to ensure clean state
 */
export function resetMswHandlers(): void {
  server.resetHandlers();
}

/**
 * Add additional handlers for a specific test
 */
export function useMswHandlers(...newHandlers: Parameters<typeof server.use>): void {
  server.use(...newHandlers);
}
