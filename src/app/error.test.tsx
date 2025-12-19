import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorPage from './error';

describe('Error Page', () => {
  const defaultProps = {
    error: Object.assign(new globalThis.Error('Test error message'), {
      digest: undefined,
    }) as Error & { digest?: string },
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders error page', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByTestId('error-page')).toBeInTheDocument();
    });

    it('displays error title', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByText('SYSTEM ERROR')).toBeInTheDocument();
    });

    it('displays error description', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(
        screen.getByText(/something went wrong while processing your request/i),
      ).toBeInTheDocument();
    });

    it('displays error code', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByText('ERROR CODE: 500')).toBeInTheDocument();
    });

    it('displays pixel explorer', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByTestId('pixel-explorer')).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders try again button', () => {
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('renders go home link', () => {
      render(<ErrorPage {...defaultProps} />);
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('calls reset when try again is clicked', () => {
      render(<ErrorPage {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
      expect(defaultProps.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('error logging', () => {
    it('logs error to console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<ErrorPage {...defaultProps} />);
      expect(consoleSpy).toHaveBeenCalledWith('Application error:', defaultProps.error);
      consoleSpy.mockRestore();
    });
  });

  describe('development mode', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      vi.stubEnv('NODE_ENV', originalEnv);
    });

    it('shows error details in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      render(<ErrorPage {...defaultProps} />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('shows digest when available in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      const errorWithDigest = Object.assign(new globalThis.Error('Test error'), {
        digest: 'abc123',
      }) as Error & { digest?: string };
      render(<ErrorPage error={errorWithDigest} reset={defaultProps.reset} />);
      expect(screen.getByText('Digest: abc123')).toBeInTheDocument();
    });
  });
});
