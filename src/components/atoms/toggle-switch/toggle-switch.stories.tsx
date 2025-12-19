import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { ToggleSwitch } from './toggle-switch';

const meta = {
  title: 'Atoms/ToggleSwitch',
  component: ToggleSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A binary toggle switch for selecting between two options. Used for filter modes like AND/OR.',
      },
    },
  },
  argTypes: {
    leftLabel: {
      control: 'text',
      description: 'Left option label',
    },
    rightLabel: {
      control: 'text',
      description: 'Right option label',
    },
    value: {
      control: 'boolean',
      description: 'Current value (true = right, false = left)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
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
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
  },
};

export const RightSelected: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: true,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: true,
    onChange: () => {},
    size: 'lg',
  },
};

export const AllSizes: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Small</p>
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} size="sm" />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Medium (default)</p>
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={() => {}} size="md" />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Large</p>
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} size="lg" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
  },
  render: function InteractiveToggle() {
    const [value, setValue] = useState(false);
    return (
      <div className="space-y-4">
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={value} onChange={setValue} />
        <p className="text-sm text-[var(--pixel-gray-400)]">
          Current mode: <strong>{value ? 'OR' : 'AND'}</strong>
        </p>
      </div>
    );
  },
};

export const CustomLabels: Story = {
  args: {
    leftLabel: 'OFF',
    rightLabel: 'ON',
    value: false,
    onChange: () => {},
  },
};

export const InContext: Story = {
  args: {
    leftLabel: 'AND',
    rightLabel: 'OR',
    value: false,
    onChange: () => {},
  },
  render: function InContextToggle() {
    const [value, setValue] = useState(false);
    return (
      <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)]">
            FILTER MODE
          </span>
          <ToggleSwitch
            leftLabel="AND"
            rightLabel="OR"
            value={value}
            onChange={setValue}
            size="sm"
          />
        </div>
        <p className="text-[0.625rem] text-[var(--pixel-gray-500)]">
          {value ? 'Match any of the selected filters' : 'Match all of the selected filters'}
        </p>
      </div>
    );
  },
};
