import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { type PlatformStats, StatsGrid } from './stats-grid';

const mockStats: PlatformStats = {
  totalAgents: 4770,
  withMetadata: 2715,
  activeAgents: 946,
  chainBreakdown: [
    { chainId: 11155111, name: 'Sepolia', total: 3167, withMetadata: 1999, active: 334 },
    { chainId: 84532, name: 'Base', total: 1587, withMetadata: 706, active: 607 },
    { chainId: 80002, name: 'Polygon', total: 16, withMetadata: 10, active: 5 },
  ],
};

const meta = {
  title: 'Organisms/StatsGrid',
  component: StatsGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StatsGrid displays platform statistics in a responsive grid of cards, showing total agents and per-chain breakdowns.',
      },
    },
  },
  argTypes: {
    stats: {
      description: 'Platform statistics data',
      control: 'object',
    },
    isLoading: {
      description: 'Whether the stats are loading',
      control: 'boolean',
    },
    error: {
      description: 'Error message if stats failed to load',
      control: 'text',
    },
  },
} satisfies Meta<typeof StatsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stats: mockStats,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Failed to load statistics. Please try again.',
  },
};

export const NoData: Story = {
  args: {
    stats: undefined,
    isLoading: false,
  },
};

export const HighNumbers: Story = {
  args: {
    stats: {
      totalAgents: 2000000,
      withMetadata: 1234567,
      activeAgents: 987654,
      chainBreakdown: [
        { chainId: 11155111, name: 'Sepolia', total: 800000, withMetadata: 500000, active: 400000 },
        { chainId: 84532, name: 'Base', total: 800000, withMetadata: 500000, active: 400000 },
        { chainId: 80002, name: 'Polygon', total: 400000, withMetadata: 234567, active: 187654 },
      ],
    },
  },
};

export const SingleChain: Story = {
  args: {
    stats: {
      totalAgents: 200,
      withMetadata: 100,
      activeAgents: 75,
      chainBreakdown: [
        { chainId: 11155111, name: 'Sepolia', total: 200, withMetadata: 100, active: 75 },
      ],
    },
  },
};
