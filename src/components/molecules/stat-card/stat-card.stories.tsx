import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StatCard } from './stat-card';

const meta = {
  title: 'Molecules/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StatCard displays a single statistic with a label, primary value, optional secondary value, and optional color accent.',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Label describing the statistic',
      control: 'text',
    },
    value: {
      description: 'Primary numeric value',
      control: 'number',
    },
    subValue: {
      description: 'Optional secondary value text',
      control: 'text',
    },
    color: {
      description: 'Optional accent color for border and glow',
      control: 'color',
    },
    isLoading: {
      description: 'Whether the card is in loading state',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total Agents',
    value: 2704,
  },
};

export const WithSubValue: Story = {
  args: {
    label: 'Active Agents',
    value: 1523,
    subValue: '/ 2704 total',
  },
};

export const WithColor: Story = {
  args: {
    label: 'Sepolia',
    value: 1989,
    color: '#fc5454',
  },
};

export const BaseChain: Story = {
  args: {
    label: 'Base',
    value: 705,
    color: '#3b71c9',
  },
};

export const PolygonChain: Story = {
  args: {
    label: 'Polygon',
    value: 10,
    color: '#9c54fc',
  },
};

export const WithColorAndSubValue: Story = {
  args: {
    label: 'Sepolia',
    value: 985,
    subValue: '/ 1989 total',
    color: '#fc5454',
  },
};

export const Loading: Story = {
  args: {
    label: 'Total Agents',
    value: 0,
    isLoading: true,
  },
};

export const LargeValue: Story = {
  args: {
    label: 'All Time Agents',
    value: 1234567,
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Total Agents',
    value: 2704,
    subValue: '/ 5000 total',
    size: 'large',
  },
};

export const ActiveAgentsGreen: Story = {
  args: {
    label: 'Active Agents',
    value: 1523,
    subValue: '2,704 total',
    size: 'large',
    color: '#00D800',
  },
};

export const ZeroValue: Story = {
  args: {
    label: 'Inactive',
    value: 0,
  },
};

export const AllChains: Story = {
  args: {
    label: 'Total Agents',
    value: 2704,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-lg">
      <StatCard label="Total Agents" value={2704} subValue="active: 1523" />
      <StatCard label="Sepolia" value={1989} color="#fc5454" subValue="active: 985" />
      <StatCard label="Base" value={705} color="#5c94fc" subValue="active: 528" />
      <StatCard label="Polygon" value={10} color="#9c54fc" subValue="active: 10" />
    </div>
  ),
};
