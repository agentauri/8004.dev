import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NotFound from './not-found';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('NotFound Page', () => {
  describe('rendering', () => {
    it('renders not found page', () => {
      render(<NotFound />);
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('displays 404 code', () => {
      render(<NotFound />);
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('displays page not found title', () => {
      render(<NotFound />);
      expect(screen.getByText('PAGE NOT FOUND')).toBeInTheDocument();
    });

    it('displays description text', () => {
      render(<NotFound />);
      expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
    });

    it('displays pixel explorer', () => {
      render(<NotFound />);
      expect(screen.getByTestId('pixel-explorer')).toBeInTheDocument();
    });

    it('displays hint text', () => {
      render(<NotFound />);
      expect(screen.getByText(/lost\? try searching for an agent/i)).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('renders go home link', () => {
      render(<NotFound />);
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders explore agents link', () => {
      render(<NotFound />);
      const exploreLink = screen.getByRole('link', { name: /explore agents/i });
      expect(exploreLink).toBeInTheDocument();
      expect(exploreLink).toHaveAttribute('href', '/explore');
    });
  });

  describe('styling', () => {
    it('has correct background class', () => {
      render(<NotFound />);
      expect(screen.getByTestId('not-found-page')).toHaveClass('bg-pixel-grid');
    });

    it('is centered on screen', () => {
      render(<NotFound />);
      const page = screen.getByTestId('not-found-page');
      expect(page).toHaveClass('min-h-screen');
      expect(page).toHaveClass('flex');
      expect(page).toHaveClass('items-center');
      expect(page).toHaveClass('justify-center');
    });
  });
});
