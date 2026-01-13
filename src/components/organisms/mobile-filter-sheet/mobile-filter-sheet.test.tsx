import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { MobileFilterSheet } from './mobile-filter-sheet';

// Mock SearchFilters to avoid complex dependency
vi.mock('@/components/organisms/search-filters', () => ({
  SearchFilters: ({ disabled }: { disabled?: boolean }) => (
    <div data-testid="search-filters" data-disabled={disabled}>
      Mocked SearchFilters
    </div>
  ),
}));

const defaultFilters: SearchFiltersState = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
  // Gap 1: Trust Score & Version Filters
  minTrustScore: 0,
  maxTrustScore: 100,
  // Gap 3: Curation Filters
  isCurated: false,
  curatedBy: '',
  // Gap 5: Endpoint Filters
  hasEmail: false,
  hasOasfEndpoint: false,
  // Gap 6: Reachability Filters
  hasRecentReachability: false,
};

describe('MobileFilterSheet', () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up body overflow after each test
    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('renders trigger button', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.getByTestId('mobile-filter-sheet-trigger')).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.getByTestId('mobile-filter-sheet')).toBeInTheDocument();
    });

    it('shows "Filters" text on trigger button', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      // Trigger button contains "Filters" text
      const trigger = screen.getByTestId('mobile-filter-sheet-trigger');
      expect(trigger).toHaveTextContent('Filters');
    });

    it('applies custom className', () => {
      render(
        <MobileFilterSheet
          filters={defaultFilters}
          onFiltersChange={() => {}}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet')).toHaveClass('custom-class');
    });
  });

  describe('filter count badge', () => {
    it('does not show count badge when no filters active', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.queryByTestId('mobile-filter-sheet-count')).not.toBeInTheDocument();
    });

    it('shows count badge when status filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, status: ['active'] }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows count badge when protocols filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, protocols: ['mcp'] }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows count badge when chains filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, chains: [11155111] }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows count badge when skills filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, skills: ['nlp'] }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows count badge when domains filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, domains: ['technology'] }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows count badge when reputation filter is active', () => {
      render(
        <MobileFilterSheet
          filters={{ ...defaultFilters, minReputation: 50 }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('1');
    });

    it('shows correct count when multiple filters active', () => {
      render(
        <MobileFilterSheet
          filters={{
            ...defaultFilters,
            status: ['active'],
            protocols: ['mcp'],
            chains: [11155111],
          }}
          onFiltersChange={() => {}}
        />,
      );
      expect(screen.getByTestId('mobile-filter-sheet-count')).toHaveTextContent('3');
    });
  });

  describe('open/close behavior', () => {
    it('sheet is closed by default', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      const panel = screen.getByTestId('mobile-filter-sheet-panel');
      expect(panel).toHaveClass('translate-y-full');
    });

    it('opens sheet when trigger clicked', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      const panel = screen.getByTestId('mobile-filter-sheet-panel');
      expect(panel).toHaveClass('translate-y-0');
    });

    it('shows backdrop when sheet is open', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      expect(screen.getByTestId('mobile-filter-sheet-backdrop')).toBeInTheDocument();
    });

    it('closes sheet when backdrop clicked', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));
      fireEvent.click(screen.getByTestId('mobile-filter-sheet-backdrop'));

      const panel = screen.getByTestId('mobile-filter-sheet-panel');
      expect(panel).toHaveClass('translate-y-full');
    });

    it('closes sheet when close button clicked', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));
      fireEvent.click(screen.getByTestId('mobile-filter-sheet-close'));

      const panel = screen.getByTestId('mobile-filter-sheet-panel');
      expect(panel).toHaveClass('translate-y-full');
    });

    it('closes sheet when apply button clicked', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));
      fireEvent.click(screen.getByTestId('mobile-filter-sheet-apply'));

      const panel = screen.getByTestId('mobile-filter-sheet-panel');
      expect(panel).toHaveClass('translate-y-full');
    });

    it('closes sheet when Escape key pressed', async () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        const panel = screen.getByTestId('mobile-filter-sheet-panel');
        expect(panel).toHaveClass('translate-y-full');
      });
    });

    it('locks body scroll when open', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body scroll when closed', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));
      fireEvent.click(screen.getByTestId('mobile-filter-sheet-close'));

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('disabled state', () => {
    it('disables trigger button when disabled', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} disabled />);
      expect(screen.getByTestId('mobile-filter-sheet-trigger')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('trigger has aria-expanded attribute', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      const trigger = screen.getByTestId('mobile-filter-sheet-trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-haspopup attribute', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.getByTestId('mobile-filter-sheet-trigger')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
    });

    it('sheet panel has role dialog', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.getByTestId('mobile-filter-sheet-panel')).toHaveAttribute('role', 'dialog');
    });

    it('sheet panel has aria-modal', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);
      expect(screen.getByTestId('mobile-filter-sheet-panel')).toHaveAttribute('aria-modal', 'true');
    });

    it('close button has aria-label', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      expect(screen.getByTestId('mobile-filter-sheet-close')).toHaveAttribute(
        'aria-label',
        'Close filters',
      );
    });
  });

  describe('content', () => {
    it('renders SearchFilters inside sheet', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    });

    it('renders Apply Filters button', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('renders Filters heading', () => {
      render(<MobileFilterSheet filters={defaultFilters} onFiltersChange={() => {}} />);

      fireEvent.click(screen.getByTestId('mobile-filter-sheet-trigger'));

      // There are two "Filters" texts - one in button, one in heading
      const headings = screen.getAllByText('Filters');
      expect(headings.length).toBeGreaterThanOrEqual(2);
    });
  });
});
