import type { FilterMode } from '@/components/molecules/filter-mode-toggle';

/**
 * Represents a saved filter preset configuration.
 */
export interface FilterPreset {
  /** Unique identifier for the preset */
  id: string;
  /** Display name of the preset */
  name: string;
  /** Selected chain IDs */
  chains: number[];
  /** Filter mode (AND/OR) */
  filterMode: FilterMode;
  /** Minimum reputation value */
  minReputation: number;
  /** Maximum reputation value */
  maxReputation: number;
  /** Whether to show only active agents */
  activeOnly: boolean;
  /** Timestamp when the preset was created */
  createdAt: number;
}

/**
 * Built-in preset definitions that cannot be deleted.
 */
export type BuiltInPresetId = 'all' | 'high-rep' | 'active';

/**
 * Checks if a preset ID is a built-in preset.
 */
export function isBuiltInPreset(id: string): id is BuiltInPresetId {
  return id === 'all' || id === 'high-rep' || id === 'active';
}
