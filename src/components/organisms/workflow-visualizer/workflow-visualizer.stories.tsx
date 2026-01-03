import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { WorkflowStep } from '@/types';
import { WorkflowVisualizer } from './workflow-visualizer';

const createMockSteps = (): WorkflowStep[] => [
  {
    order: 1,
    name: 'Analyze Code',
    description:
      'Analyze source code for issues, patterns, and potential improvements using static analysis.',
    requiredRole: 'code-analyzer',
    inputs: ['source_code', 'config_file'],
    outputs: ['analysis_report'],
  },
  {
    order: 2,
    name: 'Security Review',
    description: 'Check for security vulnerabilities and compliance issues.',
    requiredRole: 'security-reviewer',
    inputs: ['analysis_report'],
    outputs: ['security_report', 'vulnerability_list'],
  },
  {
    order: 3,
    name: 'Performance Audit',
    description: 'Analyze performance characteristics and identify optimization opportunities.',
    requiredRole: 'performance-auditor',
    inputs: ['analysis_report'],
    outputs: ['performance_report'],
  },
  {
    order: 4,
    name: 'Generate Report',
    description: 'Compile all findings into a comprehensive review report.',
    requiredRole: 'report-generator',
    inputs: ['analysis_report', 'security_report', 'performance_report'],
    outputs: ['final_report'],
  },
];

const meta = {
  title: 'Organisms/WorkflowVisualizer',
  component: WorkflowVisualizer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a vertical timeline of workflow steps with connecting lines, data flow visualization, and matched agent display.',
      },
    },
  },
  argTypes: {
    steps: {
      description: 'Ordered workflow steps to display',
    },
    matchedAgents: {
      description: 'Map of role to matched agent ID',
    },
    activeStep: {
      control: 'number',
      description: 'Currently active/highlighted step (1-based order)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof WorkflowVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: createMockSteps(),
  },
};

export const WithActiveStep: Story = {
  args: {
    steps: createMockSteps(),
    activeStep: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow with the second step highlighted as active.',
      },
    },
  },
};

export const WithMatchedAgents: Story = {
  args: {
    steps: createMockSteps(),
    matchedAgents: {
      'code-analyzer': '11155111:1',
      'security-reviewer': '11155111:2',
      'performance-auditor': '11155111:3',
      'report-generator': '11155111:4',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow with all roles matched to agents.',
      },
    },
  },
};

export const PartiallyMatched: Story = {
  args: {
    steps: createMockSteps(),
    matchedAgents: {
      'code-analyzer': '11155111:1',
      'security-reviewer': '11155111:2',
    },
    activeStep: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow with some roles matched and first step active.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    steps: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no steps are defined.',
      },
    },
  },
};

export const SingleStep: Story = {
  args: {
    steps: [createMockSteps()[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow with a single step.',
      },
    },
  },
};

export const ManySteps: Story = {
  args: {
    steps: [
      ...createMockSteps(),
      {
        order: 5,
        name: 'Notify Stakeholders',
        description: 'Send notifications to relevant stakeholders.',
        requiredRole: 'notifier',
        inputs: ['final_report'],
        outputs: ['notification_status'],
      },
      {
        order: 6,
        name: 'Archive Results',
        description: 'Archive all reports and artifacts for future reference.',
        requiredRole: 'archiver',
        inputs: ['final_report', 'notification_status'],
        outputs: ['archive_reference'],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Longer workflow with multiple steps.',
      },
    },
  },
};

export const ComplexDataFlow: Story = {
  args: {
    steps: [
      {
        order: 1,
        name: 'Data Collection',
        description: 'Collect data from multiple sources.',
        requiredRole: 'data-collector',
        inputs: ['api_endpoints', 'database_config', 'file_paths'],
        outputs: ['raw_data', 'metadata', 'timestamps'],
      },
      {
        order: 2,
        name: 'Data Transformation',
        description: 'Transform and normalize collected data.',
        requiredRole: 'data-transformer',
        inputs: ['raw_data', 'metadata'],
        outputs: ['transformed_data', 'schema'],
      },
      {
        order: 3,
        name: 'Data Validation',
        description: 'Validate data quality and integrity.',
        requiredRole: 'data-validator',
        inputs: ['transformed_data', 'schema'],
        outputs: ['validated_data', 'validation_report', 'error_log'],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow with complex data inputs and outputs.',
      },
    },
  },
};
