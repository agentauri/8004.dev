import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { WorkflowStep as WorkflowStepType } from '@/types';
import { WorkflowStep } from './workflow-step';

const createMockStep = (overrides: Partial<WorkflowStepType> = {}): WorkflowStepType => ({
  order: 1,
  name: 'Analyze Code',
  description: 'Analyze source code for issues, patterns, and potential improvements.',
  requiredRole: 'code-analyzer',
  inputs: ['source_code', 'config_file'],
  outputs: ['analysis_report'],
  ...overrides,
});

const meta = {
  title: 'Molecules/WorkflowStep',
  component: WorkflowStep,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a single step in a workflow visualization. Shows step number, name, description, required role, inputs, outputs, and optional matched agent.',
      },
    },
  },
  argTypes: {
    step: {
      description: 'Workflow step data object',
    },
    stepNumber: {
      control: 'number',
      description: 'Step number for display (1-based)',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether this step is currently active/highlighted',
    },
    matchedAgentId: {
      control: 'text',
      description: 'Optional matched agent ID for this step',
    },
    showConnector: {
      control: 'boolean',
      description: 'Whether to show the connecting line to the next step',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof WorkflowStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    step: createMockStep(),
    stepNumber: 1,
  },
};

export const Active: Story = {
  args: {
    step: createMockStep(),
    stepNumber: 1,
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Active step with green highlight.',
      },
    },
  },
};

export const WithMatchedAgent: Story = {
  args: {
    step: createMockStep(),
    stepNumber: 1,
    isActive: true,
    matchedAgentId: '11155111:123',
  },
  parameters: {
    docs: {
      description: {
        story: 'Step with a matched agent for the required role.',
      },
    },
  },
};

export const WithoutConnector: Story = {
  args: {
    step: createMockStep(),
    stepNumber: 3,
    showConnector: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Last step in a workflow without connector line.',
      },
    },
  },
};

export const MultipleInputsOutputs: Story = {
  args: {
    step: createMockStep({
      inputs: ['source_code', 'config_file', 'dependencies', 'env_vars'],
      outputs: ['analysis_report', 'metrics', 'recommendations'],
    }),
    stepNumber: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Step with multiple inputs and outputs.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    step: createMockStep({
      description:
        'This step performs comprehensive code analysis including static analysis, pattern detection, code smell identification, cyclomatic complexity calculation, and generates detailed reports with actionable recommendations for improvement.',
    }),
    stepNumber: 1,
  },
};

export const DifferentRoles: Story = {
  args: {
    step: createMockStep({
      order: 2,
      name: 'Security Audit',
      description: 'Scan for security vulnerabilities and compliance issues.',
      requiredRole: 'security-auditor',
      inputs: ['analysis_report'],
      outputs: ['security_report', 'vulnerability_list'],
    }),
    stepNumber: 2,
  },
};

export const WorkflowTimeline: Story = {
  args: {
    step: createMockStep(),
    stepNumber: 1,
  },
  render: () => (
    <div className="max-w-2xl">
      <WorkflowStep
        step={createMockStep({
          order: 1,
          name: 'Analyze Code',
          description: 'Analyze source code for issues.',
          requiredRole: 'code-analyzer',
          inputs: ['source_code'],
          outputs: ['analysis_report'],
        })}
        stepNumber={1}
        isActive={true}
        matchedAgentId="11155111:1"
      />
      <WorkflowStep
        step={createMockStep({
          order: 2,
          name: 'Security Review',
          description: 'Check for security vulnerabilities.',
          requiredRole: 'security-reviewer',
          inputs: ['analysis_report'],
          outputs: ['security_report'],
        })}
        stepNumber={2}
        matchedAgentId="11155111:2"
      />
      <WorkflowStep
        step={createMockStep({
          order: 3,
          name: 'Generate Report',
          description: 'Compile final review report.',
          requiredRole: 'report-generator',
          inputs: ['analysis_report', 'security_report'],
          outputs: ['final_report'],
        })}
        stepNumber={3}
        showConnector={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple steps forming a complete workflow timeline.',
      },
    },
  },
};
