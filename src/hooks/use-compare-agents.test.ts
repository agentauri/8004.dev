import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import {
  COMPARE_PARAM_KEY,
  MAX_COMPARE_AGENTS,
  MIN_COMPARE_AGENTS,
  useCompareAgents,
} from './use-compare-agents';

// Mock next/navigation
const mockPush = vi.fn();
const mockPathname = '/explore';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('useCompareAgents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe('initial state', () => {
    it('returns empty array when no agents in URL', () => {
      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.selectedAgentIds).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
    });

    it('parses agent IDs from URL', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.selectedAgentIds).toEqual(['11155111:123', '84532:456']);
      expect(result.current.selectedCount).toBe(2);
    });

    it('trims whitespace from agent IDs', () => {
      mockSearchParams = new URLSearchParams('agents= 11155111:123 , 84532:456 ');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.selectedAgentIds).toEqual(['11155111:123', '84532:456']);
    });

    it('filters out empty agent IDs', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,,84532:456,');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.selectedAgentIds).toEqual(['11155111:123', '84532:456']);
    });

    it('limits to MAX_COMPARE_AGENTS', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3,4:4,5:5,6:6');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.selectedAgentIds).toHaveLength(MAX_COMPARE_AGENTS);
    });
  });

  describe('isSelected', () => {
    it('returns true for selected agent', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.isSelected('11155111:123')).toBe(true);
    });

    it('returns false for non-selected agent', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.isSelected('84532:456')).toBe(false);
    });
  });

  describe('isMaxSelected', () => {
    it('returns false when below max', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.isMaxSelected).toBe(false);
    });

    it('returns true when at max', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3,4:4');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.isMaxSelected).toBe(true);
    });
  });

  describe('canCompare', () => {
    it('returns false when below minimum', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.canCompare).toBe(false);
    });

    it('returns true when at minimum', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.canCompare).toBe(true);
    });

    it('returns true when above minimum', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.canCompare).toBe(true);
    });
  });

  describe('addAgent', () => {
    it('adds agent to selection', () => {
      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.addAgent('11155111:123');
      });

      expect(mockPush).toHaveBeenCalledWith('/explore?agents=11155111%3A123', { scroll: false });
    });

    it('does not add duplicate agent', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.addAgent('11155111:123');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not add beyond max agents', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3,4:4');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.addAgent('5:5');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('preserves other search params', () => {
      mockSearchParams = new URLSearchParams('query=test&active=true');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.addAgent('11155111:123');
      });

      const calledUrl = (mockPush as Mock).mock.calls[0][0];
      expect(calledUrl).toContain('query=test');
      expect(calledUrl).toContain('active=true');
      expect(calledUrl).toContain('agents=11155111%3A123');
    });
  });

  describe('removeAgent', () => {
    it('removes agent from selection', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.removeAgent('11155111:123');
      });

      expect(mockPush).toHaveBeenCalledWith('/explore?agents=84532%3A456', { scroll: false });
    });

    it('does nothing if agent not selected', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.removeAgent('84532:456');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('removes agents param when last agent removed', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.removeAgent('11155111:123');
      });

      expect(mockPush).toHaveBeenCalledWith('/explore', { scroll: false });
    });
  });

  describe('toggleAgent', () => {
    it('adds agent if not selected', () => {
      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.toggleAgent('11155111:123');
      });

      expect(mockPush).toHaveBeenCalledWith('/explore?agents=11155111%3A123', { scroll: false });
    });

    it('removes agent if selected', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.toggleAgent('11155111:123');
      });

      expect(mockPush).toHaveBeenCalledWith('/explore', { scroll: false });
    });
  });

  describe('clearAll', () => {
    it('clears all selected agents', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.clearAll();
      });

      expect(mockPush).toHaveBeenCalledWith('/explore', { scroll: false });
    });

    it('preserves other search params', () => {
      mockSearchParams = new URLSearchParams('agents=1:1,2:2&query=test');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.clearAll();
      });

      expect(mockPush).toHaveBeenCalledWith('/explore?query=test', { scroll: false });
    });
  });

  describe('getCompareUrl', () => {
    it('returns /compare when no agents selected', () => {
      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.getCompareUrl()).toBe('/compare');
    });

    it('returns URL with agent IDs', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      const { result } = renderHook(() => useCompareAgents());

      expect(result.current.getCompareUrl()).toBe('/compare?agents=11155111%3A123%2C84532%3A456');
    });
  });

  describe('goToCompare', () => {
    it('navigates to compare page when canCompare is true', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.goToCompare();
      });

      expect(mockPush).toHaveBeenCalledWith('/compare?agents=11155111%3A123%2C84532%3A456');
    });

    it('does not navigate when canCompare is false', () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      const { result } = renderHook(() => useCompareAgents());

      act(() => {
        result.current.goToCompare();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('constants', () => {
    it('has correct COMPARE_PARAM_KEY', () => {
      expect(COMPARE_PARAM_KEY).toBe('agents');
    });

    it('has correct MAX_COMPARE_AGENTS', () => {
      expect(MAX_COMPARE_AGENTS).toBe(4);
    });

    it('has correct MIN_COMPARE_AGENTS', () => {
      expect(MIN_COMPARE_AGENTS).toBe(2);
    });
  });
});
