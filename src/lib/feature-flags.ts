/**
 * Feature Flags System
 *
 * Type-safe feature flags with environment-based defaults and localStorage overrides.
 * Enables gradual rollout of new features.
 *
 * @example
 * ```tsx
 * // Check feature flag
 * if (isFeatureEnabled('agentComparison')) {
 *   // Show comparison UI
 * }
 *
 * // Use hook in components
 * const isEnabled = useFeatureFlag('bookmarks');
 * ```
 */

/**
 * All available feature flags.
 * Add new flags here with their default values.
 */
export const FEATURE_FLAGS = {
  /** Agent comparison side-by-side view */
  agentComparison: false,
  /** Bookmark agents and searches */
  bookmarks: false,
  /** Export data to CSV/JSON */
  exportData: false,
  /** Watchlist for monitoring agents */
  watchlist: false,
  /** Keyboard shortcuts modal */
  keyboardShortcuts: true,
  /** Theme toggle (light/dark) */
  themeToggle: false,
  /** Real-time SSE events */
  realtimeEvents: false,
  /** Advanced search filters */
  advancedFilters: true,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

const STORAGE_KEY = 'agent-explorer-feature-flags';

/**
 * Get overrides from localStorage (development only).
 */
function getStoredOverrides(): Partial<Record<FeatureFlagKey, boolean>> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Partial<Record<FeatureFlagKey, boolean>>;
    }
  } catch {
    // Ignore parse errors
  }

  return {};
}

/**
 * Check if a feature flag is enabled.
 *
 * Priority:
 * 1. localStorage override (development only)
 * 2. Environment variable (NEXT_PUBLIC_FF_<FLAG_NAME>)
 * 3. Default value from FEATURE_FLAGS
 *
 * @param flag - The feature flag key to check
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  // Check localStorage overrides first (allows dev testing)
  const overrides = getStoredOverrides();
  if (flag in overrides) {
    return overrides[flag] as boolean;
  }

  // Check environment variable
  const envKey = `NEXT_PUBLIC_FF_${flag.toUpperCase()}`;
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }

  // Return default value
  return FEATURE_FLAGS[flag];
}

/**
 * Get all feature flags with their current values.
 */
export function getAllFeatureFlags(): Record<FeatureFlagKey, boolean> {
  const flags = {} as Record<FeatureFlagKey, boolean>;

  for (const key of Object.keys(FEATURE_FLAGS) as FeatureFlagKey[]) {
    flags[key] = isFeatureEnabled(key);
  }

  return flags;
}

/**
 * Set a feature flag override in localStorage (development only).
 *
 * @param flag - The feature flag key to override
 * @param enabled - Whether to enable or disable the feature
 */
export function setFeatureFlagOverride(flag: FeatureFlagKey, enabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  const overrides = getStoredOverrides();
  overrides[flag] = enabled;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear a specific feature flag override.
 *
 * @param flag - The feature flag key to clear
 */
export function clearFeatureFlagOverride(flag: FeatureFlagKey): void {
  if (typeof window === 'undefined') {
    return;
  }

  const overrides = getStoredOverrides();
  delete overrides[flag];

  try {
    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear all feature flag overrides.
 */
export function clearAllFeatureFlagOverrides(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
