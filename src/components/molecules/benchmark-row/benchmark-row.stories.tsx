import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { BenchmarkRow } from './benchmark-row';

const meta = {
  title: 'Molecules/BenchmarkRow',
  component: BenchmarkRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a single benchmark result with name, category icon, score bar, and optional expandable details. Color-coded by score percentage.',
      },
    },
  },
  argTypes: {
    benchmark: {
      description: 'Benchmark result data',
    },
    showDetails: {
      control: 'boolean',
      description: 'Whether to show expandable details section',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof BenchmarkRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    benchmark: {
      name: 'Input Validation',
      category: 'safety',
      score: 85,
      maxScore: 100,
    },
  },
};

export const WithDetails: Story = {
  args: {
    benchmark: {
      name: 'Input Validation',
      category: 'safety',
      score: 85,
      maxScore: 100,
      details:
        'Passed all input validation tests including SQL injection, XSS, and command injection checks.',
    },
    showDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on the row to expand/collapse the details section.',
      },
    },
  },
};

export const SafetyBenchmark: Story = {
  args: {
    benchmark: {
      name: 'Prompt Injection Defense',
      category: 'safety',
      score: 92,
      maxScore: 100,
      details: 'Successfully defended against 92% of prompt injection attempts.',
    },
    showDetails: true,
  },
};

export const CapabilityBenchmark: Story = {
  args: {
    benchmark: {
      name: 'Task Completion Rate',
      category: 'capability',
      score: 78,
      maxScore: 100,
      details: 'Completed 78 out of 100 benchmark tasks successfully.',
    },
    showDetails: true,
  },
};

export const ReliabilityBenchmark: Story = {
  args: {
    benchmark: {
      name: 'Uptime Score',
      category: 'reliability',
      score: 99,
      maxScore: 100,
      details: '99.9% uptime over the past 30 days.',
    },
    showDetails: true,
  },
};

export const PerformanceBenchmark: Story = {
  args: {
    benchmark: {
      name: 'Response Latency',
      category: 'performance',
      score: 45,
      maxScore: 100,
      details: 'Average response time: 850ms. Target: 200ms.',
    },
    showDetails: true,
  },
};

export const HighScore: Story = {
  args: {
    benchmark: {
      name: 'High Score Example',
      category: 'safety',
      score: 95,
      maxScore: 100,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'High score (80-100%) displays with green color.',
      },
    },
  },
};

export const MediumScore: Story = {
  args: {
    benchmark: {
      name: 'Medium Score Example',
      category: 'capability',
      score: 65,
      maxScore: 100,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium score (50-79%) displays with yellow/gold color.',
      },
    },
  },
};

export const LowScore: Story = {
  args: {
    benchmark: {
      name: 'Low Score Example',
      category: 'performance',
      score: 30,
      maxScore: 100,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Low score (0-49%) displays with red color.',
      },
    },
  },
};

export const CustomMaxScore: Story = {
  args: {
    benchmark: {
      name: 'Test Cases Passed',
      category: 'reliability',
      score: 45,
      maxScore: 50,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Benchmark with non-100 max score.',
      },
    },
  },
};

export const BenchmarkList: Story = {
  args: {
    benchmark: {
      name: 'Example',
      category: 'safety',
      score: 85,
      maxScore: 100,
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 max-w-md">
      <BenchmarkRow
        benchmark={{
          name: 'Input Validation',
          category: 'safety',
          score: 92,
          maxScore: 100,
          details: 'All input validation checks passed.',
        }}
        showDetails
      />
      <BenchmarkRow
        benchmark={{
          name: 'Prompt Injection',
          category: 'safety',
          score: 88,
          maxScore: 100,
          details: 'Defended against 88% of injection attempts.',
        }}
        showDetails
      />
      <BenchmarkRow
        benchmark={{
          name: 'Task Accuracy',
          category: 'capability',
          score: 75,
          maxScore: 100,
          details: 'Achieved 75% accuracy on benchmark tasks.',
        }}
        showDetails
      />
      <BenchmarkRow
        benchmark={{
          name: 'Response Time',
          category: 'performance',
          score: 40,
          maxScore: 100,
          details: 'Average response time exceeded target.',
        }}
        showDetails
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple benchmark rows displayed as a list.',
      },
    },
  },
};
