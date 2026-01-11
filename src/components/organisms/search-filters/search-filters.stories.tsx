import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { SearchFilters, type SearchFiltersState } from './search-filters';

const meta = {
  title: 'Organisms/SearchFilters',
  component: SearchFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Filtering controls for agent search. Includes status filters, protocol/capability filters, filter mode toggle, reputation range, and preset selector.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable all filter controls',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SearchFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  minTrustScore: 0,
  maxTrustScore: 100,
  erc8004Version: '',
  mcpVersion: '',
  a2aVersion: '',
  isCurated: false,
  curatedBy: '',
  hasEmail: false,
  hasOasfEndpoint: false,
  hasRecentReachability: false,
};

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
};

export const WithActiveFilters: Story = {
  args: {
    filters: {
      ...defaultFilters,
      status: ['active'],
      protocols: ['mcp'],
    },
    onFiltersChange: () => {},
  },
};

export const WithCounts: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    counts: {
      active: 156,
      inactive: 24,
      mcp: 89,
      a2a: 45,
      x402: 12,
    },
  },
};

export const FullySelected: Story = {
  args: {
    filters: {
      ...defaultFilters,
      status: ['active', 'inactive'],
      protocols: ['mcp', 'a2a', 'x402'],
      chains: [11155111, 84532],
      filterMode: 'OR',
      minReputation: 30,
      maxReputation: 90,
      skills: ['natural_language_processing'],
      domains: ['technology'],
      showAllAgents: true,
    },
    onFiltersChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
  render: function InteractiveStory() {
    const [filters, setFilters] = useState<SearchFiltersState>(defaultFilters);

    return (
      <div className="flex gap-8">
        <div className="w-64">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            counts={{
              active: 156,
              inactive: 24,
              mcp: 89,
              a2a: 45,
              x402: 12,
            }}
          />
        </div>
        <div className="flex-1 p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
          <h4 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)] text-sm mb-2">
            Current Filters:
          </h4>
          <pre className="text-[var(--pixel-gray-400)] text-xs font-mono">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

export const InSidebarContext: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
  render: function InSidebarContextStory() {
    const [filters, setFilters] = useState<SearchFiltersState>({
      ...defaultFilters,
      status: ['active'],
    });

    return (
      <div className="flex gap-6 min-h-[400px]">
        <aside className="w-64 p-4 bg-[var(--pixel-gray-900)] border-r border-[var(--pixel-gray-700)]">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            counts={{
              active: 156,
              inactive: 24,
              mcp: 89,
              a2a: 45,
              x402: 12,
            }}
          />
        </aside>
        <main className="flex-1 p-4">
          <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-lg mb-4">
            SEARCH RESULTS
          </h2>
          <p className="text-[var(--pixel-gray-400)] text-sm">
            Showing agents matching your filters...
          </p>
        </main>
      </div>
    );
  },
};
