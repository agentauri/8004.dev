import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { GlobalFeedbackFilters, FeedbackStats } from '@/types/feedback';
import { FeedbackFilters } from './feedback-filters';

const defaultFilters: GlobalFeedbackFilters = {
  chains: [],
  scoreCategory: undefined,
};

const mockStats: FeedbackStats = {
  total: 150,
  positive: 95,
  neutral: 40,
  negative: 15,
};

const meta = {
  title: 'Organisms/FeedbackFilters',
  component: FeedbackFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar filters for the feedbacks page including score category (positive/neutral/negative) and chain filters. Features stats summary and mobile-responsive toggle.',
      },
    },
  },
  argTypes: {
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
} satisfies Meta<typeof FeedbackFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
};

export const WithStats: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    stats: mockStats,
  },
};

export const Loading: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    stats: mockStats,
    isLoading: true,
  },
};

export const FilteredByPositive: Story = {
  args: {
    filters: {
      ...defaultFilters,
      scoreCategory: 'positive',
    },
    onFiltersChange: () => {},
    stats: mockStats,
  },
};

export const FilteredByNeutral: Story = {
  args: {
    filters: {
      ...defaultFilters,
      scoreCategory: 'neutral',
    },
    onFiltersChange: () => {},
    stats: mockStats,
  },
};

export const FilteredByNegative: Story = {
  args: {
    filters: {
      ...defaultFilters,
      scoreCategory: 'negative',
    },
    onFiltersChange: () => {},
    stats: mockStats,
  },
};

export const WithChainFilter: Story = {
  args: {
    filters: {
      chains: [11155111],
      scoreCategory: undefined,
    },
    onFiltersChange: () => {},
    stats: mockStats,
  },
};

export const Interactive: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    stats: mockStats,
  },
  render: function InteractiveStory(args) {
    const [filters, setFilters] = useState<GlobalFeedbackFilters>(args.filters);

    return (
      <div className="space-y-4">
        <FeedbackFilters {...args} filters={filters} onFiltersChange={setFilters} />
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
    stats: mockStats,
  },
  decorators: [
    (Story) => (
      <div className="max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside>
            <Story />
          </aside>
          <main className="p-8 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
            <p className="text-[var(--pixel-gray-400)]">Feedback feed content area</p>
          </main>
        </div>
      </div>
    ),
  ],
};
