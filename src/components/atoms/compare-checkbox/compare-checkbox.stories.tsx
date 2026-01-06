import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CompareCheckbox } from './compare-checkbox';

const meta = {
  title: 'Atoms/CompareCheckbox',
  component: CompareCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A checkbox button for selecting agents to compare. Uses compare arrows icon to indicate comparison functionality. Supports checked/unchecked states, disabled mode, and multiple sizes.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the checkbox',
    },
    label: {
      control: 'text',
      description: 'Custom accessibility label',
    },
  },
} satisfies Meta<typeof CompareCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked state
 */
export const Default: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};

/**
 * Checked state with blue border and glow effect
 */
export const Checked: Story = {
  args: {
    checked: true,
    onChange: () => {},
  },
};

/**
 * Disabled state with reduced opacity
 */
export const Disabled: Story = {
  args: {
    checked: false,
    onChange: () => {},
    disabled: true,
  },
};

/**
 * Disabled but checked - shows selection cannot be modified
 */
export const DisabledChecked: Story = {
  args: {
    checked: true,
    onChange: () => {},
    disabled: true,
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    checked: false,
    onChange: () => {},
    size: 'sm',
  },
};

/**
 * Small size checked
 */
export const SmallSizeChecked: Story = {
  args: {
    checked: true,
    onChange: () => {},
    size: 'sm',
  },
};

/**
 * With custom accessibility label
 */
export const WithCustomLabel: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: 'Compare Trading Bot Alpha',
  },
};

/**
 * Interactive demo with toggle functionality
 */
export const Interactive: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <CompareCheckbox checked={checked} onChange={() => setChecked(!checked)} />
        <span className="text-sm text-[var(--pixel-gray-400)]">
          {checked ? 'Selected for comparison' : 'Click to select'}
        </span>
      </div>
    );
  },
};

/**
 * Multiple checkboxes showing selection limit scenario
 */
export const SelectionLimit: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
  render: () => {
    const [selected, setSelected] = useState<number[]>([0, 1]);
    const MAX_SELECTION = 4;

    const toggleSelection = (id: number) => {
      if (selected.includes(id)) {
        setSelected(selected.filter((s) => s !== id));
      } else if (selected.length < MAX_SELECTION) {
        setSelected([...selected, id]);
      }
    };

    const agents = [
      'Trading Bot Alpha',
      'Code Review Agent',
      'Data Analysis Bot',
      'Security Scanner',
      'Market Analyzer',
    ];

    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--pixel-gray-400)] mb-4">
          Select up to {MAX_SELECTION} agents ({selected.length}/{MAX_SELECTION})
        </p>
        {agents.map((agent, idx) => (
          <div key={agent} className="flex items-center gap-3">
            <CompareCheckbox
              checked={selected.includes(idx)}
              onChange={() => toggleSelection(idx)}
              disabled={!selected.includes(idx) && selected.length >= MAX_SELECTION}
              label={`Compare ${agent}`}
            />
            <span
              className={
                selected.includes(idx)
                  ? 'text-[var(--pixel-blue-text)]'
                  : 'text-[var(--pixel-gray-400)]'
              }
            >
              {agent}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * All size variants side by side
 */
export const AllSizes: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <CompareCheckbox checked={false} onChange={() => {}} size="sm" />
        <span className="text-xs text-[var(--pixel-gray-400)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CompareCheckbox checked={false} onChange={() => {}} size="md" />
        <span className="text-xs text-[var(--pixel-gray-400)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CompareCheckbox checked={true} onChange={() => {}} size="sm" />
        <span className="text-xs text-[var(--pixel-gray-400)]">Small (checked)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CompareCheckbox checked={true} onChange={() => {}} size="md" />
        <span className="text-xs text-[var(--pixel-gray-400)]">Medium (checked)</span>
      </div>
    </div>
  ),
};
