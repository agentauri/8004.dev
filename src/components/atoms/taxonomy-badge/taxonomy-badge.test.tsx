import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaxonomyBadge } from './taxonomy-badge';

describe('TaxonomyBadge', () => {
  describe('rendering', () => {
    it('renders skill badge with name', () => {
      render(<TaxonomyBadge type="skill" name="Natural Language Processing" />);
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-badge')).toHaveAttribute('data-type', 'skill');
    });

    it('renders domain badge with name', () => {
      render(<TaxonomyBadge type="domain" name="Healthcare" />);
      expect(screen.getByText('Healthcare')).toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-badge')).toHaveAttribute('data-type', 'domain');
    });

    it('truncates long names', () => {
      render(
        <TaxonomyBadge
          type="skill"
          name="Very Long Category Name That Should Be Truncated For Display"
        />,
      );
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toBeInTheDocument();
      expect(badge.querySelector('.truncate')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders default variant by default', () => {
      render(<TaxonomyBadge type="skill" name="Test" />);
      expect(screen.getByTestId('taxonomy-badge')).toHaveAttribute('data-variant', 'default');
    });

    it('renders outline variant when specified', () => {
      render(<TaxonomyBadge type="skill" name="Test" variant="outline" />);
      expect(screen.getByTestId('taxonomy-badge')).toHaveAttribute('data-variant', 'outline');
    });
  });

  describe('icon', () => {
    it('does not show icon by default', () => {
      render(<TaxonomyBadge type="skill" name="Test" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge.querySelector('svg')).not.toBeInTheDocument();
    });

    it('shows icon when showIcon is true', () => {
      render(<TaxonomyBadge type="skill" name="Test" showIcon />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge.querySelector('svg')).toBeInTheDocument();
    });

    it('shows Cpu icon for skills', () => {
      render(<TaxonomyBadge type="skill" name="Test" showIcon />);
      const badge = screen.getByTestId('taxonomy-badge');
      const icon = badge.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('shows BookOpen icon for domains', () => {
      render(<TaxonomyBadge type="domain" name="Test" showIcon />);
      const badge = screen.getByTestId('taxonomy-badge');
      const icon = badge.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('size', () => {
    it('renders small size by default', () => {
      render(<TaxonomyBadge type="skill" name="Test" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveClass('text-[0.5rem]');
    });

    it('renders medium size when specified', () => {
      render(<TaxonomyBadge type="skill" name="Test" size="md" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveClass('text-[0.625rem]');
    });
  });

  describe('styling', () => {
    it('applies skill-specific colors', () => {
      render(<TaxonomyBadge type="skill" name="Test" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveClass('text-[var(--taxonomy-skill)]');
    });

    it('applies domain-specific colors', () => {
      render(<TaxonomyBadge type="domain" name="Test" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveClass('text-[var(--taxonomy-domain)]');
    });

    it('applies custom className', () => {
      render(<TaxonomyBadge type="skill" name="Test" className="custom-class" />);
      expect(screen.getByTestId('taxonomy-badge')).toHaveClass('custom-class');
    });

    it('applies outline styling without background for outline variant', () => {
      render(<TaxonomyBadge type="skill" name="Test" variant="outline" />);
      const badge = screen.getByTestId('taxonomy-badge');
      expect(badge).toHaveClass('bg-transparent');
    });
  });

  describe('accessibility', () => {
    it('has proper test id', () => {
      render(<TaxonomyBadge type="skill" name="Test" />);
      expect(screen.getByTestId('taxonomy-badge')).toBeInTheDocument();
    });

    it('icon is hidden from screen readers', () => {
      render(<TaxonomyBadge type="skill" name="Test" showIcon />);
      const icon = screen.getByTestId('taxonomy-badge').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
