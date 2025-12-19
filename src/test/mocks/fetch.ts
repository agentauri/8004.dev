import { type Mock, vi } from 'vitest';

/**
 * Mock fetch function for testing API calls.
 * Reset before each test using setupFetchMock().
 */
export const mockFetch: Mock = vi.fn();

/**
 * Sets up the mock fetch for a test.
 * Call this in beforeEach() to ensure clean state.
 *
 * @example
 * ```tsx
 * beforeEach(() => {
 *   setupFetchMock();
 * });
 * ```
 */
export function setupFetchMock(): void {
  mockFetch.mockReset();
  global.fetch = mockFetch;
}

/**
 * Restores the original fetch after tests.
 * Call this in afterEach() if needed.
 */
export function restoreFetch(): void {
  vi.restoreAllMocks();
}

/**
 * Mocks a successful API response.
 *
 * @example
 * ```tsx
 * mockSuccessResponse({ id: '1', name: 'Agent' });
 * ```
 */
export function mockSuccessResponse<T>(data: T, meta?: Record<string, unknown>): Mock {
  return mockFetch.mockResolvedValue({
    json: () => Promise.resolve({ success: true, data, ...(meta && { meta }) }),
  });
}

/**
 * Mocks an error API response (success: false).
 *
 * @example
 * ```tsx
 * mockErrorResponse('Not found', 'NOT_FOUND');
 * ```
 */
export function mockErrorResponse(error: string, code?: string): Mock {
  return mockFetch.mockResolvedValue({
    json: () => Promise.resolve({ success: false, error, ...(code && { code }) }),
  });
}

/**
 * Mocks a fetch rejection (network error).
 *
 * @example
 * ```tsx
 * mockFetchRejection('Network error');
 * ```
 */
export function mockFetchRejection(message: string): Mock {
  return mockFetch.mockRejectedValue(new Error(message));
}

/**
 * Mocks multiple sequential responses.
 *
 * @example
 * ```tsx
 * mockSequentialResponses([
 *   { success: true, data: { id: '1' } },
 *   { success: false, error: 'Error' },
 * ]);
 * ```
 */
export function mockSequentialResponses(
  responses: Array<{ success: boolean; data?: unknown; error?: string }>,
): Mock {
  let callCount = 0;
  return mockFetch.mockImplementation(() => {
    const response = responses[callCount] ?? responses[responses.length - 1];
    callCount++;
    return Promise.resolve({
      json: () => Promise.resolve(response),
    });
  });
}
