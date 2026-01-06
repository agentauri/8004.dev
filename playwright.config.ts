import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E testing configuration
 * @see https://playwright.dev/docs/test-configuration
 *
 * MSW Integration:
 * - E2E_MSW_ENABLED=true enables MSW in Next.js instrumentation
 * - BACKEND_API_KEY/URL are set to dummy values (MSW intercepts all backend calls)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // Enable MSW for E2E tests - intercepts all backend API calls
    env: {
      E2E_MSW_ENABLED: 'true',
      // Dummy values - MSW intercepts before these are used
      BACKEND_API_KEY: 'e2e-test-key',
      BACKEND_API_URL: 'https://api.8004.dev',
    },
  },
});
