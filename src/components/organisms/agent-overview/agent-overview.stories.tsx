import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { Agent, AgentReputation } from '@/types/agent';
import { AgentOverview } from './agent-overview';

const meta = {
  title: 'Organisms/AgentOverview',
  component: AgentOverview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the main overview information for an agent including description, taxonomy, endpoints, registration, and reputation summary. Used in the Overview tab of the agent detail page.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--pixel-black)] p-6 min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullAgent: Agent = {
  id: '11155111:42',
  chainId: 11155111,
  tokenId: '42',
  name: 'AI Code Assistant',
  description:
    'An advanced AI-powered code assistant that helps developers write, review, and debug code. Supports multiple programming languages and integrates with popular development tools.',
  active: true,
  x402support: true,
  supportedTrust: ['reputation', 'stake'],
  oasf: {
    skills: [
      { slug: 'natural_language_processing', confidence: 0.95 },
      { slug: 'code_generation', confidence: 0.92 },
      { slug: 'debugging', confidence: 0.88 },
    ],
    domains: [
      { slug: 'software_development', confidence: 0.97 },
      { slug: 'artificial_intelligence', confidence: 0.85 },
    ],
  },
  endpoints: {
    mcp: { url: 'https://mcp.codeassistant.ai', version: '2.0' },
    a2a: { url: 'https://a2a.codeassistant.ai', version: '1.5' },
    ens: 'codeassistant.eth',
    did: 'did:web:codeassistant.ai',
    agentWallet: '0x1234567890abcdef1234567890abcdef12345678',
  },
  registration: {
    chainId: 11155111,
    tokenId: '42',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadataUri: 'https://codeassistant.ai/metadata.json',
    owner: '0x9876543210fedcba9876543210fedcba98765432',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const fullReputation: AgentReputation = {
  count: 156,
  averageScore: 87,
  distribution: {
    low: 8,
    medium: 24,
    high: 124,
  },
};

export const Default: Story = {
  args: {
    agent: fullAgent,
    reputation: fullReputation,
  },
};

export const WithoutReputation: Story = {
  args: {
    agent: fullAgent,
  },
};

export const MinimalAgent: Story = {
  args: {
    agent: {
      id: '84532:123',
      chainId: 84532,
      tokenId: '123',
      name: 'Simple Agent',
      description: 'A simple agent with minimal configuration.',
      active: true,
      x402support: false,
      supportedTrust: [],
      endpoints: {
        agentWallet: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
      registration: {
        chainId: 84532,
        tokenId: '123',
        contractAddress: '',
        metadataUri: '',
        owner: '0x1111111111111111111111111111111111111111',
        registeredAt: '2024-06-01T00:00:00Z',
      },
    },
    reputation: {
      count: 3,
      averageScore: 72,
      distribution: { low: 0, medium: 1, high: 2 },
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    agent: {
      ...fullAgent,
      description: '',
    },
    reputation: fullReputation,
  },
};

export const InactiveAgent: Story = {
  args: {
    agent: {
      ...fullAgent,
      active: false,
    },
    reputation: {
      count: 45,
      averageScore: 42,
      distribution: { low: 15, medium: 20, high: 10 },
    },
  },
};

export const NewAgent: Story = {
  args: {
    agent: {
      ...fullAgent,
      name: 'Brand New Agent',
      description: 'This agent was just registered and has no feedback yet.',
    },
    reputation: {
      count: 0,
      averageScore: 0,
      distribution: { low: 0, medium: 0, high: 0 },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A newly registered agent with no reputation data yet.',
      },
    },
  },
};
