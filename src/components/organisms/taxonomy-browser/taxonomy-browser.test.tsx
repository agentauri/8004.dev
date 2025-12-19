import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaxonomyBrowser } from './taxonomy-browser';

describe('TaxonomyBrowser', () => {
  describe('rendering', () => {
    it('renders taxonomy browser container', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByTestId('taxonomy-browser')).toBeInTheDocument();
    });

    it('renders tabs for skills and domains', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByTestId('taxonomy-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tab-skill')).toBeInTheDocument();
      expect(screen.getByTestId('tab-domain')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('renders tree content area', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByTestId('taxonomy-browser-content')).toBeInTheDocument();
    });

    it('defaults to skills tab', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByTestId('tab-skill')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('tab-domain')).toHaveAttribute('aria-selected', 'false');
    });

    it('respects defaultTab prop', () => {
      render(<TaxonomyBrowser defaultTab="domain" />);
      expect(screen.getByTestId('tab-skill')).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByTestId('tab-domain')).toHaveAttribute('aria-selected', 'true');
    });

    it('applies custom className', () => {
      render(<TaxonomyBrowser className="custom-class" />);
      expect(screen.getByTestId('taxonomy-browser')).toHaveClass('custom-class');
    });
  });

  describe('tab switching', () => {
    it('switches to domains tab when clicked', () => {
      render(<TaxonomyBrowser />);

      fireEvent.click(screen.getByTestId('tab-domain'));

      expect(screen.getByTestId('tab-domain')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('tab-skill')).toHaveAttribute('aria-selected', 'false');
    });

    it('displays skills tree on skills tab', () => {
      render(<TaxonomyBrowser />);

      // Skills should be visible
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    });

    it('displays domains tree on domains tab', () => {
      render(<TaxonomyBrowser defaultTab="domain" />);

      // Domains should be visible
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('clears search when switching tabs', () => {
      render(<TaxonomyBrowser />);

      // Enter a search query
      const searchInput = screen.getByPlaceholderText(/search skills/i);
      fireEvent.change(searchInput, { target: { value: 'vision' } });

      // Switch tabs
      fireEvent.click(screen.getByTestId('tab-domain'));

      // Search should be cleared
      const domainSearch = screen.getByPlaceholderText(/search domains/i);
      expect(domainSearch).toHaveValue('');
    });
  });

  describe('search functionality', () => {
    it('updates search placeholder based on active tab', () => {
      render(<TaxonomyBrowser />);

      expect(screen.getByPlaceholderText(/search skills/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('tab-domain'));

      expect(screen.getByPlaceholderText(/search domains/i)).toBeInTheDocument();
    });

    it('filters tree based on search input', () => {
      render(<TaxonomyBrowser />);

      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'vision' } });

      // Badges should still be visible for matching categories
      const badges = screen.getAllByTestId('taxonomy-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('category selection', () => {
    it('calls onCategorySelect when a category is clicked', () => {
      const onCategorySelect = vi.fn();
      render(<TaxonomyBrowser onCategorySelect={onCategorySelect} />);

      fireEvent.click(screen.getByText('Natural Language Processing'));

      expect(onCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'natural_language_processing',
        }),
        'skill',
      );
    });

    it('passes correct type when selecting domain category', () => {
      const onCategorySelect = vi.fn();
      render(<TaxonomyBrowser onCategorySelect={onCategorySelect} defaultTab="domain" />);

      fireEvent.click(screen.getByText('Technology'));

      expect(onCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'technology',
        }),
        'domain',
      );
    });
  });

  describe('descriptions', () => {
    it('shows skills description on skills tab', () => {
      render(<TaxonomyBrowser />);
      expect(screen.getByText(/skills define what an agent can do/i)).toBeInTheDocument();
    });

    it('shows domains description on domains tab', () => {
      render(<TaxonomyBrowser defaultTab="domain" />);
      expect(screen.getByText(/domains describe the industries/i)).toBeInTheDocument();
    });
  });
});
