import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChainBadge } from './chain-badge';

const meta = {
  title: 'Atoms/ChainBadge',
  component: ChainBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a blockchain network identifier with chain-specific colors and retro glow effects. Supports Ethereum Sepolia, Base Sepolia, and Polygon Amoy.',
      },
    },
  },
  argTypes: {
    chainId: {
      control: 'select',
      options: [11155111, 84532, 80002],
      description: 'The chain ID to display',
    },
    showFullName: {
      control: 'boolean',
      description: 'Show full chain name instead of short name',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ChainBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sepolia: Story = {
  args: {
    chainId: 11155111,
  },
};

export const Base: Story = {
  args: {
    chainId: 84532,
  },
};

export const Polygon: Story = {
  args: {
    chainId: 80002,
  },
};

export const FullName: Story = {
  args: {
    chainId: 11155111,
    showFullName: true,
  },
};

export const AllChains: Story = {
  args: {
    chainId: 11155111,
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ChainBadge chainId={11155111} />
      <ChainBadge chainId={84532} />
      <ChainBadge chainId={80002} />
    </div>
  ),
};

export const AllChainsFullName: Story = {
  args: {
    chainId: 11155111,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <ChainBadge chainId={11155111} showFullName />
      <ChainBadge chainId={84532} showFullName />
      <ChainBadge chainId={80002} showFullName />
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    chainId: 11155111,
    className: 'text-lg',
  },
};
