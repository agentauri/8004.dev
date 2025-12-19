import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RelevanceScore } from './relevance-score';

const meta = {
  title: 'Atoms/RelevanceScore',
  component: RelevanceScore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a semantic search relevance score with sparkle icon. Used to show AI/semantic match quality with gold glow effect and retro pixel styling.',
      },
    },
  },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Score value from 0 to 100',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show "MATCH" label',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RelevanceScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    score: 95,
  },
};

export const HighScore: Story = {
  args: {
    score: 98,
  },
};

export const LowScore: Story = {
  args: {
    score: 52,
  },
};

export const WithLabel: Story = {
  args: {
    score: 87,
    showLabel: true,
  },
};

export const SmallSize: Story = {
  args: {
    score: 76,
    size: 'sm',
  },
};

export const AllVariants: Story = {
  args: {
    score: 85,
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <RelevanceScore score={98} />
      <RelevanceScore score={85} />
      <RelevanceScore score={72} />
      <RelevanceScore score={60} />
    </div>
  ),
};

export const WithAndWithoutLabel: Story = {
  args: {
    score: 90,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <RelevanceScore score={90} showLabel={false} />
      <RelevanceScore score={90} showLabel />
    </div>
  ),
};

export const SizeComparison: Story = {
  args: {
    score: 82,
  },
  render: () => (
    <div className="flex items-center gap-4">
      <RelevanceScore score={82} size="sm" />
      <RelevanceScore score={82} size="md" />
    </div>
  ),
};

export const ScoreRange: Story = {
  args: {
    score: 50,
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map((score) => (
        <RelevanceScore key={score} score={score} />
      ))}
    </div>
  ),
};
