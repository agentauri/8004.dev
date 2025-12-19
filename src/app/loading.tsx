import { PixelExplorer } from '@/components/atoms/pixel-explorer';

export default function Loading(): React.JSX.Element {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-pixel-grid"
      data-testid="loading-page"
    >
      <div className="text-center space-y-6">
        {/* Loading Animation */}
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="bounce" />
        </div>

        {/* Loading Text */}
        <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)] animate-pulse">
          LOADING...
        </p>
      </div>
    </main>
  );
}
