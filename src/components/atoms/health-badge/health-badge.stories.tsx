import type { Meta, StoryObj } from '@storybook/react';
import { HealthBadge } from './health-badge';

const meta = {
  title: 'Atoms/HealthBadge',
  component: HealthBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays an agent health score with color-coded level indicator (POOR/FAIR/GOOD).',
      },
    },
  },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Health score from 0 to 100',
    },
    showScore: {
      control: 'boolean',
      description: 'Whether to show the numeric score',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the activity icon',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof HealthBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    score: 75,
  },
};

export const Poor: Story = {
  args: {
    score: 30,
  },
  parameters: {
    docs: {
      description: {
        story: 'Health score below 50 displays as POOR with red styling.',
      },
    },
  },
};

export const Fair: Story = {
  args: {
    score: 65,
  },
  parameters: {
    docs: {
      description: {
        story: 'Health score between 50-79 displays as FAIR with gold styling.',
      },
    },
  },
};

export const Good: Story = {
  args: {
    score: 90,
  },
  parameters: {
    docs: {
      description: {
        story: 'Health score 80 or above displays as GOOD with green styling.',
      },
    },
  },
};

export const WithoutScore: Story = {
  args: {
    score: 85,
    showScore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge showing only the level label without the numeric score.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    score: 75,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge without the activity icon.',
      },
    },
  },
};

export const MinimalBadge: Story = {
  args: {
    score: 60,
    showScore: false,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal badge showing only the level label.',
      },
    },
  },
};

export const BoundaryValues: Story = {
  args: {
    score: 50,
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <HealthBadge score={0} />
      <HealthBadge score={49} />
      <HealthBadge score={50} />
      <HealthBadge score={79} />
      <HealthBadge score={80} />
      <HealthBadge score={100} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows behavior at boundary values: 0, 49, 50, 79, 80, 100.',
      },
    },
  },
};

export const AllLevels: Story = {
  args: {
    score: 50,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-400">Poor:</span>
        <HealthBadge score={25} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-400">Fair:</span>
        <HealthBadge score={65} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-gray-400">Good:</span>
        <HealthBadge score={95} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all three health levels side by side for comparison.',
      },
    },
  },
};
