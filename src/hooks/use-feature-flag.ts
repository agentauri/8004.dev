import { useCallback, useEffect, useState } from 'react';
import { type FeatureFlagKey, isFeatureEnabled, setFeatureFlagOverride } from '@/lib/feature-flags';

/**
 * Hook to check if a feature flag is enabled.
 * Automatically updates when localStorage changes.
 *
 * @param flag - The feature flag key to check
 * @returns Whether the feature is enabled
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isCompareEnabled = useFeatureFlag('agentComparison');
 *
 *   if (!isCompareEnabled) return null;
 *
 *   return <CompareButton />;
 * }
 * ```
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    // Re-check on mount (for SSR hydration)
    setIsEnabled(isFeatureEnabled(flag));

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'agent-explorer-feature-flags') {
        setIsEnabled(isFeatureEnabled(flag));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  return isEnabled;
}

/**
 * Hook to manage a feature flag with toggle capability.
 * Useful for development/admin panels.
 *
 * @param flag - The feature flag key to manage
 * @returns Object with isEnabled state and toggle function
 *
 * @example
 * ```tsx
 * function DevPanel() {
 *   const { isEnabled, toggle, setEnabled } = useFeatureFlagToggle('bookmarks');
 *
 *   return (
 *     <label>
 *       <input type="checkbox" checked={isEnabled} onChange={toggle} />
 *       Enable Bookmarks
 *     </label>
 *   );
 * }
 * ```
 */
export function useFeatureFlagToggle(flag: FeatureFlagKey): {
  isEnabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
} {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    setIsEnabled(isFeatureEnabled(flag));

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'agent-explorer-feature-flags') {
        setIsEnabled(isFeatureEnabled(flag));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      setFeatureFlagOverride(flag, enabled);
      setIsEnabled(enabled);
    },
    [flag],
  );

  const toggle = useCallback(() => {
    setEnabled(!isEnabled);
  }, [isEnabled, setEnabled]);

  return { isEnabled, toggle, setEnabled };
}
