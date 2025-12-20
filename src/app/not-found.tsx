import Link from 'next/link';
import { PixelExplorer } from '@/components/atoms/pixel-explorer';

export default function NotFound(): React.JSX.Element {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-pixel-grid"
      data-testid="not-found-page"
    >
      <div className="text-center space-y-8 max-w-lg">
        {/* 404 Display */}
        <div className="space-y-2">
          <h1 className="text-pixel-display text-4xl md:text-6xl text-[var(--pixel-blue-text)] text-glow-blue">
            404
          </h1>
          <p className="text-pixel-display text-lg md:text-xl text-[var(--pixel-gray-200)]">
            PAGE NOT FOUND
          </p>
        </div>

        {/* Description */}
        <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)]">
          The page you are looking for does not exist or has been moved to another location.
        </p>

        {/* Lost Explorer Animation */}
        <div className="py-4 flex justify-center">
          <PixelExplorer size="xl" animation="walk" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-pixel-primary inline-block text-center">
            GO HOME
          </Link>
          <Link href="/explore" className="btn-pixel-secondary inline-block text-center">
            EXPLORE AGENTS
          </Link>
        </div>

        {/* Hint */}
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)] pt-8">
          Lost? Try searching for an agent in the explorer.
        </p>
      </div>
    </main>
  );
}
