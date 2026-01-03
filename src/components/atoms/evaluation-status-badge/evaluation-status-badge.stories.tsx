import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EvaluationStatusBadge } from './evaluation-status-badge';

const meta = {
  title: 'Atoms/EvaluationStatusBadge',
  component: EvaluationStatusBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the current status of an agent evaluation with color-coded badges and glow effects. Running status includes a pulse animation.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'running', 'completed', 'failed'],
      description: 'Evaluation status to display',
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
} satisfies Meta<typeof EvaluationStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Running: Story = {
  args: {
    status: 'running',
  },
  parameters: {
    docs: {
      description: {
        story: 'Running status includes a pulse animation to indicate ongoing evaluation.',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
  },
};

export const Failed: Story = {
  args: {
    status: 'failed',
  },
};

export const Small: Story = {
  args: {
    status: 'completed',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    status: 'completed',
    size: 'lg',
  },
};

export const AllStatuses: Story = {
  args: {
    status: 'pending',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <EvaluationStatusBadge status="pending" />
      <EvaluationStatusBadge status="running" />
      <EvaluationStatusBadge status="completed" />
      <EvaluationStatusBadge status="failed" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All evaluation statuses displayed together.',
      },
    },
  },
};

export const AllSizes: Story = {
  args: {
    status: 'completed',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <EvaluationStatusBadge status="completed" size="sm" />
      <EvaluationStatusBadge status="completed" size="md" />
      <EvaluationStatusBadge status="completed" size="lg" />
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
