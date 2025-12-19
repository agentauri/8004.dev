import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RelevanceScore } from './relevance-score';

describe('RelevanceScore', () => {
  describe('score display', () => {
    it('renders score with percentage', () => {
      render(<RelevanceScore score={85} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('85%');
    });

    it('has correct data-score attribute', () => {
      render(<RelevanceScore score={92} />);
      expect(screen.getByTestId('relevance-score')).toHaveAttribute('data-score', '92');
    });
  });

  describe('label prop', () => {
    it('hides label by default', () => {
      render(<RelevanceScore score={85} />);
      expect(screen.getByTestId('relevance-score')).not.toHaveTextContent('MATCH');
    });

    it('shows MATCH label when showLabel is true', () => {
      render(<RelevanceScore score={85} showLabel />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('85%');
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('MATCH');
    });

    it('hides label when showLabel is false', () => {
      render(<RelevanceScore score={85} showLabel={false} />);
      expect(screen.getByTestId('relevance-score')).not.toHaveTextContent('MATCH');
    });
  });

  describe('score clamping', () => {
    it('clamps negative scores to 0', () => {
      render(<RelevanceScore score={-10} />);
      const element = screen.getByTestId('relevance-score');
      expect(element).toHaveAttribute('data-score', '0');
      expect(element).toHaveTextContent('0%');
    });

    it('clamps scores above 100 to 100', () => {
      render(<RelevanceScore score={150} />);
      const element = screen.getByTestId('relevance-score');
      expect(element).toHaveAttribute('data-score', '100');
      expect(element).toHaveTextContent('100%');
    });

    it('handles boundary values correctly', () => {
      const { rerender } = render(<RelevanceScore score={0} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('0%');

      rerender(<RelevanceScore score={100} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('100%');
    });
  });

  describe('size variants', () => {
    it('applies md size classes by default', () => {
      render(<RelevanceScore score={75} />);
      expect(screen.getByTestId('relevance-score')).toHaveClass('text-[0.75rem]');
      expect(screen.getByTestId('relevance-score')).toHaveClass('px-3');
    });

    it('applies sm size classes', () => {
      render(<RelevanceScore score={75} size="sm" />);
      expect(screen.getByTestId('relevance-score')).toHaveClass('text-[0.625rem]');
      expect(screen.getByTestId('relevance-score')).toHaveClass('px-2');
    });

    it('applies md size classes explicitly', () => {
      render(<RelevanceScore score={75} size="md" />);
      expect(screen.getByTestId('relevance-score')).toHaveClass('text-[0.75rem]');
      expect(screen.getByTestId('relevance-score')).toHaveClass('px-3');
    });
  });

  describe('styling', () => {
    it('applies gold color classes', () => {
      render(<RelevanceScore score={85} />);
      const element = screen.getByTestId('relevance-score');
      expect(element).toHaveClass('text-[var(--pixel-gold-coin)]');
      expect(element).toHaveClass('border-[var(--pixel-gold-coin)]');
    });

    it('applies glow effect', () => {
      render(<RelevanceScore score={85} />);
      expect(screen.getByTestId('relevance-score')).toHaveClass(
        'shadow-[0_0_8px_var(--glow-gold)]',
      );
    });

    it('applies background with transparency', () => {
      render(<RelevanceScore score={85} />);
      expect(screen.getByTestId('relevance-score')).toHaveClass('bg-[rgba(252,192,60,0.1)]');
    });

    it('applies pixel font', () => {
      render(<RelevanceScore score={85} />);
      expect(screen.getByTestId('relevance-score')).toHaveClass(
        'font-[family-name:var(--font-pixel-body)]',
      );
    });
  });

  describe('className prop', () => {
    it('merges custom class names', () => {
      render(<RelevanceScore score={85} className="custom-class" />);
      const element = screen.getByTestId('relevance-score');
      expect(element).toHaveClass('custom-class');
      // Should still have base classes
      expect(element).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('allows overriding classes', () => {
      render(<RelevanceScore score={85} className="text-red-500" />);
      expect(screen.getByTestId('relevance-score')).toHaveClass('text-red-500');
    });
  });

  describe('accessibility', () => {
    it('renders sparkles icon with aria-hidden', () => {
      const { container } = render(<RelevanceScore score={85} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has semantic HTML structure', () => {
      render(<RelevanceScore score={85} />);
      const element = screen.getByTestId('relevance-score');
      expect(element.tagName).toBe('SPAN');
    });
  });

  describe('score variations', () => {
    it('renders low scores correctly', () => {
      render(<RelevanceScore score={42} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('42%');
    });

    it('renders medium scores correctly', () => {
      render(<RelevanceScore score={67} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('67%');
    });

    it('renders high scores correctly', () => {
      render(<RelevanceScore score={95} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('95%');
    });

    it('renders perfect score correctly', () => {
      render(<RelevanceScore score={100} />);
      expect(screen.getByTestId('relevance-score')).toHaveTextContent('100%');
    });
  });
});
