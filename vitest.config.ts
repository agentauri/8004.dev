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
        '**/*.stories.tsx',
        '.next/',
        'storybook-static/',
        '.storybook/**',
        '**/index.ts', // Barrel exports don't need tests
      ],
      thresholds: {
        statements: 97,
        branches: 85,
        functions: 94,
        lines: 97,
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
