import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type React from 'react';
import { DistributionBar } from './distribution-bar';

const meta = {
  title: 'Atoms/DistributionBar',
  component: DistributionBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a horizontal bar showing the distribution of reputation scores across low, medium, and high categories. Uses retro pixel styling with color-coded segments.',
      },
    },
  },
  argTypes: {
    low: {
      control: { type: 'number', min: 0 },
      description: 'Count of low scores (0-39)',
    },
    medium: {
      control: { type: 'number', min: 0 },
      description: 'Count of medium scores (40-69)',
    },
    high: {
      control: { type: 'number', min: 0 },
      description: 'Count of high scores (70-100)',
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show segment labels below the bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof DistributionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    low: 10,
    medium: 25,
    high: 65,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const WithoutLabels: Story = {
  args: {
    low: 10,
    medium: 25,
    high: 65,
    showLabels: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

// Shared decorator for consistent width
const withContainer = (Story: React.ComponentType) => (
  <div className="w-64">
    <Story />
  </div>
);

export const EqualDistribution: Story = {
  args: {
    low: 33,
    medium: 33,
    high: 34,
  },
  decorators: [withContainer],
};

export const HighlyRated: Story = {
  args: {
    low: 5,
    medium: 10,
    high: 85,
  },
  decorators: [withContainer],
};

export const PoorlyRated: Story = {
  args: {
    low: 70,
    medium: 20,
    high: 10,
  },
  decorators: [withContainer],
};

export const OnlyHigh: Story = {
  args: {
    low: 0,
    medium: 0,
    high: 100,
  },
  decorators: [withContainer],
};

export const OnlyLow: Story = {
  args: {
    low: 100,
    medium: 0,
    high: 0,
  },
  decorators: [withContainer],
};

export const Empty: Story = {
  args: {
    low: 0,
    medium: 0,
    high: 0,
  },
  decorators: [withContainer],
};

export const Small: Story = {
  args: {
    low: 10,
    medium: 25,
    high: 65,
    size: 'sm',
  },
  decorators: [withContainer],
};

export const Large: Story = {
  args: {
    low: 10,
    medium: 25,
    high: 65,
    size: 'lg',
  },
  decorators: [withContainer],
};

export const AllSizes: Story = {
  args: {
    low: 20,
    medium: 30,
    high: 50,
  },
  render: () => (
    <div className="space-y-6 w-64">
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Small</p>
        <DistributionBar low={20} medium={30} high={50} size="sm" showLabels />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Medium (default)</p>
        <DistributionBar low={20} medium={30} high={50} size="md" showLabels />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Large</p>
        <DistributionBar low={20} medium={30} high={50} size="lg" showLabels />
      </div>
    </div>
  ),
};

export const VariousDistributions: Story = {
  args: {
    low: 10,
    medium: 20,
    high: 70,
  },
  render: () => (
    <div className="space-y-4 w-64">
      <DistributionBar low={10} medium={20} high={70} showLabels />
      <DistributionBar low={50} medium={30} high={20} showLabels />
      <DistributionBar low={25} medium={50} high={25} showLabels />
      <DistributionBar low={0} medium={40} high={60} showLabels />
    </div>
  ),
};
