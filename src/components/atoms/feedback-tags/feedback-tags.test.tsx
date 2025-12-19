import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeedbackTags } from './feedback-tags';

describe('FeedbackTags', () => {
  describe('basic rendering', () => {
    it('renders with tags', () => {
      render(<FeedbackTags tags={['reliable', 'fast']} />);
      expect(screen.getByTestId('feedback-tags')).toBeInTheDocument();
    });

    it('stores count in data attribute', () => {
      render(<FeedbackTags tags={['reliable', 'fast', 'accurate']} />);
      expect(screen.getByTestId('feedback-tags')).toHaveAttribute('data-count', '3');
    });

    it('renders all tags', () => {
      render(<FeedbackTags tags={['reliable', 'fast', 'accurate']} />);
      expect(screen.getByText('reliable')).toBeInTheDocument();
      expect(screen.getByText('fast')).toBeInTheDocument();
      expect(screen.getByText('accurate')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows no tags message when empty', () => {
      render(<FeedbackTags tags={[]} />);
      expect(screen.getByText('No tags')).toBeInTheDocument();
    });

    it('has count of 0 in data attribute when empty', () => {
      render(<FeedbackTags tags={[]} />);
      expect(screen.getByTestId('feedback-tags')).toHaveAttribute('data-count', '0');
    });
  });

  describe('maxTags limit', () => {
    it('shows all tags when count is below maxTags', () => {
      render(<FeedbackTags tags={['a', 'b']} maxTags={5} />);
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('b')).toBeInTheDocument();
      expect(screen.queryByTestId('hidden-count')).not.toBeInTheDocument();
    });

    it('limits visible tags and shows hidden count', () => {
      render(<FeedbackTags tags={['a', 'b', 'c', 'd', 'e']} maxTags={3} />);
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('b')).toBeInTheDocument();
      expect(screen.getByText('c')).toBeInTheDocument();
      expect(screen.queryByText('d')).not.toBeInTheDocument();
      expect(screen.queryByText('e')).not.toBeInTheDocument();
      expect(screen.getByTestId('hidden-count')).toHaveTextContent('+2');
    });

    it('shows exact remaining count in hidden count badge', () => {
      render(<FeedbackTags tags={['a', 'b', 'c', 'd', 'e', 'f', 'g']} maxTags={2} />);
      expect(screen.getByTestId('hidden-count')).toHaveTextContent('+5');
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<FeedbackTags tags={['test']} size="sm" />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass('text-[0.5rem]');
    });

    it('applies md size classes by default', () => {
      render(<FeedbackTags tags={['test']} />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass('text-[0.625rem]');
    });

    it('applies lg size classes', () => {
      render(<FeedbackTags tags={['test']} size="lg" />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass('text-[0.75rem]');
    });
  });

  describe('styling', () => {
    it('applies pixel font family to tags', () => {
      render(<FeedbackTags tags={['test']} />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass(
        'font-[family-name:var(--font-pixel-body)]',
      );
    });

    it('applies uppercase styling to tags', () => {
      render(<FeedbackTags tags={['test']} />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass('uppercase');
    });

    it('applies background color to tags', () => {
      render(<FeedbackTags tags={['test']} />);
      expect(document.querySelector('[data-tag="test"]')).toHaveClass('bg-[var(--pixel-gray-700)]');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<FeedbackTags tags={['test']} className="custom-class" />);
      expect(screen.getByTestId('feedback-tags')).toHaveClass('custom-class');
    });
  });

  describe('data-tag attribute', () => {
    it('adds data-tag attribute to each tag', () => {
      render(<FeedbackTags tags={['reliable', 'fast']} />);
      expect(document.querySelector('[data-tag="reliable"]')).toBeInTheDocument();
      expect(document.querySelector('[data-tag="fast"]')).toBeInTheDocument();
    });
  });
});
