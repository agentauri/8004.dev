import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TaxonomyCategory } from '@/lib/constants/oasf/types';
import { TaxonomyTreeNode } from './taxonomy-tree-node';

const mockParentCategory: TaxonomyCategory = {
  id: 1,
  slug: 'natural_language_processing',
  name: 'Natural Language Processing',
  description: 'NLP capabilities',
  children: [
    {
      id: 101,
      slug: 'natural_language_processing/summarization',
      name: 'Summarization',
      parentId: 1,
    },
    { id: 102, slug: 'natural_language_processing/translation', name: 'Translation', parentId: 1 },
  ],
};

const mockLeafCategory: TaxonomyCategory = {
  id: 101,
  slug: 'natural_language_processing/summarization',
  name: 'Summarization',
  parentId: 1,
};

describe('TaxonomyTreeNode', () => {
  describe('rendering', () => {
    it('renders with data-testid', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toBeInTheDocument();
    });

    it('renders category name', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    });

    it('renders with data attributes', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={2}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      const node = screen.getByTestId('taxonomy-tree-node');
      expect(node).toHaveAttribute('data-slug', 'natural_language_processing');
      expect(node).toHaveAttribute('data-depth', '2');
      expect(node).toHaveAttribute('data-type', 'skill');
    });

    it('applies custom className', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveClass('custom-class');
    });
  });

  describe('children count', () => {
    it('shows children count for parent nodes', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node-count')).toHaveTextContent('(2)');
    });

    it('does not show count for leaf nodes', () => {
      render(
        <TaxonomyTreeNode
          category={mockLeafCategory}
          type="skill"
          depth={1}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.queryByTestId('taxonomy-tree-node-count')).not.toBeInTheDocument();
    });
  });

  describe('indentation', () => {
    it('applies indentation based on depth', () => {
      const { rerender } = render(
        <TaxonomyTreeNode
          category={mockLeafCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      let node = screen.getByTestId('taxonomy-tree-node');
      expect(node).toHaveStyle({ paddingLeft: '8px' });

      rerender(
        <TaxonomyTreeNode
          category={mockLeafCategory}
          type="skill"
          depth={2}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      node = screen.getByTestId('taxonomy-tree-node');
      expect(node).toHaveStyle({ paddingLeft: '40px' });
    });
  });

  describe('expand/collapse', () => {
    it('calls onToggle when indicator is clicked on parent node', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={onToggle}
        />,
      );

      fireEvent.click(screen.getByTestId('taxonomy-tree-node-indicator'));
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('does not call onToggle when indicator is clicked on leaf node', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockLeafCategory}
          type="skill"
          depth={1}
          isExpanded={false}
          onToggle={onToggle}
        />,
      );

      fireEvent.click(screen.getByTestId('taxonomy-tree-node-indicator'));
      expect(onToggle).not.toHaveBeenCalled();
    });

    it('sets aria-expanded=true when expanded', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={true}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-expanded=false when collapsed', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not set aria-expanded for leaf nodes', () => {
      render(
        <TaxonomyTreeNode
          category={mockLeafCategory}
          type="skill"
          depth={1}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).not.toHaveAttribute('aria-expanded');
    });
  });

  describe('selection', () => {
    it('calls onSelect when node is clicked', () => {
      const onSelect = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
          onSelect={onSelect}
        />,
      );

      fireEvent.click(screen.getByTestId('taxonomy-tree-node'));
      expect(onSelect).toHaveBeenCalledWith(mockParentCategory);
    });

    it('sets aria-selected=true when selected', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          isSelected={true}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected=false when not selected', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          isSelected={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('aria-selected', 'false');
    });

    it('applies selected styling for skills', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          isSelected={true}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveClass('bg-[var(--taxonomy-skill)]/10');
    });

    it('applies selected styling for domains', () => {
      render(
        <TaxonomyTreeNode
          category={{ ...mockParentCategory, slug: 'technology' }}
          type="domain"
          depth={0}
          isExpanded={false}
          isSelected={true}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveClass(
        'bg-[var(--taxonomy-domain)]/10',
      );
    });
  });

  describe('keyboard navigation', () => {
    it('calls onSelect on Enter key', () => {
      const onSelect = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
          onSelect={onSelect}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: 'Enter' });
      expect(onSelect).toHaveBeenCalledWith(mockParentCategory);
    });

    it('calls onToggle on Space key for parent nodes', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={onToggle}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: ' ' });
      expect(onToggle).toHaveBeenCalled();
    });

    it('expands on ArrowRight when collapsed', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={onToggle}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: 'ArrowRight' });
      expect(onToggle).toHaveBeenCalled();
    });

    it('collapses on ArrowLeft when expanded', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={true}
          onToggle={onToggle}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: 'ArrowLeft' });
      expect(onToggle).toHaveBeenCalled();
    });

    it('does not toggle on ArrowRight when already expanded', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={true}
          onToggle={onToggle}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: 'ArrowRight' });
      expect(onToggle).not.toHaveBeenCalled();
    });

    it('does not toggle on ArrowLeft when already collapsed', () => {
      const onToggle = vi.fn();
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={onToggle}
        />,
      );

      fireEvent.keyDown(screen.getByTestId('taxonomy-tree-node'), { key: 'ArrowLeft' });
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has role="treeitem"', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByRole('treeitem')).toBeInTheDocument();
    });

    it('is focusable', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('types', () => {
    it('handles skill type', () => {
      render(
        <TaxonomyTreeNode
          category={mockParentCategory}
          type="skill"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('data-type', 'skill');
    });

    it('handles domain type', () => {
      render(
        <TaxonomyTreeNode
          category={{ id: 1, slug: 'technology', name: 'Technology' }}
          type="domain"
          depth={0}
          isExpanded={false}
          onToggle={() => {}}
        />,
      );
      expect(screen.getByTestId('taxonomy-tree-node')).toHaveAttribute('data-type', 'domain');
    });
  });
});
