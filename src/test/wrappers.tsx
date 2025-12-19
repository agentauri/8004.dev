import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

/**
 * Creates a new QueryClient configured for testing.
 * - Disables retries to make tests deterministic
 * - Sets gcTime to 0 to prevent caching between tests
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

/**
 * Creates a wrapper component for testing hooks with React Query.
 * Use with renderHook from @testing-library/react.
 *
 * @example
 * ```tsx
 * const { result } = renderHook(() => useMyHook(), {
 *   wrapper: createWrapper(),
 * });
 * ```
 */
export function createWrapper() {
  const queryClient = createTestQueryClient();
  return function TestWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

/**
 * Renders a component with QueryClientProvider for testing.
 * Use with render from @testing-library/react.
 *
 * @example
 * ```tsx
 * render(<MyComponent />, { wrapper: createQueryWrapper() });
 * ```
 */
export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
