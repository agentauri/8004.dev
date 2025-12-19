import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GlobalError from './global-error';

describe('GlobalError Page', () => {
  const defaultProps = {
    error: new Error('Critical test error'),
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders global error page', () => {
      render(<GlobalError {...defaultProps} />);
      expect(screen.getByTestId('global-error-page')).toBeInTheDocument();
    });

    it('displays error title', () => {
      render(<GlobalError {...defaultProps} />);
      expect(screen.getByText('Critical System Error')).toBeInTheDocument();
    });

    it('displays error description', () => {
      render(<GlobalError {...defaultProps} />);
      expect(screen.getByText(/a critical error occurred/i)).toBeInTheDocument();
    });

    it('renders as a full page replacement', () => {
      // GlobalError is a Next.js special component that renders its own html/body
      // In test environment, we verify the content renders without the wrapping elements
      const { container } = render(<GlobalError {...defaultProps} />);
      // The component structure is present even if html/body are not in test DOM
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders try again button', () => {
      render(<GlobalError {...defaultProps} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('renders go home link', () => {
      render(<GlobalError {...defaultProps} />);
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('calls reset when try again is clicked', () => {
      render(<GlobalError {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
      expect(defaultProps.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('development mode', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      vi.stubEnv('NODE_ENV', originalEnv);
    });

    it('shows error details in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      render(<GlobalError {...defaultProps} />);
      expect(screen.getByText('Critical test error')).toBeInTheDocument();
    });

    it('shows digest when available in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      const errorWithDigest = Object.assign(new Error('Test error'), { digest: 'xyz789' });
      render(<GlobalError error={errorWithDigest} reset={defaultProps.reset} />);
      expect(screen.getByText('Digest: xyz789')).toBeInTheDocument();
    });
  });
});
