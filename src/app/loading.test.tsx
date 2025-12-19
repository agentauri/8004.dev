import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Loading Page', () => {
  describe('rendering', () => {
    it('renders loading page', () => {
      render(<Loading />);
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    });

    it('displays loading text', () => {
      render(<Loading />);
      expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    it('renders pixel explorer animation', () => {
      render(<Loading />);
      expect(screen.getByTestId('pixel-explorer')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('has correct background class', () => {
      render(<Loading />);
      expect(screen.getByTestId('loading-page')).toHaveClass('bg-pixel-grid');
    });

    it('is centered on screen', () => {
      render(<Loading />);
      const page = screen.getByTestId('loading-page');
      expect(page).toHaveClass('min-h-screen');
      expect(page).toHaveClass('flex');
      expect(page).toHaveClass('items-center');
      expect(page).toHaveClass('justify-center');
    });
  });
});
