import type React from 'react';

/**
 * Skeleton loading state for SearchResults component.
 * Displays placeholder UI while results are being lazy loaded.
 */
export function ResultsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-pulse" data-testid="results-skeleton">
      {/* Sort controls skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 bg-[var(--pixel-gray-700)] rounded" />
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-[var(--pixel-gray-700)] rounded" />
          <div className="h-8 w-20 bg-[var(--pixel-gray-700)] rounded" />
        </div>
      </div>

      {/* Agent cards skeleton grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="p-4 border border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)] rounded-lg space-y-4"
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--pixel-gray-700)] rounded" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-[var(--pixel-gray-700)] rounded" />
                <div className="h-3 w-1/2 bg-[var(--pixel-gray-700)] rounded" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-[var(--pixel-gray-700)] rounded" />
              <div className="h-3 w-5/6 bg-[var(--pixel-gray-700)] rounded" />
            </div>

            {/* Badges skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-[var(--pixel-gray-700)] rounded" />
              <div className="h-6 w-12 bg-[var(--pixel-gray-700)] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <div className="h-8 w-20 bg-[var(--pixel-gray-700)] rounded" />
        <div className="h-8 w-24 bg-[var(--pixel-gray-700)] rounded" />
        <div className="h-8 w-20 bg-[var(--pixel-gray-700)] rounded" />
      </div>
    </div>
  );
}
