import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { LeaderboardFiltersState } from '@/types/leaderboard';
import { LeaderboardFilters } from './leaderboard-filters';

const defaultFilters: LeaderboardFiltersState = {
  chains: [],
  protocols: [],
  period: 'all',
};

const meta = {
  title: 'Organisms/LeaderboardFilters',
  component: LeaderboardFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar filters for the leaderboard page including time period, chain, and protocol filters. Features mobile-responsive toggle.',
      },
    },
  },
  argTypes: {
    totalCount: {
      control: { type: 'number', min: 0 },
      description: 'Total count of results',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether data is loading',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeaderboardFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
};

export const WithTotalCount: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    totalCount: 150,
  },
};

export const Loading: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    totalCount: 150,
    isLoading: true,
  },
};

export const WithActiveFilters: Story = {
  args: {
    filters: {
      chains: [11155111],
      protocols: ['mcp'],
      period: '7d',
    },
    onFiltersChange: () => {},
    totalCount: 45,
  },
};

export const Period24Hours: Story = {
  args: {
    filters: {
      ...defaultFilters,
      period: '24h',
    },
    onFiltersChange: () => {},
    totalCount: 25,
  },
};

export const Interactive: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    totalCount: 150,
  },
  render: function InteractiveStory(args) {
    const [filters, setFilters] = useState<LeaderboardFiltersState>(args.filters);

    return (
      <div className="space-y-4">
        <LeaderboardFilters {...args} filters={filters} onFiltersChange={setFilters} />
        <div className="p-4 bg-[var(--pixel-gray-800)] text-xs text-[var(--pixel-gray-400)] font-mono">
          <p>Current filters:</p>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

export const InPageContext: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    totalCount: 150,
  },
  decorators: [
    (Story) => (
      <div className="max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside>
            <Story />
          </aside>
          <main className="p-8 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
            <p className="text-[var(--pixel-gray-400)]">Leaderboard table content area</p>
          </main>
        </div>
      </div>
    ),
  ],
};
