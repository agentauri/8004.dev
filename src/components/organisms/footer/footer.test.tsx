import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders footer element', () => {
      render(<Footer />);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Footer className="custom-class" />);
      expect(screen.getByTestId('footer')).toHaveClass('custom-class');
    });
  });

  describe('links', () => {
    it('renders ERC-8004 link', () => {
      render(<Footer />);
      const link = screen.getByTestId('footer-eip-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://eips.ethereum.org/EIPS/eip-8004');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveTextContent('ERC-8004');
    });

    it('renders GitHub link', () => {
      render(<Footer />);
      const link = screen.getByTestId('footer-github-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://github.com/agntcy');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveTextContent('GitHub');
    });

    it('renders external link icon for ERC-8004', () => {
      render(<Footer />);
      const link = screen.getByTestId('footer-eip-link');
      expect(link.querySelector('.lucide-external-link')).toBeInTheDocument();
    });

    it('renders GitHub icon', () => {
      render(<Footer />);
      const link = screen.getByTestId('footer-github-link');
      expect(link.querySelector('.lucide-github')).toBeInTheDocument();
    });
  });

  describe('copyright', () => {
    it('renders copyright text with current year', () => {
      render(<Footer />);
      const copyright = screen.getByTestId('footer-copyright');
      expect(copyright).toBeInTheDocument();
      expect(copyright).toHaveTextContent('2025 8004.dev - Agent Explorer');
    });
  });
});
