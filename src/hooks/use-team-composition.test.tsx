import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TeamComposition } from '@/types/agent';
import { useComposeTeam, useTeamComposition } from './use-team-composition';

const mockTeamComposition: TeamComposition = {
  id: 'comp-123',
  task: 'Build a smart contract auditor',
  team: [
    {
      agentId: '11155111:123',
      role: 'Code Analyzer',
      contribution: 'Analyzes smart contract code for vulnerabilities',
      compatibilityScore: 92,
    },
    {
      agentId: '11155111:456',
      role: 'Security Expert',
      contribution: 'Provides security best practices and recommendations',
      compatibilityScore: 88,
    },
    {
      agentId: '84532:789',
      role: 'Report Generator',
      contribution: 'Generates comprehensive audit reports',
      compatibilityScore: 85,
    },
  ],
  fitnessScore: 87,
  reasoning:
    'This team combines code analysis expertise with security knowledge and reporting capabilities to provide comprehensive smart contract audits.',
  createdAt: new Date('2024-01-15T10:30:00Z'),
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

describe('useComposeTeam', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful mutations', () => {
    it('composes team with task only', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Build a smart contract auditor' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.task).toBe('Build a smart contract auditor');
      expect(result.current.data?.team).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledWith('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Build a smart contract auditor' }),
      });
    });

    it('composes team with maxTeamSize', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      const input = {
        task: 'Build a code review system',
        maxTeamSize: 4,
      };

      await act(async () => {
        result.current.mutate(input);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    });

    it('composes team with requiredCapabilities', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      const input = {
        task: 'Create an AI assistant network',
        requiredCapabilities: ['mcp', 'a2a'],
      };

      await act(async () => {
        result.current.mutate(input);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    });

    it('composes team with all options', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      const input = {
        task: 'Build a multi-agent system',
        maxTeamSize: 6,
        requiredCapabilities: ['mcp', 'a2a', 'x402'],
      };

      await act(async () => {
        result.current.mutate(input);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    });

    it('returns team composition data correctly', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('comp-123');
      expect(result.current.data?.fitnessScore).toBe(87);
      expect(result.current.data?.reasoning).toContain('code analysis');
      expect(result.current.data?.createdAt).toBeInstanceOf(Date);
    });

    it('returns team members with correct structure', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const team = result.current.data?.team;
      expect(team?.[0].agentId).toBe('11155111:123');
      expect(team?.[0].role).toBe('Code Analyzer');
      expect(team?.[0].contribution).toContain('Analyzes');
      expect(team?.[0].compatibilityScore).toBe(92);
    });
  });

  describe('error handling', () => {
    it('handles API errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'No suitable agents found' }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Very specific task' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('No suitable agents found');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
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

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to compose team');
    });
  });

  describe('mutation states', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(() => useComposeTeam(), {
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

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      // Clean up by resolving the promise
      act(() => {
        resolvePromise?.({
          json: () =>
            Promise.resolve({
              success: true,
              data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
            }),
        });
      });
    });

    it('transitions to success state after completion', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });

    it('transitions to error state on failure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Task too complex' }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ task: 'Test task' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe('mutateAsync', () => {
    it('returns promise with team composition data', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      let returnedData: TeamComposition | undefined;
      await act(async () => {
        returnedData = await result.current.mutateAsync({ task: 'Async test task' });
      });

      expect(returnedData?.id).toBe('comp-123');
      expect(returnedData?.fitnessScore).toBe(87);
    });

    it('throws on error', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Async error' }),
      });

      const { result } = renderHook(() => useComposeTeam(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync({ task: 'Test task' });
        }),
      ).rejects.toThrow('Async error');
    });
  });
});

describe('useTeamComposition', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches team composition by ID', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('comp-123');
      expect(mockFetch).toHaveBeenCalledWith('/api/compose/comp-123');
    });

    it('returns team composition data correctly', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.task).toBe('Build a smart contract auditor');
      expect(result.current.data?.fitnessScore).toBe(87);
      expect(result.current.data?.team).toHaveLength(3);
      expect(result.current.data?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('not found handling', () => {
    it('returns null for non-existent composition', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, code: 'COMPOSITION_NOT_FOUND' }),
      });

      const { result } = renderHook(() => useTeamComposition('non-existent'), {
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

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Database error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
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

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch team composition');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition('comp-123', { enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not fetch when ID is empty', () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled with valid ID', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition('comp-123', { enabled: true }), {
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

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockTeamComposition, createdAt: '2024-01-15T10:30:00Z' },
          }),
      });

      const { result } = renderHook(() => useTeamComposition('comp-123'), {
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
