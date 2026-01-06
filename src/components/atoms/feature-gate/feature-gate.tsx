'use client';

import type { ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import type { FeatureFlagKey } from '@/lib/feature-flags';

export interface FeatureGateProps {
  /** The feature flag to check */
  flag: FeatureFlagKey;
  /** Content to render when feature is enabled */
  children: ReactNode;
  /** Optional fallback content when feature is disabled */
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on feature flag status.
 *
 * @example
 * ```tsx
 * // Simple usage - render nothing when disabled
 * <FeatureGate flag="agentComparison">
 *   <CompareButton />
 * </FeatureGate>
 *
 * // With fallback
 * <FeatureGate flag="bookmarks" fallback={<span>Coming soon</span>}>
 *   <BookmarkButton />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps): ReactNode {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return fallback;
  }

  return children;
}
