import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RelatedAgents } from './related-agents';

const meta = {
  title: 'Organisms/RelatedAgents',
  component: RelatedAgents,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a grid of agents similar to the current agent based on capabilities and protocols.',
      },
    },
  },
  argTypes: {
    agents: {
      control: 'object',
      description: 'Array of related agent summaries',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether data is loading',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the section header',
    },
    maxAgents: {
      control: { type: 'number', min: 1 },
      description: 'Maximum agents to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RelatedAgents>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAgents = [
  {
    id: '11155111:101',
    chainId: 11155111,
    tokenId: '101',
    name: 'Trading Bot Alpha',
    description: 'High-frequency trading agent specialized in DeFi protocols.',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: ['evm-attestation'],
    reputationScore: 92,
    reputationCount: 156,
  },
  {
    id: '11155111:102',
    chainId: 11155111,
    tokenId: '102',
    name: 'DeFi Arbitrage Agent',
    description: 'Automated arbitrage opportunities across DEX platforms.',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: true,
    supportedTrust: [],
    reputationScore: 85,
    reputationCount: 89,
  },
  {
    id: '84532:201',
    chainId: 84532,
    tokenId: '201',
    name: 'Base Trading Helper',
    description: 'Cross-chain trading assistant on Base network.',
    active: true,
    x402support: false,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: ['evm-attestation'],
    reputationScore: 78,
    reputationCount: 45,
  },
  {
    id: '80002:301',
    chainId: 80002,
    tokenId: '301',
    name: 'Polygon Trade Assistant',
    description: 'Low-cost trading agent for Polygon Amoy.',
    active: true,
    x402support: true,
    hasMcp: false,
    hasA2a: true,
    supportedTrust: [],
    reputationScore: 71,
    reputationCount: 23,
  },
];

export const Default: Story = {
  args: {
    agents: mockAgents,
  },
};

export const TwoAgents: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
  },
};

export const MaxAgentsLimit: Story = {
  args: {
    agents: mockAgents,
    maxAgents: 2,
  },
};

export const Loading: Story = {
  args: {
    agents: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    agents: [],
  },
};

export const WithoutHeader: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
    showHeader: false,
  },
};

export const SingleAgent: Story = {
  args: {
    agents: [mockAgents[0]],
  },
};

export const InContext: Story = {
  args: {
    agents: mockAgents,
  },
  render: () => (
    <div className="max-w-3xl p-6 bg-[var(--pixel-gray-900)]">
      <h1 className="text-lg font-[family-name:var(--font-pixel-heading)] text-white mb-6">
        Trading Assistant v2
      </h1>
      <p className="text-sm text-[var(--pixel-gray-400)] mb-8">
        An AI-powered trading assistant for DeFi protocols.
      </p>
      <RelatedAgents agents={mockAgents} />
    </div>
  ),
};
