import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    // CI stability: retry flaky tests once
    retry: process.env.CI ? 1 : 0,
    // Reasonable timeout for async operations
    testTimeout: 10000,
    hookTimeout: 10000,
    server: {
      deps: {
        external: ['agent0-sdk'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/**', // Playwright E2E tests
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/types.ts', // Type-only files don't need tests
        '**/*.stories.tsx',
        '.next/',
        'storybook-static/',
        '.storybook/**',
        '**/index.ts', // Barrel exports don't need tests
        'src/hooks/use-realtime-events.ts', // Re-export only, actual code is in provider
      ],
      thresholds: {
        statements: 94,
        branches: 77,
        functions: 90,
        lines: 94,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'agent0-sdk': resolve(__dirname, './src/test/mocks/agent0-sdk.ts'),
    },
  },
});
