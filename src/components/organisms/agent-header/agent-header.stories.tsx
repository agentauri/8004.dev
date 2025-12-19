import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentHeader } from './agent-header';

const meta = {
  title: 'Organisms/AgentHeader',
  component: AgentHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AgentHeader displays the main header section of an agent detail page with name, chain, status, trust score, and back navigation.',
      },
    },
  },
} satisfies Meta<typeof AgentHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '11155111:123',
    name: 'AI Trading Bot',
    chainId: 11155111,
    isActive: true,
    trustScore: 85,
  },
};

export const ActiveAgent: Story = {
  args: {
    id: '11155111:456',
    name: 'Code Assistant Pro',
    chainId: 11155111,
    isActive: true,
    trustScore: 92,
  },
};

export const InactiveAgent: Story = {
  args: {
    id: '84532:789',
    name: 'Legacy Data Processor',
    chainId: 84532,
    isActive: false,
    trustScore: 45,
  },
};

export const LowTrustScore: Story = {
  args: {
    id: '80002:101',
    name: 'New Agent',
    chainId: 80002,
    isActive: true,
    trustScore: 25,
  },
};

export const NoTrustScore: Story = {
  args: {
    id: '11155111:999',
    name: 'Unrated Agent',
    chainId: 11155111,
    isActive: true,
  },
};

export const LongName: Story = {
  args: {
    id: '11155111:123',
    name: 'Super Long Agent Name That Might Overflow The Container',
    chainId: 11155111,
    isActive: true,
    trustScore: 75,
  },
};
