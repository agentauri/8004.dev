import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { CompareTable, type CompareTableAgent } from './compare-table';

const meta = {
  title: 'Organisms/CompareTable',
  component: CompareTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Side-by-side comparison table for agents. Displays agent properties in a grid layout for easy comparison of 2-4 agents.',
      },
    },
    layout: 'padded',
  },
} satisfies Meta<typeof CompareTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAgents: CompareTableAgent[] = [
  {
    id: '11155111:123',
    name: 'Trading Bot Alpha',
    description:
      'An advanced automated trading agent with ML-powered market analysis and risk management capabilities.',
    chainId: 11155111 as ChainId,
    isActive: true,
    isVerified: true,
    trustScore: 92,
    capabilities: ['mcp', 'a2a', 'x402'],
    supportedTrust: ['reputation', 'stake'],
    oasfSkills: [
      { slug: 'trading/automated', confidence: 0.95 },
      { slug: 'analysis/market', confidence: 0.88 },
    ],
    oasfDomains: [{ slug: 'finance', confidence: 0.92 }],
    walletAddress: '0x1234567890123456789012345678901234567890',
    reputationCount: 156,
  },
  {
    id: '84532:456',
    name: 'Code Review Agent',
    description:
      'Expert code reviewer that analyzes code quality, security vulnerabilities, and best practices.',
    chainId: 84532 as ChainId,
    isActive: true,
    isVerified: false,
    trustScore: 78,
    capabilities: ['mcp', 'a2a'],
    oasfSkills: [
      { slug: 'coding/review', confidence: 0.97 },
      { slug: 'security/analysis', confidence: 0.82 },
    ],
    oasfDomains: [{ slug: 'technology', confidence: 0.89 }],
    reputationCount: 89,
  },
];

/**
 * Default comparison with 2 agents
 */
export const Default: Story = {
  args: {
    agents: mockAgents,
  },
};

/**
 * Empty state when no agents are selected
 */
export const Empty: Story = {
  args: {
    agents: [],
  },
};

/**
 * Minimum state when only 1 agent is selected
 */
export const SingleAgent: Story = {
  args: {
    agents: [mockAgents[0]],
  },
};

/**
 * Comparison with 3 agents
 */
export const ThreeAgents: Story = {
  args: {
    agents: [
      ...mockAgents,
      {
        id: '80002:789',
        name: 'Data Analysis Agent',
        description:
          'Specializes in processing and analyzing large datasets with statistical methods.',
        chainId: 80002 as ChainId,
        isActive: true,
        isVerified: true,
        trustScore: 85,
        capabilities: ['mcp'],
        supportedTrust: ['reputation'],
        oasfSkills: [{ slug: 'analysis/data', confidence: 0.93 }],
        oasfDomains: [{ slug: 'technology', confidence: 0.85 }],
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        reputationCount: 67,
      },
    ],
  },
};

/**
 * Maximum comparison with 4 agents
 */
export const FourAgents: Story = {
  args: {
    agents: [
      ...mockAgents,
      {
        id: '80002:789',
        name: 'Data Agent',
        description: 'Data processing specialist',
        chainId: 80002 as ChainId,
        isActive: true,
        trustScore: 85,
        capabilities: ['mcp'],
      },
      {
        id: '11155111:999',
        name: 'Security Agent',
        description: 'Security scanning and analysis',
        chainId: 11155111 as ChainId,
        isActive: false,
        isVerified: true,
        trustScore: 71,
        capabilities: ['a2a'],
      },
    ],
  },
};

/**
 * With remove functionality enabled
 */
export const WithRemove: Story = {
  args: {
    agents: mockAgents,
    onRemoveAgent: (id) => alert(`Remove agent: ${id}`),
  },
};

/**
 * Agents with minimal data
 */
export const MinimalData: Story = {
  args: {
    agents: [
      {
        id: '11155111:100',
        name: 'Basic Agent 1',
        chainId: 11155111 as ChainId,
        isActive: true,
      },
      {
        id: '84532:200',
        name: 'Basic Agent 2',
        chainId: 84532 as ChainId,
        isActive: false,
      },
    ],
  },
};

/**
 * Mixed active/inactive agents
 */
export const MixedStatus: Story = {
  args: {
    agents: [
      { ...mockAgents[0], isActive: true },
      { ...mockAgents[1], isActive: false },
    ],
  },
};

/**
 * Agents with different trust scores
 */
export const VaryingTrustScores: Story = {
  args: {
    agents: [
      { ...mockAgents[0], trustScore: 95, reputationCount: 250 },
      { ...mockAgents[1], trustScore: 45, reputationCount: 12 },
    ],
  },
};

/**
 * Interactive demo with remove functionality
 */
export const Interactive: Story = {
  args: {
    agents: [],
  },
  render: () => {
    const [agents, setAgents] = useState<CompareTableAgent[]>(mockAgents);

    const handleRemove = (id: string) => {
      setAgents(agents.filter((a) => a.id !== id));
    };

    return (
      <div>
        {agents.length >= 2 ? (
          <CompareTable agents={agents} onRemoveAgent={handleRemove} />
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-[var(--pixel-gray-600)]">
            <p className="text-[var(--pixel-gray-400)]">
              {agents.length === 1
                ? 'One agent remaining. Add another to compare.'
                : 'All agents removed. Refresh to reset.'}
            </p>
          </div>
        )}
      </div>
    );
  },
};
