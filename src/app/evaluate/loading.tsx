import { PixelExplorer } from '@/components/atoms';

/**
 * Loading state for evaluation pages.
 * Displays animated pixel explorer with loading indicator.
 */
export default function EvaluateLoading(): React.JSX.Element {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center"
      data-testid="evaluate-loading"
    >
      <div className="text-center space-y-6">
        {/* Loading Animation */}
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="bounce" />
        </div>

        {/* Loading Text */}
        <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] animate-pulse uppercase tracking-wider">
          Loading Evaluations...
        </p>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full max-w-5xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-4 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-4 bg-[var(--pixel-gray-700)] rounded w-32" />
                <div className="h-5 bg-[var(--pixel-gray-700)] rounded w-20" />
              </div>
              <div className="h-16 bg-[var(--pixel-gray-800)] rounded mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
                <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
                <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
                <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
