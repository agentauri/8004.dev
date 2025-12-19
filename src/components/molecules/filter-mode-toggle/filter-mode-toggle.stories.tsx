import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { type FilterMode, FilterModeToggle } from './filter-mode-toggle';

const meta = {
  title: 'Molecules/FilterModeToggle',
  component: FilterModeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle switch for AND/OR filter modes with an explanatory tooltip. Used to control how multiple filters are combined.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'radio',
      options: ['AND', 'OR'],
      description: 'Current filter mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FilterModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'AND',
    onChange: () => {},
  },
};

export const AndMode: Story = {
  args: {
    value: 'AND',
    onChange: () => {},
  },
};

export const OrMode: Story = {
  args: {
    value: 'OR',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: 'AND',
    onChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    value: 'AND',
    onChange: () => {},
  },
  render: function InteractiveToggle() {
    const [mode, setMode] = useState<FilterMode>('AND');
    return (
      <div className="space-y-4">
        <FilterModeToggle value={mode} onChange={setMode} />
        <div className="text-sm text-[var(--pixel-gray-400)]">
          Current mode: <span className="text-[var(--pixel-blue-sky)]">{mode}</span>
        </div>
        <div className="text-xs text-[var(--pixel-gray-500)]">
          {mode === 'AND'
            ? 'Results will match ALL selected filters'
            : 'Results will match ANY selected filter'}
        </div>
      </div>
    );
  },
};

export const InFilterContext: Story = {
  args: {
    value: 'AND',
    onChange: () => {},
  },
  render: function FilterContext() {
    const [mode, setMode] = useState<FilterMode>('AND');
    const [filters] = useState(['Ethereum', 'Base', 'Active']);

    return (
      <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] max-w-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)]">
            FILTER MODE
          </span>
          <FilterModeToggle value={mode} onChange={setMode} />
        </div>
        <div className="space-y-2">
          <span className="text-xs text-[var(--pixel-gray-400)]">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <span
                key={filter}
                className="px-2 py-1 text-[0.625rem] bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)]"
              >
                {filter}
              </span>
            ))}
          </div>
          <div className="text-[0.625rem] text-[var(--pixel-gray-500)] mt-2">
            {mode === 'AND'
              ? `Showing agents that match: ${filters.join(' AND ')}`
              : `Showing agents that match: ${filters.join(' OR ')}`}
          </div>
        </div>
      </div>
    );
  },
};
