import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { type SortField, type SortOrder, SortSelector } from './sort-selector';

const meta = {
  title: 'Molecules/SortSelector',
  component: SortSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SortSelector provides a dropdown to select sort field and order for agent search results. Supports sorting by relevance, name, date, and reputation.',
      },
    },
  },
  argTypes: {
    sortBy: {
      control: 'select',
      options: ['relevance', 'name', 'createdAt', 'reputation'],
      description: 'Currently selected sort field',
    },
    order: {
      control: 'radio',
      options: ['asc', 'desc'],
      description: 'Current sort order',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
  },
} satisfies Meta<typeof SortSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sortBy: 'relevance',
    order: 'desc',
    onChange: () => {},
  },
};

export const SortByName: Story = {
  args: {
    sortBy: 'name',
    order: 'asc',
    onChange: () => {},
  },
};

export const SortByDate: Story = {
  args: {
    sortBy: 'createdAt',
    order: 'desc',
    onChange: () => {},
  },
};

export const SortByReputation: Story = {
  args: {
    sortBy: 'reputation',
    order: 'desc',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    sortBy: 'relevance',
    order: 'desc',
    onChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    sortBy: 'relevance',
    order: 'desc',
    onChange: () => {},
  },
  render: function InteractiveSortSelector() {
    const [sortBy, setSortBy] = useState<SortField>('relevance');
    const [order, setOrder] = useState<SortOrder>('desc');

    return (
      <div className="space-y-4">
        <SortSelector
          sortBy={sortBy}
          order={order}
          onChange={(newSortBy, newOrder) => {
            setSortBy(newSortBy);
            setOrder(newOrder);
          }}
        />
        <div className="text-sm text-[var(--pixel-gray-400)] font-mono">
          Current: sortBy=&quot;{sortBy}&quot; order=&quot;{order}&quot;
        </div>
      </div>
    );
  },
};
