import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { Header } from './header';

const meta = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main navigation header with logo, navigation links, and multi-select chain selector.',
      },
    },
  },
  argTypes: {
    selectedChains: {
      control: 'object',
      description: 'Currently selected chains (empty array = all chains)',
    },
    chainSelectorDisabled: {
      control: 'boolean',
      description: 'Disable the chain selector',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedChains: [],
  },
};

export const WithSepolia: Story = {
  args: {
    selectedChains: [11155111],
  },
};

export const WithMultipleChains: Story = {
  args: {
    selectedChains: [11155111, 84532],
  },
};

export const WithAllChainsExplicit: Story = {
  args: {
    selectedChains: [11155111, 84532, 80002],
  },
};

export const Disabled: Story = {
  args: {
    selectedChains: [],
    chainSelectorDisabled: true,
  },
};

export const Interactive: Story = {
  args: {
    selectedChains: [],
  },
  render: function InteractiveStory() {
    const [chains, setChains] = useState<ChainId[]>([]);

    const getDisplayText = () => {
      if (chains.length === 0) return 'All Chains';
      return chains.join(', ');
    };

    return (
      <div className="space-y-4">
        <Header selectedChains={chains} onChainsChange={setChains} />
        <div className="p-4 text-[var(--pixel-gray-400)] text-sm">
          Selected chains: {getDisplayText()}
        </div>
      </div>
    );
  },
};

export const InPageContext: Story = {
  args: {
    selectedChains: [],
  },
  render: function InPageContextStory() {
    const [chains, setChains] = useState<ChainId[]>([]);
    return (
      <div className="min-h-screen bg-[var(--pixel-gray-dark)]">
        <Header selectedChains={chains} onChainsChange={setChains} />
        <main className="p-8">
          <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
            AGENT EXPLORER
          </h1>
          <p className="text-[var(--pixel-gray-400)]">Page content goes here...</p>
        </main>
      </div>
    );
  },
};
