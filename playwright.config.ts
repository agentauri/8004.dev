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
  // Reduced retries - MSW-mocked tests should be deterministic
  retries: process.env.CI ? 1 : 0,
  // Increased workers - I/O-bound tests benefit from more parallelism
  workers: process.env.CI ? 4 : undefined,
  // Use blob reporter in CI for efficient sharding
  reporter: process.env.CI ? 'blob' : 'html',
  // Reduced timeout for mocked tests (30s is sufficient)
  timeout: 30000,
  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    // Only capture traces on failure to reduce overhead
    trace: 'retain-on-failure',
    // Reduced timeouts for mocked tests
    actionTimeout: 5000,
    navigationTimeout: 10000,
    // Disable screenshots except on failure
    screenshot: 'only-on-failure',
    // Disable video recording in CI
    video: 'off',
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
    // Mobile browsers excluded from CI matrix (run locally if needed)
    ...(process.env.CI
      ? []
      : [
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
          },
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
        ]),
  ],
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // Reduced timeout - build is already done in CI
    timeout: 60000,
    // Enable MSW for E2E tests - intercepts all backend API calls
    env: {
      E2E_MSW_ENABLED: 'true',
      // Dummy values - MSW intercepts before these are used
      BACKEND_API_KEY: 'e2e-test-key',
      BACKEND_API_URL: 'https://api.8004.dev',
    },
  },
});
