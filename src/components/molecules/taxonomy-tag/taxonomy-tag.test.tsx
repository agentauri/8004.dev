import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TaxonomyTag } from './taxonomy-tag';

describe('TaxonomyTag', () => {
  describe('rendering', () => {
    it('renders with data-testid', () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" />);
      expect(screen.getByTestId('taxonomy-tag')).toBeInTheDocument();
    });

    it('renders with data attributes', () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" />);
      const tag = screen.getByTestId('taxonomy-tag');
      expect(tag).toHaveAttribute('data-type', 'skill');
      expect(tag).toHaveAttribute('data-slug', 'natural_language_processing');
    });

    it('applies custom className', () => {
      render(<TaxonomyTag slug="technology" type="domain" className="custom-class" />);
      expect(screen.getByTestId('taxonomy-tag')).toHaveClass('custom-class');
    });
  });

  describe('slug resolution', () => {
    it('resolves valid skill slug to display name', () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" />);
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    });

    it('resolves valid domain slug to display name', () => {
      render(<TaxonomyTag slug="technology" type="domain" />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('resolves child slug to display name', () => {
      render(
        <TaxonomyTag
          slug="natural_language_processing/natural_language_understanding"
          type="skill"
        />,
      );
      expect(screen.getByText('Natural Language Understanding')).toBeInTheDocument();
    });

    it('falls back to formatted slug for unknown slugs', () => {
      render(<TaxonomyTag slug="unknown_category" type="skill" />);
      expect(screen.getByText('Unknown Category')).toBeInTheDocument();
    });

    it('falls back to last part for unknown nested slugs', () => {
      render(<TaxonomyTag slug="parent/unknown_child" type="skill" />);
      expect(screen.getByText('Unknown Child')).toBeInTheDocument();
    });
  });

  describe('tooltip', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not show tooltip by default', () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" />);
      expect(screen.queryByTestId('taxonomy-tag-tooltip')).not.toBeInTheDocument();
    });

    it('does not show tooltip on hover when showTooltip is false', async () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" showTooltip={false} />);
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);

      expect(screen.queryByTestId('taxonomy-tag-tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on hover when showTooltip is true', async () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" showTooltip />);
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);

      expect(screen.getByTestId('taxonomy-tag-tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', async () => {
      render(<TaxonomyTag slug="natural_language_processing" type="skill" showTooltip />);
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);
      expect(screen.getByTestId('taxonomy-tag-tooltip')).toBeInTheDocument();

      fireEvent.mouseLeave(tag);
      await vi.advanceTimersByTimeAsync(100);
      expect(screen.queryByTestId('taxonomy-tag-tooltip')).not.toBeInTheDocument();
    });

    it('shows full path in tooltip for child categories', async () => {
      render(
        <TaxonomyTag
          slug="natural_language_processing/natural_language_understanding"
          type="skill"
          showTooltip
        />,
      );
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);

      const tooltip = screen.getByTestId('taxonomy-tag-tooltip');
      expect(tooltip).toHaveTextContent(
        'Natural Language Processing > Natural Language Understanding',
      );
    });

    it('shows slug as fallback in tooltip for unknown categories', async () => {
      render(<TaxonomyTag slug="unknown/child" type="skill" showTooltip />);
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);

      const tooltip = screen.getByTestId('taxonomy-tag-tooltip');
      expect(tooltip).toHaveTextContent('unknown/child');
    });

    it('has role="tooltip" for accessibility', async () => {
      render(<TaxonomyTag slug="technology" type="domain" showTooltip />);
      const tag = screen.getByTestId('taxonomy-tag');

      fireEvent.mouseEnter(tag);
      await vi.advanceTimersByTimeAsync(100);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('badge props passthrough', () => {
    it('passes variant prop to TaxonomyBadge', () => {
      render(<TaxonomyTag slug="technology" type="domain" variant="outline" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveAttribute('data-variant', 'outline');
    });

    it('passes showIcon prop to TaxonomyBadge', () => {
      render(<TaxonomyTag slug="technology" type="domain" showIcon />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge.querySelector('svg')).toBeInTheDocument();
    });

    it('passes size prop to TaxonomyBadge', () => {
      render(<TaxonomyTag slug="technology" type="domain" size="md" />);
      const badge = screen.getByTestId('taxonomy-badge');
      // Medium size uses px-2 py-1, small uses px-1.5 py-0.5
      expect(badge).toHaveClass('px-2');
    });
  });

  describe('types', () => {
    it('handles skill type', () => {
      render(<TaxonomyTag slug="computer_vision" type="skill" />);
      expect(screen.getByTestId('taxonomy-tag')).toHaveAttribute('data-type', 'skill');
    });

    it('handles domain type', () => {
      render(<TaxonomyTag slug="healthcare" type="domain" />);
      expect(screen.getByTestId('taxonomy-tag')).toHaveAttribute('data-type', 'domain');
    });
  });
});
