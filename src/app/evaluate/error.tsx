'use client';

import { useEffect } from 'react';
import { PixelExplorer } from '@/components/atoms';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for evaluation pages.
 * Displays retro-styled error message with retry action.
 */
export default function EvaluateError({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error('Evaluation page error:', error);
  }, [error]);

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center p-8"
      data-testid="evaluate-error"
    >
      <div className="text-center space-y-8 max-w-lg">
        {/* Error Explorer */}
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="float" />
        </div>

        {/* Error Title */}
        <h1 className="font-[family-name:var(--font-pixel-display)] text-xl md:text-2xl text-[var(--pixel-red-fire)] shadow-[0_0_20px_var(--glow-red)]">
          EVALUATION ERROR
        </h1>

        {/* Error Message */}
        <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-200)]">
          Failed to load evaluation data. This might be a temporary issue with our evaluation
          service.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-[var(--pixel-black)] border-2 border-[var(--pixel-red-fire)] p-4 text-left">
            <p className="font-mono text-xs text-[var(--pixel-red-fire)] break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-[var(--pixel-gray-400)] mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            type="button"
            onClick={reset}
            className="font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider px-6 py-2 border-2 border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)] hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)] hover:shadow-[0_0_12px_var(--glow-blue)] transition-all"
          >
            TRY AGAIN
          </button>
          <a
            href="/explore"
            className="font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider px-6 py-2 border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] transition-all text-center"
          >
            BACK TO EXPLORE
          </a>
        </div>
      </div>
    </div>
  );
}
