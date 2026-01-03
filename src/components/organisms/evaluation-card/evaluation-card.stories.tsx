import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { Evaluation } from '@/types';
import { EvaluationCard } from './evaluation-card';

const createMockEvaluation = (overrides: Partial<Evaluation> = {}): Evaluation => ({
  id: 'eval-abc123def456',
  agentId: '11155111:456',
  status: 'completed',
  scores: {
    safety: 95,
    capability: 78,
    reliability: 82,
    performance: 65,
  },
  benchmarks: [],
  createdAt: new Date('2024-01-15T10:30:00'),
  completedAt: new Date('2024-01-15T10:35:00'),
  ...overrides,
});

const meta = {
  title: 'Organisms/EvaluationCard',
  component: EvaluationCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a summary of an agent evaluation including status badge, overall score, category scores, and timestamps. Supports click interaction and optional agent link.',
      },
    },
  },
  argTypes: {
    evaluation: {
      description: 'Evaluation data object',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
    showAgent: {
      control: 'boolean',
      description: 'Whether to show the agent link',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof EvaluationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    evaluation: createMockEvaluation(),
  },
};

export const Completed: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'completed',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed evaluation showing all scores.',
      },
    },
  },
};

export const Pending: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'pending',
      completedAt: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A pending evaluation waiting to be processed.',
      },
    },
  },
};

export const Running: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'running',
      completedAt: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'An evaluation currently in progress.',
      },
    },
  },
};

export const Failed: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'failed',
      completedAt: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A failed evaluation.',
      },
    },
  },
};

export const WithAgentLink: Story = {
  args: {
    evaluation: createMockEvaluation(),
    showAgent: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a link to the agent being evaluated.',
      },
    },
  },
};

export const HighOverallScore: Story = {
  args: {
    evaluation: createMockEvaluation({
      scores: {
        safety: 95,
        capability: 88,
        reliability: 92,
        performance: 85,
      },
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'High overall score (90) with green indicator.',
      },
    },
  },
};

export const MediumOverallScore: Story = {
  args: {
    evaluation: createMockEvaluation({
      scores: {
        safety: 70,
        capability: 60,
        reliability: 55,
        performance: 50,
      },
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium overall score (59) with yellow indicator.',
      },
    },
  },
};

export const LowOverallScore: Story = {
  args: {
    evaluation: createMockEvaluation({
      scores: {
        safety: 30,
        capability: 40,
        reliability: 35,
        performance: 25,
      },
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Low overall score (33) with red indicator.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    evaluation: createMockEvaluation(),
    onClick: () => console.log('Card clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with click handler for navigation or modal opening.',
      },
    },
  },
};

export const EvaluationList: Story = {
  args: {
    evaluation: createMockEvaluation(),
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <EvaluationCard
        evaluation={createMockEvaluation({
          id: 'eval-001',
          status: 'completed',
          scores: { safety: 95, capability: 88, reliability: 92, performance: 85 },
        })}
      />
      <EvaluationCard
        evaluation={createMockEvaluation({
          id: 'eval-002',
          status: 'running',
          completedAt: undefined,
        })}
      />
      <EvaluationCard
        evaluation={createMockEvaluation({
          id: 'eval-003',
          status: 'completed',
          scores: { safety: 60, capability: 55, reliability: 70, performance: 45 },
        })}
      />
      <EvaluationCard
        evaluation={createMockEvaluation({
          id: 'eval-004',
          status: 'failed',
          completedAt: undefined,
        })}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple evaluation cards in a grid layout.',
      },
    },
  },
};
