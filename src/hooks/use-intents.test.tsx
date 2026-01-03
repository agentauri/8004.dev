/**
 * Tests for use-intents hooks
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IntentTemplate } from '@/types/agent';
import { useIntent, useIntentMatches, useIntents } from './use-intents';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTemplate: IntentTemplate = {
  id: 'code-review-workflow',
  name: 'Code Review Workflow',
  description: 'Automated code review with multiple agents',
  category: 'development',
  steps: [
    {
      order: 1,
      name: 'Analyze Code',
      description: 'Analyze code for issues',
      requiredRole: 'code-analyzer',
      inputs: ['source_code'],
      outputs: ['analysis_report'],
    },
    {
      order: 2,
      name: 'Review Security',
      description: 'Check for security vulnerabilities',
      requiredRole: 'security-reviewer',
      inputs: ['analysis_report'],
      outputs: ['security_report'],
    },
  ],
  requiredRoles: ['code-analyzer', 'security-reviewer'],
  matchedAgents: undefined,
};

const mockTemplateWithMatches: IntentTemplate = {
  ...mockTemplate,
  matchedAgents: ['11155111:1', '11155111:2'],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useIntents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetching templates', () => {
    it('fetches intent templates successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: [mockTemplate] }),
      });

      const { result } = renderHook(() => useIntents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([mockTemplate]);
      expect(mockFetch).toHaveBeenCalledWith('/api/intents?limit=20');
    });

    it('fetches templates with category filter', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: [mockTemplate] }),
      });

      const { result } = renderHook(() => useIntents({ category: 'development' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/intents?category=development&limit=20');
    });

    it('fetches templates with custom limit', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: [mockTemplate] }),
      });

      const { result } = renderHook(() => useIntents({ limit: 10 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/intents?limit=10');
    });

    it('handles fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Server error' }),
      });

      const { result } = renderHook(() => useIntents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Server error');
    });

    it('respects enabled option', async () => {
      const { result } = renderHook(() => useIntents({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});

describe('useIntent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetching single template', () => {
    it('fetches intent template by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockTemplate }),
      });

      const { result } = renderHook(() => useIntent('code-review-workflow'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTemplate);
      expect(mockFetch).toHaveBeenCalledWith('/api/intents/code-review-workflow');
    });

    it('returns null for not found template', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, code: 'INTENT_NOT_FOUND' }),
      });

      const { result } = renderHook(() => useIntent('non-existent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('handles fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Server error' }),
      });

      const { result } = renderHook(() => useIntent('code-review-workflow'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Server error');
    });

    it('does not fetch when ID is empty', async () => {
      const { result } = renderHook(() => useIntent(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('respects enabled option', async () => {
      const { result } = renderHook(() => useIntent('code-review-workflow', { enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});

describe('useIntentMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('matching agents', () => {
    it('matches agents successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, data: mockTemplateWithMatches }),
      });

      const { result } = renderHook(() => useIntentMatches('code-review-workflow'), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTemplateWithMatches);
      expect(mockFetch).toHaveBeenCalledWith('/api/intents/code-review-workflow/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('handles match error', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'No matching agents' }),
      });

      const { result } = renderHook(() => useIntentMatches('code-review-workflow'), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('No matching agents');
    });

    it('shows pending state while matching', async () => {
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce({
        json: () => promise,
      });

      const { result } = renderHook(() => useIntentMatches('code-review-workflow'), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      resolvePromise!({ success: true, data: mockTemplateWithMatches });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });
});
