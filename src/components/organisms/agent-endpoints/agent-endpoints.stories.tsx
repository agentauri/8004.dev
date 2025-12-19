import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentEndpoints } from './agent-endpoints';

const meta = {
  title: 'Organisms/AgentEndpoints',
  component: AgentEndpoints,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AgentEndpoints displays the connectivity endpoints for an agent including MCP, A2A, ENS, DID, and wallet information.',
      },
    },
  },
} satisfies Meta<typeof AgentEndpoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    endpoints: {
      mcp: { url: 'https://mcp.agent-example.com/v1', version: '1.0' },
      a2a: { url: 'https://a2a.agent-example.com/v1', version: '1.0' },
    },
    x402Support: true,
  },
};

export const AllEndpoints: Story = {
  args: {
    endpoints: {
      mcp: { url: 'https://mcp.agent-example.com/v1', version: '1.0' },
      a2a: { url: 'https://a2a.agent-example.com/v1', version: '2.0' },
      ens: 'trading-bot.eth',
      did: 'did:ethr:0x1234567890abcdef1234567890abcdef12345678',
      agentWallet: '0x1234567890abcdef1234567890abcdef12345678',
    },
    x402Support: true,
  },
};

export const McpOnly: Story = {
  args: {
    endpoints: {
      mcp: { url: 'https://mcp.agent-example.com/v1', version: '1.0' },
    },
    x402Support: false,
  },
};

export const A2aOnly: Story = {
  args: {
    endpoints: {
      a2a: { url: 'https://a2a.agent-example.com/v1', version: '1.0' },
    },
    x402Support: false,
  },
};

export const WithEnsAndDid: Story = {
  args: {
    endpoints: {
      ens: 'my-agent.eth',
      did: 'did:web:example.com',
    },
    x402Support: false,
  },
};

export const NoEndpoints: Story = {
  args: {
    endpoints: {},
    x402Support: false,
  },
};

export const LongUrls: Story = {
  args: {
    endpoints: {
      mcp: {
        url: 'https://very-long-subdomain.mcp.agent-example-with-long-domain.com/api/v1/endpoint',
        version: '1.0',
      },
      did: 'did:ethr:mainnet:0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    x402Support: true,
  },
};
