'use client';

import { useEffect } from 'react';
import { PixelExplorer } from '@/components/atoms';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js requires error boundary to be named "Error"
export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-pixel-grid"
      data-testid="error-page"
    >
      <div className="text-center space-y-8 max-w-lg">
        {/* Error Explorer */}
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="float" />
        </div>

        {/* Error Title */}
        <h1 className="text-pixel-display text-xl md:text-2xl text-[var(--pixel-red-danger)] text-glow-red">
          SYSTEM ERROR
        </h1>

        {/* Error Message */}
        <p className="text-pixel-body text-sm text-[var(--pixel-gray-200)]">
          Something went wrong while processing your request. The error has been logged for
          investigation.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-[var(--pixel-black)] border-2 border-[var(--pixel-red-danger)] p-4 text-left">
            <p className="text-pixel-body text-xs text-[var(--pixel-red-danger)] font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)] mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button type="button" onClick={reset} className="btn-pixel-primary">
            TRY AGAIN
          </button>
          <a href="/" className="btn-pixel-secondary inline-block text-center">
            GO HOME
          </a>
        </div>

        {/* Error Code */}
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">ERROR CODE: 500</p>
      </div>
    </main>
  );
}
