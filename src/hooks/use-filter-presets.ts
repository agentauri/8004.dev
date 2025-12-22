import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FilterMode } from '@/components/molecules/filter-mode-toggle';
import type { FilterPreset } from '@/types/filter-preset';

const STORAGE_KEY = 'agent-explorer-filter-presets';

/**
 * Built-in presets that are always available.
 */
const BUILT_IN_PRESETS: FilterPreset[] = [
  {
    id: 'all',
    name: 'All',
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    activeOnly: false,
    createdAt: 0,
  },
  {
    id: 'high-rep',
    name: 'High Rep',
    chains: [],
    filterMode: 'AND',
    minReputation: 70,
    maxReputation: 100,
    activeOnly: true,
    createdAt: 0,
  },
  {
    id: 'active',
    name: 'Active',
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    activeOnly: true,
    createdAt: 0,
  },
];

export interface FilterState {
  chains: number[];
  filterMode: FilterMode;
  minReputation: number;
  maxReputation: number;
  activeOnly: boolean;
}

export interface UseFilterPresetsResult {
  /** All available presets (built-in + custom) */
  presets: FilterPreset[];
  /** Currently selected preset ID */
  selectedPresetId: string | undefined;
  /** Save current filters as a new preset */
  savePreset: (name: string, filters: FilterState) => FilterPreset;
  /** Delete a custom preset */
  deletePreset: (presetId: string) => void;
  /** Select a preset */
  selectPreset: (presetId: string) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Get preset by ID */
  getPreset: (presetId: string) => FilterPreset | undefined;
  /** Check if current filters differ from selected preset */
  hasUnsavedChanges: (currentFilters: FilterState) => boolean;
}

/**
 * Hook for managing filter presets with localStorage persistence.
 *
 * @example
 * ```tsx
 * const {
 *   presets,
 *   selectedPresetId,
 *   savePreset,
 *   deletePreset,
 *   selectPreset,
 * } = useFilterPresets();
 * ```
 */
export function useFilterPresets(): UseFilterPresetsResult {
  const [customPresets, setCustomPresets] = useState<FilterPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FilterPreset[];
        setCustomPresets(parsed);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load filter presets from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save custom presets to localStorage when they change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to save filter presets to localStorage:', error);
      }
    }
  }, [customPresets, isInitialized]);

  // Combine built-in and custom presets
  const presets = useMemo(() => [...BUILT_IN_PRESETS, ...customPresets], [customPresets]);

  const savePreset = useCallback((name: string, filters: FilterState): FilterPreset => {
    const newPreset: FilterPreset = {
      id: `custom-${Date.now()}`,
      name,
      chains: filters.chains,
      filterMode: filters.filterMode,
      minReputation: filters.minReputation,
      maxReputation: filters.maxReputation,
      activeOnly: filters.activeOnly,
      createdAt: Date.now(),
    };
    setCustomPresets((prev) => [...prev, newPreset]);
    setSelectedPresetId(newPreset.id);
    return newPreset;
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    // Cannot delete built-in presets
    if (BUILT_IN_PRESETS.some((p) => p.id === presetId)) {
      return;
    }
    setCustomPresets((prev) => prev.filter((p) => p.id !== presetId));
    // Use functional update to avoid dependency on selectedPresetId
    setSelectedPresetId((current) => (current === presetId ? undefined : current));
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPresetId(undefined);
  }, []);

  const getPreset = useCallback(
    (presetId: string): FilterPreset | undefined => {
      return presets.find((p) => p.id === presetId);
    },
    [presets],
  );

  const hasUnsavedChanges = useCallback(
    (currentFilters: FilterState): boolean => {
      if (!selectedPresetId) return false;
      const preset = getPreset(selectedPresetId);
      if (!preset) return false;

      return (
        preset.filterMode !== currentFilters.filterMode ||
        preset.minReputation !== currentFilters.minReputation ||
        preset.maxReputation !== currentFilters.maxReputation ||
        preset.activeOnly !== currentFilters.activeOnly ||
        JSON.stringify(preset.chains.sort()) !== JSON.stringify(currentFilters.chains.sort())
      );
    },
    [selectedPresetId, getPreset],
  );

  return {
    presets,
    selectedPresetId,
    savePreset,
    deletePreset,
    selectPreset,
    clearSelection,
    getPreset,
    hasUnsavedChanges,
  };
}
