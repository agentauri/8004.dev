import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ScoreGauge } from './score-gauge';

const meta = {
  title: 'Atoms/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A retro-style gauge displaying a score with colored fill bar. Color-coded by score level: green (80-100), yellow (50-79), red (0-49). Features CRT glow effects.',
      },
    },
  },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Score value from 0 to 100',
    },
    label: {
      control: 'text',
      description: 'Label for the gauge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the numeric value',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ScoreGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {
  args: {
    score: 92,
    label: 'Safety',
  },
  parameters: {
    docs: {
      description: {
        story: 'High score (80-100) displays with green color and glow.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    score: 65,
    label: 'Capability',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium score (50-79) displays with yellow/gold color and glow.',
      },
    },
  },
};

export const Low: Story = {
  args: {
    score: 30,
    label: 'Performance',
  },
  parameters: {
    docs: {
      description: {
        story: 'Low score (0-49) displays with red color and glow.',
      },
    },
  },
};

export const WithoutValue: Story = {
  args: {
    score: 75,
    label: 'Reliability',
    showValue: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Gauge without numeric value display.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    score: 85,
    label: 'Safety',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    score: 85,
    label: 'Safety',
    size: 'lg',
  },
};

export const AllLevels: Story = {
  args: {
    score: 90,
    label: 'Score',
  },
  render: () => (
    <div className="flex flex-col gap-4 w-48">
      <ScoreGauge score={92} label="Safety" />
      <ScoreGauge score={65} label="Capability" />
      <ScoreGauge score={30} label="Performance" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All score levels displayed together.',
      },
    },
  },
};

export const AllSizes: Story = {
  args: {
    score: 75,
    label: 'Score',
  },
  render: () => (
    <div className="flex flex-col gap-4 w-48">
      <ScoreGauge score={85} label="Small" size="sm" />
      <ScoreGauge score={85} label="Medium" size="md" />
      <ScoreGauge score={85} label="Large" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison: small, medium, and large.',
      },
    },
  },
};

export const ScoreRange: Story = {
  args: {
    score: 50,
    label: 'Score',
  },
  render: () => (
    <div className="flex flex-col gap-3 w-48">
      {[0, 25, 50, 75, 100].map((score) => (
        <ScoreGauge key={score} score={score} label={`Score ${score}`} />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various scores showing the color transitions.',
      },
    },
  },
};

export const BenchmarkCategories: Story = {
  args: {
    score: 80,
    label: 'Benchmark',
  },
  render: () => (
    <div className="flex flex-col gap-3 w-56">
      <ScoreGauge score={95} label="Safety" />
      <ScoreGauge score={78} label="Capability" />
      <ScoreGauge score={82} label="Reliability" />
      <ScoreGauge score={45} label="Performance" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of benchmark category scores for an evaluation.',
      },
    },
  },
};
