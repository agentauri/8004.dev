import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EvaluationScores } from './evaluation-scores';

const meta = {
  title: 'Molecules/EvaluationScores',
  component: EvaluationScores,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays all four benchmark category scores (Safety, Capability, Reliability, Performance) using ScoreGauge components. Supports grid and horizontal layouts.',
      },
    },
  },
  argTypes: {
    scores: {
      description: 'Score values for each category (0-100)',
    },
    layout: {
      control: 'select',
      options: ['grid', 'horizontal'],
      description: 'Layout direction',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant for gauges',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof EvaluationScores>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scores: {
      safety: 95,
      capability: 78,
      reliability: 82,
      performance: 65,
    },
  },
};

export const GridLayout: Story = {
  args: {
    scores: {
      safety: 92,
      capability: 85,
      reliability: 88,
      performance: 72,
    },
    layout: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default grid layout with 2 columns.',
      },
    },
  },
};

export const HorizontalLayout: Story = {
  args: {
    scores: {
      safety: 88,
      capability: 76,
      reliability: 90,
      performance: 68,
    },
    layout: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout for compact displays or within cards.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    scores: {
      safety: 85,
      capability: 70,
      reliability: 92,
      performance: 58,
    },
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Smaller gauge size for compact layouts.',
      },
    },
  },
};

export const AllHighScores: Story = {
  args: {
    scores: {
      safety: 98,
      capability: 95,
      reliability: 92,
      performance: 88,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'All scores in the high range (80-100) with green indicators.',
      },
    },
  },
};

export const AllLowScores: Story = {
  args: {
    scores: {
      safety: 25,
      capability: 30,
      reliability: 40,
      performance: 15,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'All scores in the low range (0-49) with red indicators.',
      },
    },
  },
};

export const MixedScores: Story = {
  args: {
    scores: {
      safety: 95,
      capability: 65,
      reliability: 35,
      performance: 80,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Mixed scores showing all three color levels.',
      },
    },
  },
};

export const InCard: Story = {
  args: {
    scores: {
      safety: 88,
      capability: 72,
      reliability: 85,
      performance: 60,
    },
    layout: 'grid',
    size: 'sm',
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] max-w-sm">
        <h3 className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-200)] mb-3">
          BENCHMARK RESULTS
        </h3>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Example usage within a card component.',
      },
    },
  },
};
