import { vi } from 'vitest';

/**
 * Mock BackendError class for testing API routes.
 * Mimics the real BackendError from @/lib/api/backend.
 */
export class MockBackendError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

/**
 * Creates a mock module for @/lib/api/backend.
 * Use with vi.mock() in API route tests.
 *
 * @example
 * ```tsx
 * vi.mock('@/lib/api/backend', () => mockBackendModule());
 *
 * const mockBackendFetch = vi.mocked(backendFetch);
 * ```
 */
export function mockBackendModule() {
  return {
    backendFetch: vi.fn(),
    BackendError: MockBackendError,
  };
}

/**
 * Creates a MockBackendError instance for testing.
 *
 * @example
 * ```tsx
 * mockBackendFetch.mockRejectedValue(
 *   createMockBackendError('Not found', 'NOT_FOUND', 404)
 * );
 * ```
 */
export function createMockBackendError(
  message: string,
  code: string,
  status: number,
): MockBackendError {
  return new MockBackendError(message, code, status);
}
