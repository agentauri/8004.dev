import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import type { TeamComposition, TeamMember } from '@/types';
import { TeamResult } from './team-result';

const createMockMember = (overrides: Partial<TeamMember> = {}): TeamMember => ({
  agentId: '11155111:123',
  role: 'Code Analyzer',
  contribution: 'Analyzes smart contract code for vulnerabilities and security issues',
  compatibilityScore: 92,
  ...overrides,
});

const createMockComposition = (overrides: Partial<TeamComposition> = {}): TeamComposition => ({
  id: 'comp-abc123def456',
  task: 'Build a smart contract auditor that can analyze Solidity code for vulnerabilities',
  team: [
    createMockMember({
      agentId: '11155111:123',
      role: 'Code Analyzer',
      contribution: 'Analyzes smart contract code for vulnerabilities and security issues',
      compatibilityScore: 92,
    }),
    createMockMember({
      agentId: '11155111:456',
      role: 'Security Expert',
      contribution: 'Provides security best practices and recommendations for hardening code',
      compatibilityScore: 88,
    }),
    createMockMember({
      agentId: '84532:789',
      role: 'Report Generator',
      contribution: 'Generates comprehensive audit reports with actionable insights',
      compatibilityScore: 85,
    }),
  ],
  fitnessScore: 87,
  reasoning:
    'This team combines code analysis expertise with security knowledge and reporting capabilities. The Code Analyzer provides deep technical analysis, the Security Expert ensures best practices are followed, and the Report Generator creates clear documentation of findings.',
  createdAt: new Date('2024-01-15T10:30:00'),
  ...overrides,
});

const meta = {
  title: 'Organisms/TeamResult',
  component: TeamResult,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the result of a team composition including the fitness score, team members, AI reasoning, and metadata.',
      },
    },
  },
  argTypes: {
    composition: {
      description: 'Team composition data object',
    },
    onReset: {
      action: 'reset',
      description: 'Callback when the reset button is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onReset: fn(),
  },
} satisfies Meta<typeof TeamResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    composition: createMockComposition(),
  },
};

export const HighFitness: Story = {
  args: {
    composition: createMockComposition({
      fitnessScore: 95,
      reasoning:
        'Excellent team composition with highly compatible agents. Each member brings unique expertise that complements the others perfectly.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team with a high fitness score (95).',
      },
    },
  },
};

export const MediumFitness: Story = {
  args: {
    composition: createMockComposition({
      fitnessScore: 65,
      reasoning:
        'Good team composition with some areas for improvement. The agents work together adequately but may have some overlap in capabilities.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team with a medium fitness score (65).',
      },
    },
  },
};

export const LowFitness: Story = {
  args: {
    composition: createMockComposition({
      fitnessScore: 35,
      reasoning:
        'This is the best team we could assemble given the constraints. Consider adjusting requirements for better results.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A team with a low fitness score (35).',
      },
    },
  },
};

export const SmallTeam: Story = {
  args: {
    composition: createMockComposition({
      team: [
        createMockMember({
          agentId: '11155111:123',
          role: 'Lead Developer',
          contribution: 'Handles all development and testing tasks',
          compatibilityScore: 100,
        }),
        createMockMember({
          agentId: '11155111:456',
          role: 'Code Reviewer',
          contribution: 'Reviews code and ensures quality standards',
          compatibilityScore: 95,
        }),
      ],
      fitnessScore: 92,
      reasoning: 'A focused two-person team ideal for smaller, well-defined tasks.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A small team with only 2 members.',
      },
    },
  },
};

export const LargeTeam: Story = {
  args: {
    composition: createMockComposition({
      task: 'Build a comprehensive enterprise AI platform with multiple integrations',
      team: [
        createMockMember({ agentId: '11155111:1', role: 'Architect', compatibilityScore: 95 }),
        createMockMember({ agentId: '11155111:2', role: 'Frontend Dev', compatibilityScore: 88 }),
        createMockMember({ agentId: '11155111:3', role: 'Backend Dev', compatibilityScore: 87 }),
        createMockMember({ agentId: '84532:4', role: 'Database Expert', compatibilityScore: 85 }),
        createMockMember({ agentId: '84532:5', role: 'DevOps', compatibilityScore: 82 }),
        createMockMember({ agentId: '80002:6', role: 'Security Analyst', compatibilityScore: 80 }),
      ],
      fitnessScore: 78,
      reasoning:
        'A comprehensive team covering all aspects of enterprise development. While larger teams may have coordination overhead, this composition ensures complete coverage.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A large team with 6 members for complex tasks.',
      },
    },
  },
};

export const WithoutReset: Story = {
  args: {
    composition: createMockComposition(),
    onReset: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Team result without the reset button.',
      },
    },
  },
};

export const LongReasoning: Story = {
  args: {
    composition: createMockComposition({
      reasoning:
        'This team composition was carefully selected based on multiple factors including agent capabilities, historical performance, and cross-agent compatibility scores. The Code Analyzer agent has a proven track record in identifying complex vulnerabilities in Solidity smart contracts, particularly in DeFi protocols. The Security Expert brings extensive knowledge of common attack vectors and mitigation strategies, having been trained on thousands of audit reports. Finally, the Report Generator excels at synthesizing technical findings into actionable recommendations that both developers and non-technical stakeholders can understand. Together, this team provides comprehensive coverage of the audit lifecycle from initial code review to final reporting.',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'Team result with a long AI reasoning explanation.',
      },
    },
  },
};
