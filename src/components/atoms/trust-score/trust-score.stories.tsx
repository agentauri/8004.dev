import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TrustScore } from './trust-score';

const meta = {
  title: 'Atoms/TrustScore',
  component: TrustScore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a reputation score with color-coded trust level (Low, Medium, High). Uses retro pixel styling with glow effects based on trust level.',
      },
    },
  },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Score value from 0 to 100',
    },
    showScore: {
      control: 'boolean',
      description: 'Whether to show the numeric score',
    },
    count: {
      control: { type: 'number', min: 0 },
      description: 'Number of reputation feedbacks (displayed in parentheses)',
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
} satisfies Meta<typeof TrustScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {
  args: {
    score: 85,
  },
};

export const Medium: Story = {
  args: {
    score: 55,
  },
};

export const Low: Story = {
  args: {
    score: 25,
  },
};

export const WithoutScore: Story = {
  args: {
    score: 75,
    showScore: false,
  },
};

export const Small: Story = {
  args: {
    score: 80,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    score: 80,
    size: 'lg',
  },
};

export const AllLevels: Story = {
  args: {
    score: 90,
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TrustScore score={90} />
      <TrustScore score={55} />
      <TrustScore score={20} />
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    score: 75,
  },
  render: () => (
    <div className="flex items-center gap-4">
      <TrustScore score={75} size="sm" />
      <TrustScore score={75} size="md" />
      <TrustScore score={75} size="lg" />
    </div>
  ),
};

export const ScoreRange: Story = {
  args: {
    score: 50,
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((score) => (
        <TrustScore key={score} score={score} />
      ))}
    </div>
  ),
};

export const WithCount: Story = {
  args: {
    score: 85,
    count: 23,
  },
  parameters: {
    docs: {
      description: {
        story: 'Trust score with reputation feedback count displayed in parentheses.',
      },
    },
  },
};

export const WithCountAllLevels: Story = {
  args: {
    score: 90,
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TrustScore score={90} count={42} />
      <TrustScore score={55} count={15} />
      <TrustScore score={20} count={3} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All trust levels with feedback counts.',
      },
    },
  },
};
