import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TrendIndicator } from './trend-indicator';

const meta = {
  title: 'Atoms/TrendIndicator',
  component: TrendIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays reputation trend direction with optional percentage change. Uses retro pixel colors: green for up, red for down, gray for stable.',
      },
    },
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'down', 'stable'],
      description: 'Trend direction',
    },
    change: {
      control: 'number',
      description: 'Percentage change (e.g., 5 for +5%, -3 for -3%)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Icon size',
    },
  },
} satisfies Meta<typeof TrendIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrendingUp: Story = {
  args: {
    direction: 'up',
    size: 'md',
  },
};

export const TrendingDown: Story = {
  args: {
    direction: 'down',
    size: 'md',
  },
};

export const Stable: Story = {
  args: {
    direction: 'stable',
    size: 'md',
  },
};

export const WithChange: Story = {
  args: {
    direction: 'up',
    change: 12,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    direction: 'up',
    change: 5,
    size: 'sm',
  },
};

export const AllDirections: Story = {
  args: {
    direction: 'up',
    size: 'md',
  },
  render: () => (
    <div className="flex flex-col gap-4 p-4 bg-black">
      <div className="flex items-center gap-4">
        <span className="text-white font-mono text-sm w-24">Up:</span>
        <TrendIndicator direction="up" />
        <TrendIndicator direction="up" change={12} />
        <TrendIndicator direction="up" change={5} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-mono text-sm w-24">Down:</span>
        <TrendIndicator direction="down" />
        <TrendIndicator direction="down" change={-8} />
        <TrendIndicator direction="down" change={-3} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-mono text-sm w-24">Stable:</span>
        <TrendIndicator direction="stable" />
        <TrendIndicator direction="stable" change={0} />
        <TrendIndicator direction="stable" size="sm" />
      </div>
    </div>
  ),
};
