import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BenchmarkResult } from '@/types';
import { BenchmarkRow } from './benchmark-row';

const mockBenchmark: BenchmarkResult = {
  name: 'Input Validation',
  category: 'safety',
  score: 85,
  maxScore: 100,
  details: 'Passed all input validation tests with flying colors.',
};

describe('BenchmarkRow', () => {
  describe('rendering', () => {
    it('renders the benchmark row', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByTestId('benchmark-row')).toBeInTheDocument();
    });

    it('renders benchmark name', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByText('Input Validation')).toBeInTheDocument();
    });

    it('renders score display', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByTestId('benchmark-score')).toHaveTextContent('85/100');
    });

    it('applies custom className', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} className="custom-class" />);
      expect(screen.getByTestId('benchmark-row')).toHaveClass('custom-class');
    });

    it('sets data-category attribute', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByTestId('benchmark-row')).toHaveAttribute('data-category', 'safety');
    });
  });

  describe('category icons', () => {
    it('shows shield icon for safety category', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, category: 'safety' }} />);
      expect(screen.getByText('🛡')).toBeInTheDocument();
    });

    it('shows lightning icon for capability category', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, category: 'capability' }} />);
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('shows lock icon for reliability category', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, category: 'reliability' }} />);
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('shows rocket icon for performance category', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, category: 'performance' }} />);
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });
  });

  describe('progress bar', () => {
    it('sets correct width based on percentage', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByTestId('benchmark-fill')).toHaveStyle({ width: '85%' });
    });

    it('handles 0/0 score gracefully', () => {
      const zeroBenchmark = { ...mockBenchmark, score: 0, maxScore: 0 };
      render(<BenchmarkRow benchmark={zeroBenchmark} />);
      expect(screen.getByTestId('benchmark-fill')).toHaveStyle({ width: '0%' });
    });

    it('handles different score ratios', () => {
      const halfBenchmark = { ...mockBenchmark, score: 50, maxScore: 100 };
      render(<BenchmarkRow benchmark={halfBenchmark} />);
      expect(screen.getByTestId('benchmark-fill')).toHaveStyle({ width: '50%' });
    });

    it('handles non-100 max scores', () => {
      const customMaxBenchmark = { ...mockBenchmark, score: 8, maxScore: 10 };
      render(<BenchmarkRow benchmark={customMaxBenchmark} />);
      expect(screen.getByTestId('benchmark-fill')).toHaveStyle({ width: '80%' });
    });
  });

  describe('score levels', () => {
    it('applies green color for high scores (>= 80%)', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, score: 85, maxScore: 100 }} />);
      expect(screen.getByTestId('benchmark-score')).toHaveClass('text-[var(--pixel-green-pipe)]');
      expect(screen.getByTestId('benchmark-fill')).toHaveClass('bg-[var(--pixel-green-pipe)]');
    });

    it('applies yellow color for medium scores (50-79%)', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, score: 65, maxScore: 100 }} />);
      expect(screen.getByTestId('benchmark-score')).toHaveClass('text-[var(--pixel-gold-coin)]');
      expect(screen.getByTestId('benchmark-fill')).toHaveClass('bg-[var(--pixel-gold-coin)]');
    });

    it('applies red color for low scores (< 50%)', () => {
      render(<BenchmarkRow benchmark={{ ...mockBenchmark, score: 30, maxScore: 100 }} />);
      expect(screen.getByTestId('benchmark-score')).toHaveClass('text-[var(--pixel-red-fire)]');
      expect(screen.getByTestId('benchmark-fill')).toHaveClass('bg-[var(--pixel-red-fire)]');
    });
  });

  describe('details expansion', () => {
    it('does not show details section when showDetails is false', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails={false} />);
      expect(screen.queryByTestId('benchmark-details')).not.toBeInTheDocument();
    });

    it('does not show details when benchmark has no details', () => {
      const noDetailsBenchmark = { ...mockBenchmark, details: undefined };
      render(<BenchmarkRow benchmark={noDetailsBenchmark} showDetails />);
      expect(screen.queryByTestId('benchmark-details')).not.toBeInTheDocument();
    });

    it('shows expand indicator when details available', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('does not show expand indicator without details', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails={false} />);
      expect(screen.queryByText('▼')).not.toBeInTheDocument();
    });

    it('expands details on click', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.queryByTestId('benchmark-details')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('benchmark-row'));
      expect(screen.getByTestId('benchmark-details')).toBeInTheDocument();
      expect(screen.getByText(mockBenchmark.details!)).toBeInTheDocument();
    });

    it('collapses details on second click', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);

      fireEvent.click(screen.getByTestId('benchmark-row'));
      expect(screen.getByTestId('benchmark-details')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('benchmark-row'));
      expect(screen.queryByTestId('benchmark-details')).not.toBeInTheDocument();
    });

    it('expands details on Enter key', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      fireEvent.keyDown(screen.getByTestId('benchmark-row'), { key: 'Enter' });
      expect(screen.getByTestId('benchmark-details')).toBeInTheDocument();
    });

    it('expands details on Space key', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      fireEvent.keyDown(screen.getByTestId('benchmark-row'), { key: ' ' });
      expect(screen.getByTestId('benchmark-details')).toBeInTheDocument();
    });

    it('ignores other keys', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      fireEvent.keyDown(screen.getByTestId('benchmark-row'), { key: 'Tab' });
      expect(screen.queryByTestId('benchmark-details')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has button role when details available', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.getByTestId('benchmark-row')).toHaveAttribute('role', 'button');
    });

    it('does not have button role when no details', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails={false} />);
      expect(screen.getByTestId('benchmark-row')).not.toHaveAttribute('role');
    });

    it('has tabIndex when details available', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.getByTestId('benchmark-row')).toHaveAttribute('tabIndex', '0');
    });

    it('has aria-expanded when details available', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.getByTestId('benchmark-row')).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(screen.getByTestId('benchmark-row'));
      expect(screen.getByTestId('benchmark-row')).toHaveAttribute('aria-expanded', 'true');
    });

    it('respects prefers-reduced-motion', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByTestId('benchmark-fill')).toHaveClass('motion-reduce:transition-none');
    });

    it('has title attribute on name for truncation', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} />);
      expect(screen.getByText('Input Validation')).toHaveAttribute('title', 'Input Validation');
    });
  });

  describe('styling', () => {
    it('applies hover styles when details available', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      expect(screen.getByTestId('benchmark-row')).toHaveClass('cursor-pointer');
      expect(screen.getByTestId('benchmark-row')).toHaveClass(
        'hover:border-[var(--pixel-gray-600)]',
      );
    });

    it('does not apply hover styles when no details', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails={false} />);
      expect(screen.getByTestId('benchmark-row')).not.toHaveClass('cursor-pointer');
    });

    it('rotates expand indicator when expanded', () => {
      render(<BenchmarkRow benchmark={mockBenchmark} showDetails />);
      const indicator = screen.getByText('▼');
      expect(indicator).not.toHaveClass('rotate-180');

      fireEvent.click(screen.getByTestId('benchmark-row'));
      expect(indicator).toHaveClass('rotate-180');
    });
  });
});
