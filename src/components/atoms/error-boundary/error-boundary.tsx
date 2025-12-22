'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI when an error occurs */
  fallback?: ReactNode;
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional component name for better error messages */
  componentName?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree.
 *
 * Provides a fallback UI when an error occurs, preventing the entire app from crashing.
 * Logs errors to console in development mode.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   componentName="SearchResults"
 *   onError={(error) => trackError(error)}
 * >
 *   <SearchResults agents={agents} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, componentName } = this.props;

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `ErrorBoundary caught an error${componentName ? ` in ${componentName}` : ''}:`,
        error,
        errorInfo,
      );
    }

    onError?.(error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div
          className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-destructive)] text-center"
          data-testid="error-boundary-fallback"
        >
          <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm mb-2">
            {componentName ? `Error in ${componentName}` : 'Something went wrong'}
          </p>
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
            data-testid="error-boundary-retry"
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}
