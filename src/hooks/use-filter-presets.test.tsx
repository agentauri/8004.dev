import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type FilterState, useFilterPresets } from './use-filter-presets';

const STORAGE_KEY = 'agent-explorer-filter-presets';

describe('useFilterPresets', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns built-in presets', () => {
      const { result } = renderHook(() => useFilterPresets());
      expect(result.current.presets).toHaveLength(3);
      expect(result.current.presets[0].id).toBe('all');
      expect(result.current.presets[1].id).toBe('high-rep');
      expect(result.current.presets[2].id).toBe('active');
    });

    it('has no selected preset initially', () => {
      const { result } = renderHook(() => useFilterPresets());
      expect(result.current.selectedPresetId).toBeUndefined();
    });

    it('loads custom presets from localStorage', () => {
      const customPreset = {
        id: 'custom-1',
        name: 'My Preset',
        chains: [11155111],
        filterMode: 'AND' as const,
        minReputation: 50,
        maxReputation: 100,
        activeOnly: true,
        createdAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([customPreset]));

      const { result } = renderHook(() => useFilterPresets());
      expect(result.current.presets).toHaveLength(4);
      expect(result.current.presets[3].id).toBe('custom-1');
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');
      const { result } = renderHook(() => useFilterPresets());
      expect(result.current.presets).toHaveLength(3);
    });
  });

  describe('selectPreset', () => {
    it('selects a preset by ID', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('high-rep');
      });
      expect(result.current.selectedPresetId).toBe('high-rep');
    });

    it('can change selection', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });
      act(() => {
        result.current.selectPreset('active');
      });
      expect(result.current.selectedPresetId).toBe('active');
    });
  });

  describe('clearSelection', () => {
    it('clears the selected preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });
      act(() => {
        result.current.clearSelection();
      });
      expect(result.current.selectedPresetId).toBeUndefined();
    });
  });

  describe('getPreset', () => {
    it('returns preset by ID', () => {
      const { result } = renderHook(() => useFilterPresets());
      const preset = result.current.getPreset('high-rep');
      expect(preset?.name).toBe('High Rep');
    });

    it('returns undefined for non-existent preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      const preset = result.current.getPreset('non-existent');
      expect(preset).toBeUndefined();
    });
  });

  describe('savePreset', () => {
    it('saves a new preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      const filters: FilterState = {
        chains: [11155111],
        filterMode: 'OR',
        minReputation: 40,
        maxReputation: 80,
        activeOnly: true,
      };

      act(() => {
        result.current.savePreset('My Filter', filters);
      });

      expect(result.current.presets).toHaveLength(4);
      const newPreset = result.current.presets[3];
      expect(newPreset.name).toBe('My Filter');
      expect(newPreset.filterMode).toBe('OR');
      expect(newPreset.minReputation).toBe(40);
    });

    it('returns the created preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };

      let created: ReturnType<typeof result.current.savePreset> | undefined;
      act(() => {
        created = result.current.savePreset('New Preset', filters);
      });

      expect(created?.name).toBe('New Preset');
      expect(created?.id).toMatch(/^custom-/);
    });

    it('automatically selects the new preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };

      let created: ReturnType<typeof result.current.savePreset> | undefined;
      act(() => {
        created = result.current.savePreset('Auto Select', filters);
      });

      expect(result.current.selectedPresetId).toBe(created?.id);
    });

    it('persists new preset to localStorage', () => {
      const { result } = renderHook(() => useFilterPresets());
      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 50,
        maxReputation: 100,
        activeOnly: true,
      };

      act(() => {
        result.current.savePreset('Persisted', filters);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Persisted');
    });
  });

  describe('deletePreset', () => {
    it('deletes a custom preset', () => {
      const customPreset = {
        id: 'custom-1',
        name: 'Deletable',
        chains: [],
        filterMode: 'AND' as const,
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
        createdAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([customPreset]));

      const { result } = renderHook(() => useFilterPresets());
      expect(result.current.presets).toHaveLength(4);

      act(() => {
        result.current.deletePreset('custom-1');
      });

      expect(result.current.presets).toHaveLength(3);
    });

    it('cannot delete built-in presets', () => {
      const { result } = renderHook(() => useFilterPresets());

      act(() => {
        result.current.deletePreset('all');
      });

      expect(result.current.presets).toHaveLength(3);
      expect(result.current.presets.find((p) => p.id === 'all')).toBeDefined();
    });

    it('clears selection if deleted preset was selected', () => {
      const customPreset = {
        id: 'custom-1',
        name: 'Selected',
        chains: [],
        filterMode: 'AND' as const,
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
        createdAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([customPreset]));

      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('custom-1');
      });

      act(() => {
        result.current.deletePreset('custom-1');
      });

      expect(result.current.selectedPresetId).toBeUndefined();
    });

    it('keeps selection if different preset was deleted', () => {
      const presets = [
        {
          id: 'custom-1',
          name: 'First',
          chains: [],
          filterMode: 'AND' as const,
          minReputation: 0,
          maxReputation: 100,
          activeOnly: false,
          createdAt: Date.now(),
        },
        {
          id: 'custom-2',
          name: 'Second',
          chains: [],
          filterMode: 'AND' as const,
          minReputation: 0,
          maxReputation: 100,
          activeOnly: false,
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('custom-1');
      });

      act(() => {
        result.current.deletePreset('custom-2');
      });

      expect(result.current.selectedPresetId).toBe('custom-1');
    });
  });

  describe('hasUnsavedChanges', () => {
    it('returns false when no preset is selected', () => {
      const { result } = renderHook(() => useFilterPresets());
      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(false);
    });

    it('returns false when filters match selected preset', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(false);
    });

    it('returns true when filterMode differs', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [],
        filterMode: 'OR',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(true);
    });

    it('returns true when minReputation differs', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 20,
        maxReputation: 100,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(true);
    });

    it('returns true when maxReputation differs', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 80,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(true);
    });

    it('returns true when activeOnly differs', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: true,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(true);
    });

    it('returns true when chains differ', () => {
      const { result } = renderHook(() => useFilterPresets());
      act(() => {
        result.current.selectPreset('all');
      });

      const filters: FilterState = {
        chains: [11155111],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
      };
      expect(result.current.hasUnsavedChanges(filters)).toBe(true);
    });
  });
});
