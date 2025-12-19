import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaxonomyTree } from './taxonomy-tree';

describe('TaxonomyTree', () => {
  describe('rendering', () => {
    it('renders taxonomy tree container', () => {
      render(<TaxonomyTree type="skill" />);
      expect(screen.getByTestId('taxonomy-tree')).toBeInTheDocument();
    });

    it('renders skill tree with categories', () => {
      render(<TaxonomyTree type="skill" />);
      expect(screen.getByTestId('taxonomy-tree-content')).toBeInTheDocument();
      // Should have top-level skill categories (text is inside truncated spans)
      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
      expect(badges[0]).toHaveAttribute('data-type', 'skill');
    });

    it('renders domain tree with categories', () => {
      render(<TaxonomyTree type="domain" />);
      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
      expect(badges[0]).toHaveAttribute('data-type', 'domain');
    });

    it('displays total category count', () => {
      render(<TaxonomyTree type="skill" />);
      // Should show something like "X categories"
      expect(screen.getByText(/\d+ categories/)).toBeInTheDocument();
    });

    it('renders expand all button', () => {
      render(<TaxonomyTree type="skill" />);
      expect(screen.getByTestId('expand-all')).toBeInTheDocument();
    });

    it('renders collapse all button', () => {
      render(<TaxonomyTree type="skill" />);
      expect(screen.getByTestId('collapse-all')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TaxonomyTree type="skill" className="custom-class" />);
      expect(screen.getByTestId('taxonomy-tree')).toHaveClass('custom-class');
    });
  });

  describe('expand/collapse', () => {
    it('expands a node when clicked', () => {
      render(<TaxonomyTree type="skill" />);

      // Get the first expand button
      const expandButtons = screen.getAllByLabelText('Expand');
      expect(expandButtons.length).toBeGreaterThan(0);

      // Click to expand
      fireEvent.click(expandButtons[0]);

      // After expanding, there should be more badges visible
      const badgesAfter = screen.getAllByTestId('taxonomy-badge');
      expect(badgesAfter.length).toBeGreaterThan(15); // More than initial count
    });

    it('expands all when expand all is clicked', () => {
      render(<TaxonomyTree type="skill" />);

      const badgesBefore = screen.getAllByTestId('taxonomy-badge');

      fireEvent.click(screen.getByTestId('expand-all'));

      // After expanding all, there should be many more badges
      const badgesAfter = screen.getAllByTestId('taxonomy-badge');
      expect(badgesAfter.length).toBeGreaterThan(badgesBefore.length);
    });

    it('collapses all when collapse all is clicked', () => {
      render(<TaxonomyTree type="skill" />);

      // First expand all
      fireEvent.click(screen.getByTestId('expand-all'));
      const badgesExpanded = screen.getAllByTestId('taxonomy-badge');

      // Then collapse all
      fireEvent.click(screen.getByTestId('collapse-all'));

      // Should have fewer badges now (only top-level)
      const badgesCollapsed = screen.getAllByTestId('taxonomy-badge');
      expect(badgesCollapsed.length).toBeLessThan(badgesExpanded.length);
    });
  });

  describe('search filtering', () => {
    it('filters categories based on search query', () => {
      render(<TaxonomyTree type="skill" searchQuery="vision" />);

      // Should show filtered results
      expect(screen.getByText(/of \d+ categories/)).toBeInTheDocument();

      // Should have badges visible
      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows no results message when nothing matches', () => {
      render(<TaxonomyTree type="skill" searchQuery="xyznonexistent" />);

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByText(/No categories match/)).toBeInTheDocument();
    });

    it('auto-expands parent nodes when child matches', () => {
      render(<TaxonomyTree type="skill" searchQuery="understanding" />);

      // Should auto-expand and show results
      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('category selection', () => {
    it('calls onCategoryClick when a category is clicked', () => {
      const onCategoryClick = vi.fn();
      render(<TaxonomyTree type="skill" onCategoryClick={onCategoryClick} />);

      // Find buttons that contain taxonomy badges (category name buttons)
      const allButtons = screen.getAllByRole('button');
      const categorySelectButtons = allButtons.filter(
        (btn) => btn.querySelector('[data-testid="taxonomy-badge"]') !== null,
      );
      expect(categorySelectButtons.length).toBeGreaterThan(0);

      fireEvent.click(categorySelectButtons[0]);

      expect(onCategoryClick).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: expect.any(String),
          name: expect.any(String),
        }),
      );
    });

    it('calls onCategoryClick for child categories after expanding', () => {
      const onCategoryClick = vi.fn();
      render(<TaxonomyTree type="skill" onCategoryClick={onCategoryClick} />);

      // First expand all
      fireEvent.click(screen.getByTestId('expand-all'));

      // Find buttons that contain taxonomy badges
      const allButtons = screen.getAllByRole('button');
      const categorySelectButtons = allButtons.filter(
        (btn) => btn.querySelector('[data-testid="taxonomy-badge"]') !== null,
      );

      fireEvent.click(categorySelectButtons[categorySelectButtons.length - 1]);

      expect(onCategoryClick).toHaveBeenCalled();
    });
  });

  describe('domain tree', () => {
    it('renders domain categories correctly', () => {
      render(<TaxonomyTree type="domain" />);

      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
      expect(badges[0]).toHaveAttribute('data-type', 'domain');
    });

    it('expands domain categories', () => {
      render(<TaxonomyTree type="domain" />);

      const badgesBefore = screen.getAllByTestId('taxonomy-badge');

      fireEvent.click(screen.getByTestId('expand-all'));

      // Should have more badges after expanding
      const badgesAfter = screen.getAllByTestId('taxonomy-badge');
      expect(badgesAfter.length).toBeGreaterThan(badgesBefore.length);
    });
  });
});
