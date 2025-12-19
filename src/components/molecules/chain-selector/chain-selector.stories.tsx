import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { ChainSelector } from './chain-selector';

const meta = {
  title: 'Molecules/ChainSelector',
  component: ChainSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A multi-select dropdown for choosing blockchain networks. Displays selected ChainBadges inline. Empty selection means "All Chains".',
      },
    },
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'Currently selected chains (empty array = all chains)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ChainSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: [],
  },
};

export const SingleChainSelected: Story = {
  args: {
    value: [11155111],
  },
};

export const TwoChainsSelected: Story = {
  args: {
    value: [11155111, 84532],
  },
};

export const AllChainsSelected: Story = {
  args: {
    value: [11155111, 84532, 80002],
  },
};

export const Disabled: Story = {
  args: {
    value: [],
    disabled: true,
  },
};

export const Controlled: Story = {
  args: {
    value: [],
  },
  render: function ControlledStory(args) {
    const [value, setValue] = useState<ChainId[]>([]);

    const getDisplayText = () => {
      if (value.length === 0) return 'All Chains';
      if (value.length === 1) return `1 chain selected`;
      return `${value.length} chains selected`;
    };

    return (
      <div className="space-y-4">
        <ChainSelector {...args} value={value} onChange={setValue} />
        <p className="text-[var(--pixel-gray-400)] text-sm font-[family-name:var(--font-pixel-body)]">
          {getDisplayText()}
        </p>
      </div>
    );
  },
};

export const InHeader: Story = {
  args: {
    value: [],
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div className="w-full flex items-center justify-between p-4 bg-[var(--pixel-gray-dark)] border-b-2 border-[var(--pixel-gray-700)]">
      <span className="font-[family-name:var(--font-pixel-title)] text-[var(--pixel-gray-100)]">
        AGENT EXPLORER
      </span>
      <ChainSelector {...args} />
    </div>
  ),
};

export const WithPreselection: Story = {
  args: {
    value: [84532, 80002],
  },
  render: function PreselectionStory(args) {
    const [value, setValue] = useState<ChainId[]>(args.value || []);

    return (
      <div className="space-y-4">
        <ChainSelector {...args} value={value} onChange={setValue} />
        <div className="text-[var(--pixel-gray-400)] text-xs font-[family-name:var(--font-pixel-body)]">
          <p>Selected chain IDs: {value.length === 0 ? 'All' : value.join(', ')}</p>
        </div>
      </div>
    );
  },
};
