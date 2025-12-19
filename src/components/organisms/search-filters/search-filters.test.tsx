import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FilterPreset } from '@/types/filter-preset';
import { SearchFilters, type SearchFiltersState } from './search-filters';

describe('SearchFilters', () => {
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
  };

  const defaultOnChange = vi.fn();

  beforeEach(() => {
    defaultOnChange.mockClear();
  });

  describe('rendering', () => {
    it('renders search filters container', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    });

    it('renders filters title', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('search-filters')).toHaveClass('custom-class');
    });

    it('renders status filter group', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('renders protocol filters', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByText('Protocols')).toBeInTheDocument();
      expect(screen.getByText('MCP')).toBeInTheDocument();
      expect(screen.getByText('A2A')).toBeInTheDocument();
      expect(screen.getByText('x402')).toBeInTheDocument();
    });

    it('renders chain filter group', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByText('Chains')).toBeInTheDocument();
      expect(screen.getByTestId('chain-filter-group')).toBeInTheDocument();
      expect(screen.getByTestId('chain-filter-11155111')).toBeInTheDocument();
      expect(screen.getByTestId('chain-filter-84532')).toBeInTheDocument();
      expect(screen.getByTestId('chain-filter-80002')).toBeInTheDocument();
    });

    it('renders filter mode toggle', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByText('Filter Mode')).toBeInTheDocument();
      expect(screen.getByTestId('filter-mode-toggle')).toBeInTheDocument();
    });

    it('renders reputation range filter', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByTestId('reputation-range-filter')).toBeInTheDocument();
    });
  });

  describe('status filters', () => {
    it('shows selected status filters', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, status: ['active'] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('filter-option-active')).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onFiltersChange when status is toggled', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      fireEvent.click(screen.getByTestId('filter-option-active'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        status: ['active'],
      });
    });

    it('removes status when already selected', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, status: ['active'] }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByTestId('filter-option-active'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        status: [],
      });
    });
  });

  describe('protocol filters', () => {
    it('shows selected protocol filters', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, protocols: ['mcp'] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      const mcpTag = screen
        .getAllByTestId('capability-tag')
        .find((el) => el.getAttribute('data-type') === 'mcp');
      expect(mcpTag).toHaveAttribute('data-selected', 'true');
    });

    it('calls onFiltersChange when protocol is toggled', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      const mcpTag = screen
        .getAllByTestId('capability-tag')
        .find((el) => el.getAttribute('data-type') === 'mcp');
      fireEvent.click(mcpTag!);

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        protocols: ['mcp'],
      });
    });

    it('removes protocol when already selected', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, protocols: ['mcp'] }}
          onFiltersChange={onFiltersChange}
        />,
      );

      const mcpTag = screen
        .getAllByTestId('capability-tag')
        .find((el) => el.getAttribute('data-type') === 'mcp');
      fireEvent.click(mcpTag!);

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        protocols: [],
      });
    });

    it('allows multiple protocol selections', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, protocols: ['mcp'] }}
          onFiltersChange={onFiltersChange}
        />,
      );

      const a2aTag = screen
        .getAllByTestId('capability-tag')
        .find((el) => el.getAttribute('data-type') === 'a2a');
      fireEvent.click(a2aTag!);

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        protocols: ['mcp', 'a2a'],
      });
    });
  });

  describe('chain filters', () => {
    it('shows selected chain filters', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, chains: [11155111] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('chain-filter-11155111')).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onFiltersChange when chain is toggled', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      fireEvent.click(screen.getByTestId('chain-filter-11155111'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        chains: [11155111],
      });
    });

    it('removes chain when already selected', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, chains: [11155111] }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByTestId('chain-filter-11155111'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        chains: [],
      });
    });

    it('allows multiple chain selections', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, chains: [11155111] }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByTestId('chain-filter-84532'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        chains: [11155111, 84532],
      });
    });
  });

  describe('filter mode', () => {
    it('shows current filter mode', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('data-value', 'left');
    });

    it('is enabled (backend now supports filterMode)', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      // The toggle should be enabled
      const toggleSwitch = screen.getByTestId('toggle-switch');
      expect(toggleSwitch).toHaveAttribute('data-disabled', 'false');
    });

    it('calls onFiltersChange when filter mode changes', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      fireEvent.click(screen.getByTestId('toggle-switch'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        filterMode: 'OR',
      });
    });
  });

  describe('reputation range', () => {
    it('shows current reputation range', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('0 - 100');
    });

    // Reputation range filter is now enabled (backend supports minRep/maxRep)
    it('is enabled', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      // Should be enabled
      expect(screen.getByTestId('reputation-range-filter')).toHaveAttribute(
        'data-disabled',
        'false',
      );
    });

    it('calls onFiltersChange when reputation range changes', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      const minThumb = screen.getByTestId('min-thumb');
      fireEvent.change(minThumb, { target: { value: '30' } });

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        minReputation: 30,
        maxReputation: 100,
      });
    });
  });

  describe('clear all button', () => {
    it('does not show clear all when no filters active', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.queryByTestId('clear-filters')).not.toBeInTheDocument();
    });

    it('shows clear all when status filters are active', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, status: ['active'] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });

    it('shows clear all when protocol filters are active', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, protocols: ['mcp'] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });

    it('shows clear all when chain filters are active', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, chains: [11155111] }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });

    it('shows clear all when min reputation is set', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, minReputation: 20 }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });

    it('shows clear all when max reputation is less than 100', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, maxReputation: 80 }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });

    it('clears all filters when clicked', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{
            status: ['active'],
            protocols: ['mcp'],
            chains: [11155111],
            filterMode: 'OR',
            minReputation: 20,
            maxReputation: 80,
            skills: ['natural_language_processing'],
            domains: ['technology'],
            showAllAgents: true,
          }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByTestId('clear-filters'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        status: [],
        protocols: [],
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        skills: [],
        domains: [],
        showAllAgents: false,
      });
    });

    it('shows clear all when showAllAgents is active', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, showAllAgents: true }}
          onFiltersChange={defaultOnChange}
        />,
      );
      expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    });
  });

  describe('counts', () => {
    it('displays counts when provided', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          counts={{ active: 42, inactive: 8 }}
        />,
      );
      expect(screen.getByText('(42)')).toBeInTheDocument();
      expect(screen.getByText('(8)')).toBeInTheDocument();
    });
  });

  describe('presets', () => {
    const mockPresets: FilterPreset[] = [
      {
        id: 'all',
        name: 'All',
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        activeOnly: false,
        createdAt: Date.now(),
      },
      {
        id: 'high-rep',
        name: 'High Rep',
        chains: [],
        filterMode: 'AND',
        minReputation: 70,
        maxReputation: 100,
        activeOnly: true,
        createdAt: Date.now(),
      },
    ];

    it('renders presets when provided', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
          onPresetSelect={vi.fn()}
        />,
      );
      expect(screen.getByTestId('preset-selector')).toBeInTheDocument();
    });

    it('does not render presets when not provided', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.queryByTestId('preset-selector')).not.toBeInTheDocument();
    });

    it('does not render presets when onPresetSelect is not provided', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
        />,
      );
      expect(screen.queryByTestId('preset-selector')).not.toBeInTheDocument();
    });

    it('calls onPresetSelect when preset is clicked', () => {
      const onPresetSelect = vi.fn();
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
          onPresetSelect={onPresetSelect}
        />,
      );

      fireEvent.click(screen.getByTestId('preset-button-all'));
      expect(onPresetSelect).toHaveBeenCalledWith(mockPresets[0]);
    });

    it('shows selected preset', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
          selectedPresetId="all"
          onPresetSelect={vi.fn()}
        />,
      );

      expect(screen.getByTestId('preset-button-all')).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows save button when onPresetSave is provided', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
          onPresetSelect={vi.fn()}
          onPresetSave={vi.fn()}
        />,
      );

      expect(screen.getByTestId('save-preset-button')).toBeInTheDocument();
    });

    it('enables save button when hasUnsavedChanges is true', () => {
      render(
        <SearchFilters
          filters={defaultFilters}
          onFiltersChange={defaultOnChange}
          presets={mockPresets}
          onPresetSelect={vi.fn()}
          onPresetSave={vi.fn()}
          hasUnsavedChanges={true}
        />,
      );

      expect(screen.getByTestId('save-preset-button')).not.toBeDisabled();
    });
  });

  describe('showAllAgents toggle', () => {
    it('renders show all agents toggle', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      expect(screen.getByTestId('show-all-agents-toggle')).toBeInTheDocument();
      expect(screen.getByText('Show all agents')).toBeInTheDocument();
    });

    it('toggle is unchecked by default', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} />);
      const toggle = screen.getByTestId('show-all-agents-toggle');
      expect(toggle).not.toBeChecked();
    });

    it('toggle is checked when showAllAgents is true', () => {
      render(
        <SearchFilters
          filters={{ ...defaultFilters, showAllAgents: true }}
          onFiltersChange={defaultOnChange}
        />,
      );
      const toggle = screen.getByTestId('show-all-agents-toggle');
      expect(toggle).toBeChecked();
    });

    it('calls onFiltersChange when toggle is clicked', () => {
      const onFiltersChange = vi.fn();
      render(<SearchFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);

      fireEvent.click(screen.getByTestId('show-all-agents-toggle'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        showAllAgents: true,
      });
    });

    it('unchecks toggle when showAllAgents is true and clicked', () => {
      const onFiltersChange = vi.fn();
      render(
        <SearchFilters
          filters={{ ...defaultFilters, showAllAgents: true }}
          onFiltersChange={onFiltersChange}
        />,
      );

      fireEvent.click(screen.getByTestId('show-all-agents-toggle'));

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        showAllAgents: false,
      });
    });
  });

  describe('disabled state', () => {
    it('applies disabled styling', () => {
      render(<SearchFilters filters={defaultFilters} onFiltersChange={defaultOnChange} disabled />);
      expect(screen.getByTestId('search-filters')).toHaveClass('opacity-50');
      expect(screen.getByTestId('search-filters')).toHaveClass('pointer-events-none');
    });
  });
});
