import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { TeamMember } from '@/types';
import { TeamMemberCard } from './team-member-card';

const createMockMember = (overrides: Partial<TeamMember> = {}): TeamMember => ({
  agentId: '11155111:123',
  role: 'Code Analyzer',
  contribution: 'Analyzes smart contract code for vulnerabilities and security issues',
  compatibilityScore: 92,
  ...overrides,
});

const meta = {
  title: 'Molecules/TeamMemberCard',
  component: TeamMemberCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a team member's role, contribution, and compatibility score within a composed team. Links to the agent detail page for more information.",
      },
    },
  },
  argTypes: {
    member: {
      description: 'Team member data object',
    },
    onViewAgent: {
      action: 'viewAgent',
      description: 'Optional callback when agent is clicked (overrides Link behavior)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof TeamMemberCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    member: createMockMember(),
  },
};

export const HighCompatibility: Story = {
  args: {
    member: createMockMember({
      role: 'Lead Architect',
      contribution: 'Designs system architecture and ensures team alignment on technical decisions',
      compatibilityScore: 98,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team member with high compatibility score (98).',
      },
    },
  },
};

export const MediumCompatibility: Story = {
  args: {
    member: createMockMember({
      role: 'Testing Specialist',
      contribution: 'Creates and runs comprehensive test suites for quality assurance',
      compatibilityScore: 65,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team member with medium compatibility score (65).',
      },
    },
  },
};

export const LowCompatibility: Story = {
  args: {
    member: createMockMember({
      role: 'External Consultant',
      contribution: 'Provides occasional input on specialized topics',
      compatibilityScore: 35,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team member with low compatibility score (35).',
      },
    },
  },
};

export const SecurityExpert: Story = {
  args: {
    member: createMockMember({
      agentId: '84532:456',
      role: 'Security Expert',
      contribution:
        'Provides security best practices and recommendations for hardening the codebase against common attack vectors',
      compatibilityScore: 88,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A security expert team member on Base Sepolia.',
      },
    },
  },
};

export const ReportGenerator: Story = {
  args: {
    member: createMockMember({
      agentId: '80002:789',
      role: 'Report Generator',
      contribution:
        'Generates comprehensive audit reports with actionable insights and remediation steps',
      compatibilityScore: 85,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A report generator team member on Polygon Amoy.',
      },
    },
  },
};

export const LongContribution: Story = {
  args: {
    member: createMockMember({
      role: 'Full Stack Developer',
      contribution:
        'This agent is responsible for implementing end-to-end features including frontend components, backend APIs, database schemas, and deployment configurations. It also handles code reviews and documentation updates for the entire development lifecycle.',
      compatibilityScore: 78,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team member with a long contribution that gets truncated.',
      },
    },
  },
};

export const WithClickHandler: Story = {
  args: {
    member: createMockMember(),
    onViewAgent: (agentId) => console.log('View agent:', agentId),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with click handler for custom navigation behavior.',
      },
    },
  },
};

export const TeamGrid: Story = {
  args: {
    member: createMockMember(),
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      <TeamMemberCard
        member={createMockMember({
          agentId: '11155111:123',
          role: 'Code Analyzer',
          contribution: 'Analyzes smart contract code for vulnerabilities',
          compatibilityScore: 92,
        })}
      />
      <TeamMemberCard
        member={createMockMember({
          agentId: '11155111:456',
          role: 'Security Expert',
          contribution: 'Provides security best practices and recommendations',
          compatibilityScore: 88,
        })}
      />
      <TeamMemberCard
        member={createMockMember({
          agentId: '84532:789',
          role: 'Report Generator',
          contribution: 'Generates comprehensive audit reports',
          compatibilityScore: 85,
        })}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple team member cards in a grid layout.',
      },
    },
  },
};
