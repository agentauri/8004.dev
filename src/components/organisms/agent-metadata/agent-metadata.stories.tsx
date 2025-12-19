import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { Agent } from '@/types/agent';
import { AgentMetadata } from './agent-metadata';

const meta = {
  title: 'Organisms/AgentMetadata',
  component: AgentMetadata,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays raw/developer-focused metadata for an agent including identifiers, endpoints, trust models, and raw data. Used in the Metadata tab of the agent detail page.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--pixel-black)] p-6 min-h-screen max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullAgent: Agent = {
  id: '11155111:42',
  chainId: 11155111,
  tokenId: '42',
  name: 'AI Code Assistant',
  description: 'An advanced AI-powered code assistant.',
  active: true,
  x402support: true,
  supportedTrust: ['reputation', 'tee', 'stake'],
  oasf: {
    skills: [
      { slug: 'natural_language_processing', confidence: 0.95, reasoning: 'Agent processes natural language queries' },
      { slug: 'code_generation', confidence: 0.92, reasoning: 'Agent generates code from specifications' },
      { slug: 'debugging', confidence: 0.88, reasoning: 'Agent assists with debugging tasks' },
    ],
    domains: [
      { slug: 'software_development', confidence: 0.97 },
      { slug: 'artificial_intelligence', confidence: 0.85 },
    ],
  },
  endpoints: {
    mcp: { url: 'https://mcp.codeassistant.ai/v2', version: '2.0' },
    a2a: { url: 'https://a2a.codeassistant.ai/v1', version: '1.5' },
    ens: 'codeassistant.eth',
    did: 'did:web:codeassistant.ai',
    agentWallet: '0x1234567890abcdef1234567890abcdef12345678',
  },
  registration: {
    chainId: 11155111,
    tokenId: '42',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadataUri: 'ipfs://QmXYZ123abc456def789ghi012jkl345mno678pqr901stu',
    owner: '0x9876543210fedcba9876543210fedcba98765432',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const minimalAgent: Agent = {
  id: '84532:1',
  chainId: 84532,
  tokenId: '1',
  name: 'Simple Agent',
  description: 'A minimal agent with basic configuration.',
  active: false,
  x402support: false,
  supportedTrust: [],
  endpoints: {
    agentWallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  },
  registration: {
    chainId: 84532,
    tokenId: '1',
    contractAddress: '',
    metadataUri: '',
    owner: '0x1111111111111111111111111111111111111111',
    registeredAt: '2024-06-01T00:00:00Z',
  },
};

export const Default: Story = {
  args: {
    agent: fullAgent,
  },
};

export const MinimalData: Story = {
  args: {
    agent: minimalAgent,
  },
  parameters: {
    docs: {
      description: {
        story: 'An agent with minimal metadata - no OASF, limited endpoints, no trust models.',
      },
    },
  },
};

export const WithIPFSMetadata: Story = {
  args: {
    agent: {
      ...fullAgent,
      registration: {
        ...fullAgent.registration,
        metadataUri: 'ipfs://QmTzQ1BtqmZ9X2gCCMpKPCU6KoA5mXGpQwNjL6tPnqwdML',
      },
    },
  },
};

export const InactiveAgent: Story = {
  args: {
    agent: {
      ...fullAgent,
      active: false,
    },
  },
};

export const NoOASF: Story = {
  args: {
    agent: {
      ...fullAgent,
      oasf: undefined,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent without OASF classification data.',
      },
    },
  },
};

export const PolygonAgent: Story = {
  args: {
    agent: {
      ...fullAgent,
      id: '80002:999',
      chainId: 80002,
      tokenId: '999',
      registration: {
        ...fullAgent.registration,
        chainId: 80002,
        tokenId: '999',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent registered on Polygon Amoy testnet.',
      },
    },
  },
};
