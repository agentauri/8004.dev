import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentDetailTemplate } from './agent-detail-template';

const meta = {
  title: 'Templates/AgentDetailTemplate',
  component: AgentDetailTemplate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AgentDetailTemplate provides the complete page layout for displaying agent details.',
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AgentDetailTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAgent = {
  id: '11155111:123',
  chainId: 11155111,
  tokenId: '123',
  name: 'AI Trading Bot',
  description:
    'An autonomous trading agent that executes DeFi strategies across multiple protocols. Supports limit orders, DCA, and yield optimization.',
  active: true,
  x402support: true,
  endpoints: {
    mcp: { url: 'https://mcp.trading-bot.ai/v1', version: '1.0' },
    a2a: { url: 'https://a2a.trading-bot.ai/v1', version: '1.0' },
    ens: 'trading-bot.eth',
    agentWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0aB12',
  },
  oasf: {
    skills: [
      { slug: 'trading', confidence: 0.95 },
      { slug: 'defi', confidence: 0.88 },
      { slug: 'yield', confidence: 0.82 },
    ],
    domains: [{ slug: 'finance', confidence: 0.92 }],
  },
  supportedTrust: ['evm-attestation'],
  registration: {
    chainId: 11155111,
    tokenId: '123',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    metadataUri: 'ipfs://QmXYZ123456789',
    owner: '0xabcdef1234567890abcdef1234567890abcdef12',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const mockReputation = {
  count: 150,
  averageScore: 85,
  distribution: {
    low: 10,
    medium: 40,
    high: 100,
  },
};

export const Default: Story = {
  args: {
    agent: mockAgent,
    reputation: mockReputation,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Failed to load agent. Please try again.',
  },
};

export const NotFound: Story = {
  args: {
    agent: undefined,
    isLoading: false,
  },
};

export const InactiveAgent: Story = {
  args: {
    agent: {
      ...mockAgent,
      active: false,
    },
    reputation: {
      ...mockReputation,
      averageScore: 45,
    },
  },
};

export const MinimalEndpoints: Story = {
  args: {
    agent: {
      ...mockAgent,
      endpoints: {
        mcp: { url: 'https://mcp.example.com', version: '1.0' },
      },
      x402support: false,
    },
    reputation: mockReputation,
  },
};

export const NoDescription: Story = {
  args: {
    agent: {
      ...mockAgent,
      description: '',
    },
    reputation: mockReputation,
  },
};

export const BaseSepoliaAgent: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '84532:456',
      chainId: 84532,
      tokenId: '456',
      name: 'Data Analysis Agent',
      registration: {
        ...mockAgent.registration,
        chainId: 84532,
        tokenId: '456',
      },
    },
    reputation: mockReputation,
  },
};
