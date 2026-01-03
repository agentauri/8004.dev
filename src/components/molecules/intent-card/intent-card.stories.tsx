import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { IntentTemplate } from '@/types';
import { IntentCard } from './intent-card';

const createMockTemplate = (overrides: Partial<IntentTemplate> = {}): IntentTemplate => ({
  id: 'code-review-workflow',
  name: 'Code Review Workflow',
  description:
    'Automated code review pipeline with multiple AI agents analyzing code quality, security, and performance.',
  category: 'development',
  steps: [
    {
      order: 1,
      name: 'Analyze Code',
      description: 'Analyze code for issues',
      requiredRole: 'code-analyzer',
      inputs: ['source_code'],
      outputs: ['analysis_report'],
    },
    {
      order: 2,
      name: 'Review Security',
      description: 'Check for security vulnerabilities',
      requiredRole: 'security-reviewer',
      inputs: ['analysis_report'],
      outputs: ['security_report'],
    },
  ],
  requiredRoles: ['code-analyzer', 'security-reviewer'],
  ...overrides,
});

const meta = {
  title: 'Molecules/IntentCard',
  component: IntentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a summary card for an intent template. Shows the template name, description, category badge, number of steps, and required roles.',
      },
    },
  },
  argTypes: {
    template: {
      description: 'Intent template data object',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof IntentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    template: createMockTemplate(),
  },
};

export const DevelopmentCategory: Story = {
  args: {
    template: createMockTemplate({
      category: 'development',
      name: 'Code Review Workflow',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Development category with blue styling.',
      },
    },
  },
};

export const AutomationCategory: Story = {
  args: {
    template: createMockTemplate({
      id: 'data-pipeline',
      category: 'automation',
      name: 'Data Pipeline Automation',
      description: 'Automated data processing pipeline with ETL operations.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Automation category with green styling.',
      },
    },
  },
};

export const SecurityCategory: Story = {
  args: {
    template: createMockTemplate({
      id: 'security-audit',
      category: 'security',
      name: 'Security Audit Workflow',
      description: 'Comprehensive security audit with vulnerability scanning.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Security category with red styling.',
      },
    },
  },
};

export const AnalysisCategory: Story = {
  args: {
    template: createMockTemplate({
      id: 'data-analysis',
      category: 'data-analysis',
      name: 'Data Analysis Pipeline',
      description: 'AI-powered data analysis and insights generation.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Analysis category with gold styling.',
      },
    },
  },
};

export const ManySteps: Story = {
  args: {
    template: createMockTemplate({
      steps: Array.from({ length: 8 }, (_, i) => ({
        order: i + 1,
        name: `Step ${i + 1}`,
        description: `Step ${i + 1} description`,
        requiredRole: `role-${i + 1}`,
        inputs: ['input'],
        outputs: ['output'],
      })),
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Template with many workflow steps.',
      },
    },
  },
};

export const ManyRoles: Story = {
  args: {
    template: createMockTemplate({
      requiredRoles: [
        'code-analyzer',
        'security-reviewer',
        'performance-auditor',
        'documentation-writer',
        'test-generator',
        'deployment-manager',
      ],
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Template with many required roles (shows +N more).',
      },
    },
  },
};

export const ShortDescription: Story = {
  args: {
    template: createMockTemplate({
      description: 'Quick code review.',
    }),
  },
};

export const LongDescription: Story = {
  args: {
    template: createMockTemplate({
      description:
        'This is a very long description that explains in great detail what this workflow does, including all the steps involved, the expected outcomes, the required inputs, and the potential benefits of using this automated workflow template for your development process.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Long description gets truncated to 2 lines.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    template: createMockTemplate(),
    onClick: () => console.log('Card clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with click handler for navigation.',
      },
    },
  },
};

export const IntentGalleryGrid: Story = {
  args: {
    template: createMockTemplate(),
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
      <IntentCard
        template={createMockTemplate({
          id: 'code-review',
          name: 'Code Review Workflow',
          category: 'development',
        })}
      />
      <IntentCard
        template={createMockTemplate({
          id: 'data-pipeline',
          name: 'Data Pipeline Automation',
          category: 'automation',
          description: 'Automated data processing and ETL operations.',
        })}
      />
      <IntentCard
        template={createMockTemplate({
          id: 'security-audit',
          name: 'Security Audit',
          category: 'security',
          description: 'Comprehensive security vulnerability scanning.',
        })}
      />
      <IntentCard
        template={createMockTemplate({
          id: 'analytics',
          name: 'Analytics Pipeline',
          category: 'data-analysis',
          description: 'AI-powered data analysis and insights.',
        })}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple intent cards in a grid layout.',
      },
    },
  },
};
