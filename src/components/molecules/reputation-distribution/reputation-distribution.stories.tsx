import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReputationDistribution } from './reputation-distribution';

const meta = {
  title: 'Molecules/ReputationDistribution',
  component: ReputationDistribution,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays comprehensive reputation metrics including average score, total ratings, and distribution breakdown across low, medium, and high categories.',
      },
    },
  },
  argTypes: {
    averageScore: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Average reputation score',
    },
    count: {
      control: { type: 'number', min: 0 },
      description: 'Total number of ratings',
    },
    distribution: {
      control: 'object',
      description: 'Score distribution across categories',
    },
    showDetails: {
      control: 'boolean',
      description: 'Whether to show detailed breakdown',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ReputationDistribution>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    averageScore: 75,
    count: 42,
    distribution: {
      low: 5,
      medium: 10,
      high: 27,
    },
  },
};

export const HighlyRated: Story = {
  args: {
    averageScore: 92,
    count: 156,
    distribution: {
      low: 3,
      medium: 18,
      high: 135,
    },
  },
};

export const PoorlyRated: Story = {
  args: {
    averageScore: 28,
    count: 45,
    distribution: {
      low: 32,
      medium: 10,
      high: 3,
    },
  },
};

export const MixedRatings: Story = {
  args: {
    averageScore: 55,
    count: 100,
    distribution: {
      low: 30,
      medium: 40,
      high: 30,
    },
  },
};

export const NewAgent: Story = {
  args: {
    averageScore: 80,
    count: 5,
    distribution: {
      low: 0,
      medium: 1,
      high: 4,
    },
  },
};

export const WithoutDetails: Story = {
  args: {
    averageScore: 75,
    count: 42,
    distribution: {
      low: 5,
      medium: 10,
      high: 27,
    },
    showDetails: false,
  },
};

export const NoRatings: Story = {
  args: {
    averageScore: 0,
    count: 0,
    distribution: {
      low: 0,
      medium: 0,
      high: 0,
    },
  },
};

export const LargeNumbers: Story = {
  args: {
    averageScore: 88,
    count: 12847,
    distribution: {
      low: 642,
      medium: 2571,
      high: 9634,
    },
  },
};

export const ComparisonView: Story = {
  args: {
    averageScore: 75,
    count: 50,
    distribution: { low: 5, medium: 15, high: 30 },
  },
  render: () => (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">High Reputation Agent</p>
        <ReputationDistribution
          averageScore={92}
          count={156}
          distribution={{ low: 3, medium: 18, high: 135 }}
        />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Medium Reputation Agent</p>
        <ReputationDistribution
          averageScore={55}
          count={80}
          distribution={{ low: 20, medium: 35, high: 25 }}
        />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Low Reputation Agent</p>
        <ReputationDistribution
          averageScore={28}
          count={45}
          distribution={{ low: 32, medium: 10, high: 3 }}
        />
      </div>
    </div>
  ),
};
