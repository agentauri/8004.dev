import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Evaluation } from '@/types/agent';
import {
  useAgentEvaluations,
  useCreateEvaluation,
  useEvaluation,
  useEvaluations,
} from './use-evaluations';

const mockEvaluation: Evaluation = {
  id: 'eval-123',
  agentId: '11155111:123',
  status: 'completed',
  benchmarks: [
    {
      name: 'safety-basic',
      category: 'safety',
      score: 85,
      maxScore: 100,
      details: 'Passed all safety checks',
    },
    {
      name: 'capability-code',
      category: 'capability',
      score: 90,
      maxScore: 100,
    },
  ],
  scores: {
    safety: 85,
    capability: 90,
    reliability: 88,
    performance: 92,
  },
  createdAt: new Date('2024-01-15T10:30:00Z'),
  completedAt: new Date('2024-01-15T10:35:00Z'),
};

const mockEvaluationPending: Evaluation = {
  id: 'eval-456',
  agentId: '11155111:456',
  status: 'pending',
  benchmarks: [],
  scores: {
    safety: 0,
    capability: 0,
    reliability: 0,
    performance: 0,
  },
  createdAt: new Date('2024-01-20T08:00:00Z'),
};

const mockEvaluationRunning: Evaluation = {
  id: 'eval-789',
  agentId: '84532:123',
  status: 'running',
  benchmarks: [
    {
      name: 'safety-basic',
      category: 'safety',
      score: 85,
      maxScore: 100,
    },
  ],
  scores: {
    safety: 85,
    capability: 0,
    reliability: 0,
    performance: 0,
  },
  createdAt: new Date('2024-01-20T09:00:00Z'),
};

const mockFetch = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useEvaluations', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches evaluations list', async () => {
      const mockData = [mockEvaluation, mockEvaluationPending];
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockData }),
      });

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations?limit=20');
    });

    it('fetches evaluations with status filter', async () => {
      const mockData = [mockEvaluationPending];
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockData }),
      });

      const { result } = renderHook(() => useEvaluations({ status: 'pending' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations?status=pending&limit=20');
    });

    it('fetches evaluations with custom limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations({ limit: 50 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations?limit=50');
    });

    it('fetches with both status and limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations({ status: 'completed', limit: 10 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations?status=completed&limit=10');
    });

    it('returns empty array when no evaluations', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Server error' }),
      });

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Server error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });

    it('uses default error message when error is empty', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch evaluations');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled is true', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations({ enabled: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useEvaluations(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe('useEvaluation', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches evaluation by ID', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEvaluation);
      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations/eval-123');
    });

    it('returns evaluation data correctly', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.status).toBe('completed');
      expect(result.current.data?.scores.safety).toBe(85);
      expect(result.current.data?.agentId).toBe('11155111:123');
    });

    it('returns benchmark results', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.benchmarks).toHaveLength(2);
      expect(result.current.data?.benchmarks[0].category).toBe('safety');
    });
  });

  describe('not found handling', () => {
    it('handles null response for non-existent evaluation', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, code: 'EVALUATION_NOT_FOUND' }),
      });

      const { result } = renderHook(() => useEvaluation('non-existent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Database error' }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Database error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Connection refused');
    });

    it('uses default error message when error is empty', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch evaluation');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123', { enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not fetch when ID is empty', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled with valid ID', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123', { enabled: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluation }),
      });

      const { result } = renderHook(() => useEvaluation('eval-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe('useAgentEvaluations', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches evaluations for agent', async () => {
      const mockData = [mockEvaluation, mockEvaluationRunning];
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockData }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123/evaluations');
    });

    it('returns evaluations for different chain', async () => {
      const baseSepolia = [{ ...mockEvaluation, agentId: '84532:456' }];
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: baseSepolia }),
      });

      const { result } = renderHook(() => useAgentEvaluations('84532:456'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/agents/84532:456/evaluations');
      expect(result.current.data?.[0].agentId).toBe('84532:456');
    });

    it('returns empty array when agent has no evaluations', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Agent not found' }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Agent not found');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Timeout'));

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Timeout');
    });

    it('uses default error message when error is empty', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch agent evaluations');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123', { enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not fetch when agentId is empty', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useAgentEvaluations(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled with valid agentId', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123', { enabled: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      const { result } = renderHook(() => useAgentEvaluations('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe('useCreateEvaluation', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful mutations', () => {
    it('creates evaluation with agentId only', async () => {
      const newEvaluation = { ...mockEvaluationPending, id: 'eval-new' };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: newEvaluation }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:456' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(newEvaluation);
      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: '11155111:456' }),
      });
    });

    it('creates evaluation with specific benchmarks', async () => {
      const newEvaluation = { ...mockEvaluationPending, id: 'eval-new' };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: newEvaluation }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      const input = {
        agentId: '11155111:456',
        benchmarks: ['safety-basic', 'capability-code'],
      };

      await act(async () => {
        result.current.mutate(input);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    });

    it('returns created evaluation data', async () => {
      const newEvaluation: Evaluation = {
        id: 'eval-created',
        agentId: '84532:789',
        status: 'pending',
        benchmarks: [],
        scores: { safety: 0, capability: 0, reliability: 0, performance: 0 },
        createdAt: new Date('2024-01-25T12:00:00Z'),
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: newEvaluation }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '84532:789' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('eval-created');
      expect(result.current.data?.status).toBe('pending');
      expect(result.current.data?.agentId).toBe('84532:789');
    });
  });

  describe('error handling', () => {
    it('handles API errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Agent not found' }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:999' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Agent not found');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Service unavailable'));

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:123' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Service unavailable');
    });

    it('uses default error message when error is empty', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:123' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to create evaluation');
    });
  });

  describe('mutation states', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isIdle).toBe(true);
    });

    it('transitions to pending state during mutation', async () => {
      let resolvePromise: ((value: unknown) => void) | null = null;
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ agentId: '11155111:123' });
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      // Clean up by resolving the promise
      act(() => {
        resolvePromise?.({
          json: () => Promise.resolve({ success: true, data: mockEvaluationPending }),
        });
      });
    });

    it('transitions to success state after completion', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockEvaluationPending }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:456' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });

    it('transitions to error state on failure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Validation failed' }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:123' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe('cache invalidation', () => {
    it('calls onSuccess callback after successful mutation', async () => {
      const newEvaluation = {
        ...mockEvaluationPending,
        id: 'eval-cache-test',
        agentId: '11155111:123',
      };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: newEvaluation }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ agentId: '11155111:123' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The mutation was successful, which means onSuccess was called
      // This implicitly tests that invalidation code runs without errors
      expect(result.current.data?.agentId).toBe('11155111:123');
    });
  });

  describe('mutateAsync', () => {
    it('returns promise with evaluation data', async () => {
      const newEvaluation = { ...mockEvaluationPending, id: 'eval-async' };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: newEvaluation }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      let returnedData: Evaluation | undefined;
      await act(async () => {
        returnedData = await result.current.mutateAsync({ agentId: '11155111:456' });
      });

      expect(returnedData).toEqual(newEvaluation);
    });

    it('throws on error', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Async error' }),
      });

      const { result } = renderHook(() => useCreateEvaluation(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync({ agentId: '11155111:123' });
        }),
      ).rejects.toThrow('Async error');
    });
  });
});
