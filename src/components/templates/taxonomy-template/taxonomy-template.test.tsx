import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaxonomyTemplate } from './taxonomy-template';

describe('TaxonomyTemplate', () => {
  describe('rendering', () => {
    it('renders taxonomy template container', () => {
      render(<TaxonomyTemplate />);
      expect(screen.getByTestId('taxonomy-template')).toBeInTheDocument();
    });

    it('renders page title', () => {
      render(<TaxonomyTemplate />);
      expect(screen.getByTestId('taxonomy-title')).toBeInTheDocument();
      expect(screen.getByText('OASF Taxonomy')).toBeInTheDocument();
    });

    it('renders taxonomy browser', () => {
      render(<TaxonomyTemplate />);
      expect(screen.getByTestId('taxonomy-browser')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<TaxonomyTemplate />);
      // Multiple elements might contain OASF text, so use getAllByText
      const oasfElements = screen.getAllByText(/open agentic schema framework/i);
      expect(oasfElements.length).toBeGreaterThan(0);
    });

    it('renders OASF documentation link', () => {
      render(<TaxonomyTemplate />);
      const link = screen.getByText(/learn more about oasf/i);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        'https://docs.agntcy.org/oasf/open-agentic-schema-framework/',
      );
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('applies custom className', () => {
      render(<TaxonomyTemplate className="custom-class" />);
      expect(screen.getByTestId('taxonomy-template')).toHaveClass('custom-class');
    });
  });

  describe('category selection', () => {
    it('passes onCategorySelect to browser', () => {
      const onCategorySelect = vi.fn();
      render(<TaxonomyTemplate onCategorySelect={onCategorySelect} />);

      // Click a category
      fireEvent.click(screen.getByText('Natural Language Processing'));

      expect(onCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'natural_language_processing',
        }),
        'skill',
      );
    });
  });

  describe('accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<TaxonomyTemplate />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('OASF Taxonomy');
    });

    it('has main content area', () => {
      render(<TaxonomyTemplate />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});
