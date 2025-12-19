import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { ReputationRangeFilter } from './reputation-range-filter';

const meta = {
  title: 'Molecules/ReputationRangeFilter',
  component: ReputationRangeFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labeled range slider for filtering agents by reputation score. Includes header, current value display, and scale markers.',
      },
    },
  },
  argTypes: {
    minValue: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Minimum reputation value',
    },
    maxValue: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Maximum reputation value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ReputationRangeFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    minValue: 20,
    maxValue: 80,
    onChange: () => {},
  },
};

export const FullRange: Story = {
  args: {
    minValue: 0,
    maxValue: 100,
    onChange: () => {},
  },
};

export const HighReputation: Story = {
  args: {
    minValue: 70,
    maxValue: 100,
    onChange: () => {},
  },
};

export const NarrowRange: Story = {
  args: {
    minValue: 45,
    maxValue: 55,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    minValue: 40,
    maxValue: 80,
    onChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    minValue: 20,
    maxValue: 80,
    onChange: () => {},
  },
  render: function InteractiveFilter() {
    const [range, setRange] = useState({ min: 20, max: 80 });
    return (
      <div className="w-64 space-y-4">
        <ReputationRangeFilter
          minValue={range.min}
          maxValue={range.max}
          onChange={(min, max) => setRange({ min, max })}
        />
        <div className="text-xs text-[var(--pixel-gray-400)]">
          Showing agents with reputation between{' '}
          <span className="text-[var(--pixel-blue-sky)]">{range.min}</span> and{' '}
          <span className="text-[var(--pixel-blue-sky)]">{range.max}</span>
        </div>
      </div>
    );
  },
};

export const InFilterPanel: Story = {
  args: {
    minValue: 40,
    maxValue: 100,
    onChange: () => {},
  },
  render: function FilterPanel() {
    const [range, setRange] = useState({ min: 40, max: 100 });

    return (
      <div className="w-72 p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
        <div className="text-sm font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)] mb-4">
          FILTERS
        </div>

        <ReputationRangeFilter
          minValue={range.min}
          maxValue={range.max}
          onChange={(min, max) => setRange({ min, max })}
          step={5}
        />

        <div className="mt-4 pt-4 border-t border-[var(--pixel-gray-700)]">
          <div className="text-[0.625rem] text-[var(--pixel-gray-500)]">
            {range.min === 0 && range.max === 100
              ? 'Showing all reputation levels'
              : range.min >= 70
                ? 'Showing high reputation agents only'
                : range.max <= 30
                  ? 'Showing low reputation agents only'
                  : `Filtering by reputation ${range.min}-${range.max}`}
          </div>
        </div>
      </div>
    );
  },
};
