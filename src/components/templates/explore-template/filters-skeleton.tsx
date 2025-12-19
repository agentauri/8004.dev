import type React from 'react';

/**
 * Skeleton loading state for SearchFilters component.
 * Displays placeholder UI while filters are being lazy loaded.
 */
export function FiltersSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-pulse" data-testid="filters-skeleton">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 bg-[var(--pixel-gray-700)] rounded" />
        <div className="h-4 w-12 bg-[var(--pixel-gray-700)] rounded" />
      </div>

      {/* Status filter skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-12 bg-[var(--pixel-gray-700)] rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-20 bg-[var(--pixel-gray-700)] rounded" />
        </div>
      </div>

      {/* Protocol filter skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-[var(--pixel-gray-700)] rounded" />
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-12 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-10 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-14 bg-[var(--pixel-gray-700)] rounded" />
        </div>
      </div>

      {/* Chain filter skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-14 bg-[var(--pixel-gray-700)] rounded" />
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-24 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-28 bg-[var(--pixel-gray-700)] rounded" />
        </div>
      </div>

      {/* Reputation slider skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-24 bg-[var(--pixel-gray-700)] rounded" />
        <div className="h-2 w-full bg-[var(--pixel-gray-700)] rounded" />
      </div>
    </div>
  );
}
