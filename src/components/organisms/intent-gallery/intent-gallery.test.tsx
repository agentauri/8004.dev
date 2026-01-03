import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { IntentTemplate } from '@/types';
import { IntentGallery } from './intent-gallery';

const mockTemplates: IntentTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review Workflow',
    description: 'Automated code review with AI agents',
    category: 'development',
    steps: [
      {
        order: 1,
        name: 'Analyze',
        description: 'Analyze code',
        requiredRole: 'analyzer',
        inputs: ['code'],
        outputs: ['report'],
      },
    ],
    requiredRoles: ['code-analyzer', 'reviewer'],
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline Automation',
    description: 'Automated data processing',
    category: 'automation',
    steps: [
      {
        order: 1,
        name: 'Extract',
        description: 'Extract data',
        requiredRole: 'extractor',
        inputs: ['source'],
        outputs: ['data'],
      },
    ],
    requiredRoles: ['data-extractor', 'transformer'],
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Security vulnerability scanning',
    category: 'security',
    steps: [
      {
        order: 1,
        name: 'Scan',
        description: 'Scan for vulnerabilities',
        requiredRole: 'scanner',
        inputs: ['target'],
        outputs: ['findings'],
      },
    ],
    requiredRoles: ['security-scanner'],
  },
];

describe('IntentGallery', () => {
  describe('rendering', () => {
    it('renders the intent gallery', () => {
      render(<IntentGallery templates={mockTemplates} />);
      expect(screen.getByTestId('intent-gallery')).toBeInTheDocument();
    });

    it('renders all templates', () => {
      render(<IntentGallery templates={mockTemplates} />);
      expect(screen.getAllByTestId('intent-card')).toHaveLength(3);
    });

    it('renders category tabs', () => {
      render(<IntentGallery templates={mockTemplates} />);
      expect(screen.getByTestId('intent-category-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('category-tab-all')).toBeInTheDocument();
      expect(screen.getByTestId('category-tab-development')).toBeInTheDocument();
      expect(screen.getByTestId('category-tab-automation')).toBeInTheDocument();
      expect(screen.getByTestId('category-tab-security')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<IntentGallery templates={mockTemplates} />);
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<IntentGallery templates={mockTemplates} className="custom-class" />);
      expect(screen.getByTestId('intent-gallery')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('shows loading state', () => {
      render(<IntentGallery templates={[]} isLoading />);
      expect(screen.getByTestId('intent-gallery-loading')).toBeInTheDocument();
    });

    it('shows loading message', () => {
      render(<IntentGallery templates={[]} isLoading />);
      expect(screen.getByText('Loading templates...')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when no templates', () => {
      render(<IntentGallery templates={[]} />);
      expect(screen.getByTestId('intent-gallery-empty')).toBeInTheDocument();
    });

    it('shows empty state message', () => {
      render(<IntentGallery templates={[]} />);
      expect(screen.getByText('No Templates Found')).toBeInTheDocument();
    });
  });

  describe('category filtering', () => {
    it('filters by category when tab is clicked', () => {
      render(<IntentGallery templates={mockTemplates} />);

      // Initially shows all
      expect(screen.getAllByTestId('intent-card')).toHaveLength(3);

      // Click development category
      fireEvent.click(screen.getByTestId('category-tab-development'));

      // Should show only development templates
      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);
      expect(screen.getByText('Code Review Workflow')).toBeInTheDocument();
    });

    it('shows all templates when "all" is selected', () => {
      render(<IntentGallery templates={mockTemplates} />);

      // Filter to development first
      fireEvent.click(screen.getByTestId('category-tab-development'));
      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);

      // Click all
      fireEvent.click(screen.getByTestId('category-tab-all'));
      expect(screen.getAllByTestId('intent-card')).toHaveLength(3);
    });

    it('applies active style to selected category tab', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const allTab = screen.getByTestId('category-tab-all');
      expect(allTab).toHaveClass('border-[var(--pixel-blue-sky)]');

      fireEvent.click(screen.getByTestId('category-tab-development'));
      expect(screen.getByTestId('category-tab-development')).toHaveClass(
        'border-[var(--pixel-blue-sky)]',
      );
    });
  });

  describe('search filtering', () => {
    it('filters templates by search query', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'security' } });

      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);
      expect(screen.getByText('Security Audit')).toBeInTheDocument();
    });

    it('filters by template name', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'Code Review' } });

      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);
    });

    it('filters by template description', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'vulnerability' } });

      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);
      expect(screen.getByText('Security Audit')).toBeInTheDocument();
    });

    it('filters by role name', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'data-extractor' } });

      expect(screen.getAllByTestId('intent-card')).toHaveLength(1);
      expect(screen.getByText('Data Pipeline Automation')).toBeInTheDocument();
    });

    it('shows empty state when no search results', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByTestId('intent-gallery-empty')).toBeInTheDocument();
    });

    it('shows clear filters button when search has no results', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('clears filters when clear button is clicked', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      fireEvent.click(screen.getByText('Clear Filters'));

      expect(screen.getAllByTestId('intent-card')).toHaveLength(3);
    });
  });

  describe('selection', () => {
    it('calls onSelect when template is clicked', () => {
      const onSelect = vi.fn();
      render(<IntentGallery templates={mockTemplates} onSelect={onSelect} />);

      fireEvent.click(screen.getAllByTestId('intent-card')[0]);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(mockTemplates[0]);
    });

    it('does not make cards clickable when onSelect is not provided', () => {
      render(<IntentGallery templates={mockTemplates} />);

      const cards = screen.getAllByTestId('intent-card');
      expect(cards[0]).not.toHaveAttribute('role', 'button');
    });
  });

  describe('results count', () => {
    it('shows results count', () => {
      render(<IntentGallery templates={mockTemplates} />);
      expect(screen.getByText('Showing 3 of 3 templates')).toBeInTheDocument();
    });

    it('updates count when filtered', () => {
      render(<IntentGallery templates={mockTemplates} />);

      fireEvent.click(screen.getByTestId('category-tab-development'));

      expect(screen.getByText('Showing 1 of 3 templates')).toBeInTheDocument();
    });
  });
});
