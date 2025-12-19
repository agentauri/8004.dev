import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentCard, type AgentCardAgent } from './agent-card';

const meta = {
  title: 'Organisms/AgentCard',
  component: AgentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Card component displaying agent summary in search results. Shows name, address, badges, and capabilities.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseAgent: AgentCardAgent = {
  id: '11155111:1234',
  name: 'AI Assistant Pro',
  description:
    'A powerful AI assistant capable of handling complex tasks with natural language understanding and multi-step reasoning.',
  chainId: 11155111,
  isActive: true,
  isVerified: true,
  trustScore: 85,
  capabilities: ['mcp', 'a2a'],
};

export const Default: Story = {
  args: {
    agent: baseAgent,
  },
};

export const Active: Story = {
  args: {
    agent: {
      ...baseAgent,
      isActive: true,
    },
  },
};

export const Inactive: Story = {
  args: {
    agent: {
      ...baseAgent,
      isActive: false,
    },
  },
};

export const Verified: Story = {
  args: {
    agent: {
      ...baseAgent,
      isVerified: true,
    },
  },
};

export const HighTrustScore: Story = {
  args: {
    agent: {
      ...baseAgent,
      trustScore: 95,
    },
  },
};

export const LowTrustScore: Story = {
  args: {
    agent: {
      ...baseAgent,
      trustScore: 25,
    },
  },
};

export const NoDescription: Story = {
  args: {
    agent: {
      ...baseAgent,
      description: undefined,
    },
  },
};

export const AllCapabilities: Story = {
  args: {
    agent: {
      ...baseAgent,
      capabilities: ['mcp', 'a2a', 'x402'],
    },
  },
};

export const NoCapabilities: Story = {
  args: {
    agent: {
      ...baseAgent,
      capabilities: [],
    },
  },
};

export const BaseNetwork: Story = {
  args: {
    agent: {
      ...baseAgent,
      chainId: 84532,
    },
  },
};

export const PolygonNetwork: Story = {
  args: {
    agent: {
      ...baseAgent,
      chainId: 80002,
    },
  },
};

export const LongName: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: 'Super Long Agent Name That Should Be Truncated Properly',
    },
  },
};

export const LongDescription: Story = {
  args: {
    agent: {
      ...baseAgent,
      description:
        'This is an extremely long description that should be truncated after two lines to prevent the card from becoming too tall. It contains important information about the agent capabilities and features, but we need to keep the card compact for better UX.',
    },
  },
};

export const MinimalAgent: Story = {
  args: {
    agent: {
      id: '11155111:999',
      name: 'Basic Agent',
      chainId: 11155111,
      isActive: false,
    },
  },
};

export const WithImage: Story = {
  args: {
    agent: {
      ...baseAgent,
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=agent-pro',
    },
  },
};

export const WithBrokenImage: Story = {
  args: {
    agent: {
      ...baseAgent,
      image: 'https://example.com/broken-image-404.png',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'When the image URL returns a 404, the component shows the fallback Bot icon.',
      },
    },
  },
};

export const WithOnClick: Story = {
  args: {
    agent: baseAgent,
    onClick: () => alert('Agent card clicked!'),
  },
};

export const GridLayout: Story = {
  args: {
    agent: baseAgent,
  },
  render: () => {
    const agents: AgentCardAgent[] = [
      {
        id: '11155111:101',
        name: 'Data Analyzer',
        description: 'Analyzes large datasets and provides insights',
        chainId: 11155111,
        isActive: true,
        trustScore: 92,
        capabilities: ['mcp'],
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=data-analyzer',
      },
      {
        id: '84532:202',
        name: 'Code Assistant',
        description: 'Helps with code review and suggestions',
        chainId: 84532,
        isActive: true,
        isVerified: true,
        trustScore: 88,
        capabilities: ['mcp', 'a2a'],
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=code-assistant',
      },
      {
        id: '80002:303',
        name: 'Content Creator',
        description: 'Creates marketing content and copy',
        chainId: 80002,
        isActive: false,
        trustScore: 45,
        capabilities: ['a2a'],
      },
      {
        id: '11155111:404',
        name: 'Trading Bot',
        description: 'Automated trading strategies with payment support',
        chainId: 11155111,
        isActive: true,
        isVerified: true,
        trustScore: 78,
        capabilities: ['mcp', 'x402'],
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=trading-bot',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    );
  },
};
