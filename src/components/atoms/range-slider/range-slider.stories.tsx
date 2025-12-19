import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { RangeSlider } from './range-slider';

const meta = {
  title: 'Atoms/RangeSlider',
  component: RangeSlider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dual-handle range slider for selecting a range of values. Used for reputation range filtering.',
      },
    },
  },
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value of the range',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the range',
    },
    minValue: {
      control: 'number',
      description: 'Current minimum value',
    },
    maxValue: {
      control: 'number',
      description: 'Current maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 20,
    maxValue: 80,
    onChange: () => {},
  },
};

export const FullRange: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 0,
    maxValue: 100,
    onChange: () => {},
  },
};

export const NarrowRange: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 40,
    maxValue: 60,
    onChange: () => {},
  },
};

export const WithStep: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 25,
    maxValue: 75,
    step: 5,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 30,
    maxValue: 70,
    disabled: true,
    onChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 20,
    maxValue: 80,
    onChange: () => {},
  },
  render: function InteractiveSlider() {
    const [range, setRange] = useState({ min: 20, max: 80 });
    return (
      <div className="w-64 space-y-4">
        <RangeSlider
          min={0}
          max={100}
          minValue={range.min}
          maxValue={range.max}
          onChange={(min, max) => setRange({ min, max })}
        />
        <div className="flex justify-between text-sm text-[var(--pixel-gray-400)]">
          <span>Min: {range.min}</span>
          <span>Max: {range.max}</span>
        </div>
      </div>
    );
  },
};

export const ReputationRange: Story = {
  args: {
    min: 0,
    max: 100,
    minValue: 40,
    maxValue: 100,
    onChange: () => {},
  },
  render: function ReputationSlider() {
    const [range, setRange] = useState({ min: 40, max: 100 });
    return (
      <div className="w-64 p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)]">
            REPUTATION
          </span>
          <span className="text-[0.625rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-blue-sky)]">
            {range.min} - {range.max}
          </span>
        </div>
        <RangeSlider
          min={0}
          max={100}
          minValue={range.min}
          maxValue={range.max}
          onChange={(min, max) => setRange({ min, max })}
          step={5}
        />
        <div className="flex justify-between mt-2 text-[0.5rem] text-[var(--pixel-gray-500)]">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    );
  },
};
