import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { Evaluation } from '@/types';
import { EvaluationDetail } from './evaluation-detail';

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
  benchmarks: [
    {
      name: 'Input Validation',
      category: 'safety',
      score: 92,
      maxScore: 100,
      details: 'Passed all input validation tests including SQL injection, XSS, and SSRF checks.',
    },
    {
      name: 'Prompt Injection Defense',
      category: 'safety',
      score: 88,
      maxScore: 100,
      details: 'Successfully defended against 88% of prompt injection attempts.',
    },
    {
      name: 'Output Sanitization',
      category: 'safety',
      score: 95,
      maxScore: 100,
      details: 'Properly sanitized outputs in 95% of test cases.',
    },
    {
      name: 'Task Completion Rate',
      category: 'capability',
      score: 78,
      maxScore: 100,
      details: 'Completed 78 out of 100 benchmark tasks successfully.',
    },
    {
      name: 'Multi-step Reasoning',
      category: 'capability',
      score: 72,
      maxScore: 100,
      details: 'Demonstrated multi-step reasoning in 72% of complex tasks.',
    },
    {
      name: 'Uptime Score',
      category: 'reliability',
      score: 99,
      maxScore: 100,
      details: '99.9% uptime over the past 30 days.',
    },
    {
      name: 'Error Recovery',
      category: 'reliability',
      score: 85,
      maxScore: 100,
      details: 'Successfully recovered from 85% of induced errors.',
    },
    {
      name: 'Response Latency',
      category: 'performance',
      score: 65,
      maxScore: 100,
      details: 'Average response time: 850ms. Target: 200ms.',
    },
    {
      name: 'Throughput',
      category: 'performance',
      score: 70,
      maxScore: 100,
      details: 'Handled 70% of expected concurrent requests.',
    },
  ],
  createdAt: new Date('2024-01-15T10:30:00'),
  completedAt: new Date('2024-01-15T10:35:00'),
  ...overrides,
});

const meta = {
  title: 'Organisms/EvaluationDetail',
  component: EvaluationDetail,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full evaluation view displaying overall score, category breakdowns, timeline, and detailed benchmark results. Supports expandable benchmark rows and optional close button.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    evaluation: {
      description: 'Evaluation data object',
    },
    onClose: {
      action: 'closed',
      description: 'Optional close handler',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 max-w-4xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EvaluationDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    evaluation: createMockEvaluation(),
  },
};

export const WithCloseButton: Story = {
  args: {
    evaluation: createMockEvaluation(),
    onClose: () => console.log('Close clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Includes a close button in the header.',
      },
    },
  },
};

export const Pending: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'pending',
      completedAt: undefined,
      benchmarks: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Pending evaluation waiting to start.',
      },
    },
  },
};

export const Running: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'running',
      completedAt: undefined,
      benchmarks: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Evaluation currently in progress.',
      },
    },
  },
};

export const Failed: Story = {
  args: {
    evaluation: createMockEvaluation({
      status: 'failed',
      completedAt: new Date('2024-01-15T10:32:00'),
      benchmarks: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Failed evaluation with error state.',
      },
    },
  },
};

export const HighOverallScore: Story = {
  args: {
    evaluation: createMockEvaluation({
      scores: {
        safety: 98,
        capability: 92,
        reliability: 95,
        performance: 88,
      },
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'High overall score (93) with green indicator.',
      },
    },
  },
};

export const LowOverallScore: Story = {
  args: {
    evaluation: createMockEvaluation({
      scores: {
        safety: 35,
        capability: 40,
        reliability: 30,
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

export const NoBenchmarks: Story = {
  args: {
    evaluation: createMockEvaluation({
      benchmarks: [],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed evaluation without detailed benchmark results.',
      },
    },
  },
};

export const MinimalBenchmarks: Story = {
  args: {
    evaluation: createMockEvaluation({
      benchmarks: [
        {
          name: 'Overall Safety Check',
          category: 'safety',
          score: 95,
          maxScore: 100,
          details: 'Passed all safety checks.',
        },
        {
          name: 'Performance Benchmark',
          category: 'performance',
          score: 65,
          maxScore: 100,
          details: 'Performance within acceptable range.',
        },
      ],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Evaluation with only some benchmark categories.',
      },
    },
  },
};
