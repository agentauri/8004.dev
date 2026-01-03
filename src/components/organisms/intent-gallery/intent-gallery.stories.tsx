import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { IntentTemplate } from '@/types';
import { IntentGallery } from './intent-gallery';

const createMockTemplates = (): IntentTemplate[] => [
  {
    id: 'code-review',
    name: 'Code Review Workflow',
    description:
      'Automated code review pipeline with multiple AI agents analyzing code quality, security, and performance.',
    category: 'development',
    steps: [
      {
        order: 1,
        name: 'Analyze Code',
        description: 'Analyze code',
        requiredRole: 'analyzer',
        inputs: ['code'],
        outputs: ['report'],
      },
      {
        order: 2,
        name: 'Security Check',
        description: 'Check security',
        requiredRole: 'security',
        inputs: ['report'],
        outputs: ['security_report'],
      },
    ],
    requiredRoles: ['code-analyzer', 'security-reviewer'],
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline Automation',
    description: 'Automated ETL data processing with transformation and validation agents.',
    category: 'automation',
    steps: [
      {
        order: 1,
        name: 'Extract',
        description: 'Extract data',
        requiredRole: 'extractor',
        inputs: ['source'],
        outputs: ['raw_data'],
      },
      {
        order: 2,
        name: 'Transform',
        description: 'Transform data',
        requiredRole: 'transformer',
        inputs: ['raw_data'],
        outputs: ['transformed_data'],
      },
    ],
    requiredRoles: ['data-extractor', 'data-transformer'],
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Comprehensive security vulnerability scanning and compliance checking.',
    category: 'security',
    steps: [
      {
        order: 1,
        name: 'Scan',
        description: 'Scan for vulnerabilities',
        requiredRole: 'scanner',
        inputs: ['target'],
        outputs: ['findings'],
      },
    ],
    requiredRoles: ['security-scanner', 'compliance-checker'],
  },
  {
    id: 'analytics-pipeline',
    name: 'Analytics Pipeline',
    description: 'AI-powered data analysis and insights generation for business intelligence.',
    category: 'data-analysis',
    steps: [
      {
        order: 1,
        name: 'Collect',
        description: 'Collect metrics',
        requiredRole: 'collector',
        inputs: ['sources'],
        outputs: ['metrics'],
      },
      {
        order: 2,
        name: 'Analyze',
        description: 'Analyze data',
        requiredRole: 'analyst',
        inputs: ['metrics'],
        outputs: ['insights'],
      },
    ],
    requiredRoles: ['data-collector', 'data-analyst'],
  },
  {
    id: 'deployment-automation',
    name: 'Deployment Automation',
    description:
      'Automated deployment pipeline with testing, validation, and rollback capabilities.',
    category: 'automation',
    steps: [
      {
        order: 1,
        name: 'Build',
        description: 'Build artifacts',
        requiredRole: 'builder',
        inputs: ['source'],
        outputs: ['artifacts'],
      },
      {
        order: 2,
        name: 'Test',
        description: 'Run tests',
        requiredRole: 'tester',
        inputs: ['artifacts'],
        outputs: ['test_results'],
      },
      {
        order: 3,
        name: 'Deploy',
        description: 'Deploy to environment',
        requiredRole: 'deployer',
        inputs: ['artifacts', 'test_results'],
        outputs: ['deployment_status'],
      },
    ],
    requiredRoles: ['builder', 'tester', 'deployer'],
  },
  {
    id: 'content-generation',
    name: 'Content Generation',
    description: 'AI-powered content creation with research, writing, and editing agents.',
    category: 'development',
    steps: [
      {
        order: 1,
        name: 'Research',
        description: 'Research topic',
        requiredRole: 'researcher',
        inputs: ['topic'],
        outputs: ['research'],
      },
      {
        order: 2,
        name: 'Write',
        description: 'Write content',
        requiredRole: 'writer',
        inputs: ['research'],
        outputs: ['draft'],
      },
      {
        order: 3,
        name: 'Edit',
        description: 'Edit content',
        requiredRole: 'editor',
        inputs: ['draft'],
        outputs: ['final_content'],
      },
    ],
    requiredRoles: ['researcher', 'writer', 'editor'],
  },
];

const meta = {
  title: 'Organisms/IntentGallery',
  component: IntentGallery,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a grid of intent template cards with category filtering and search functionality. Supports loading and empty states.',
      },
    },
  },
  argTypes: {
    templates: {
      description: 'List of intent templates to display',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when a template is selected',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the gallery is in loading state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof IntentGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    templates: createMockTemplates(),
  },
};

export const Loading: Story = {
  args: {
    templates: [],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while fetching templates.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    templates: [],
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no templates are available.',
      },
    },
  },
};

export const SingleCategory: Story = {
  args: {
    templates: createMockTemplates().filter((t) => t.category === 'development'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with templates from a single category.',
      },
    },
  },
};

export const WithSelection: Story = {
  args: {
    templates: createMockTemplates(),
    onSelect: (template) => console.log('Selected:', template.id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with selectable templates.',
      },
    },
  },
};

export const FewTemplates: Story = {
  args: {
    templates: createMockTemplates().slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with only a few templates.',
      },
    },
  },
};

export const ManyTemplates: Story = {
  args: {
    templates: [
      ...createMockTemplates(),
      ...createMockTemplates().map((t) => ({ ...t, id: `${t.id}-2`, name: `${t.name} v2` })),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with many templates showing grid layout.',
      },
    },
  },
};
