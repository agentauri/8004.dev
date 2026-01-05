import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { TrendingAgent } from '@/types/trending';
import { TrendingAgentCard } from './trending-agent-card';

const mockAgent: TrendingAgent = {
  id: '11155111:42',
  name: 'CodeReview Pro',
  chainId: 11155111,
  currentScore: 92,
  previousScore: 78,
  scoreChange: 14,
  percentageChange: 17.9,
  trend: 'up',
  hasMcp: true,
  hasA2a: true,
  x402Support: false,
  isActive: true,
};

const meta = {
  title: 'Molecules/TrendingAgentCard',
  component: TrendingAgentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compact card for displaying trending agents with score change data. Shows rank, name, chain, score, trend direction, and protocol support.',
      },
    },
  },
  argTypes: {
    rank: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Rank position (1-indexed)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof TrendingAgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agent: mockAgent,
    rank: 1,
  },
};

export const RankOne: Story = {
  args: {
    agent: mockAgent,
    rank: 1,
  },
};

export const RankTwo: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '84532:15',
      name: 'Trading Assistant',
      chainId: 84532,
      currentScore: 87,
      scoreChange: 15,
      trend: 'up',
    },
    rank: 2,
  },
};

export const RankThree: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '11155111:88',
      name: 'Data Analyzer',
      chainId: 11155111,
      currentScore: 85,
      scoreChange: 11,
      trend: 'up',
      hasMcp: false,
    },
    rank: 3,
  },
};

export const RankFour: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '80002:23',
      name: 'Content Writer',
      chainId: 80002,
      currentScore: 81,
      scoreChange: 11,
      trend: 'up',
      x402Support: true,
    },
    rank: 4,
  },
};

export const DownTrend: Story = {
  args: {
    agent: {
      ...mockAgent,
      currentScore: 75,
      previousScore: 82,
      scoreChange: -7,
      percentageChange: -8.5,
      trend: 'down',
    },
    rank: 5,
  },
};

export const InactiveAgent: Story = {
  args: {
    agent: {
      ...mockAgent,
      isActive: false,
    },
    rank: 3,
  },
};

export const NoProtocols: Story = {
  args: {
    agent: {
      ...mockAgent,
      hasMcp: false,
      hasA2a: false,
      x402Support: false,
    },
    rank: 2,
  },
};

export const AllProtocols: Story = {
  args: {
    agent: {
      ...mockAgent,
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
    },
    rank: 1,
  },
};

export const LongAgentName: Story = {
  args: {
    agent: {
      ...mockAgent,
      name: 'Super Advanced AI Agent With Very Long Name That Should Truncate',
    },
    rank: 1,
  },
};

export const BaseChain: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '84532:100',
      chainId: 84532,
    },
    rank: 2,
  },
};

export const PolygonChain: Story = {
  args: {
    agent: {
      ...mockAgent,
      id: '80002:50',
      chainId: 80002,
    },
    rank: 3,
  },
};

export const TrendingGrid: Story = {
  args: {
    agent: mockAgent,
    rank: 1,
  },
  render: () => {
    const agents: Array<{ agent: TrendingAgent; rank: number }> = [
      { agent: mockAgent, rank: 1 },
      {
        agent: {
          ...mockAgent,
          id: '84532:15',
          name: 'Trading Assistant',
          chainId: 84532,
          currentScore: 87,
          scoreChange: 15,
          hasMcp: true,
          hasA2a: false,
          x402Support: true,
        },
        rank: 2,
      },
      {
        agent: {
          ...mockAgent,
          id: '11155111:88',
          name: 'Data Analyzer',
          currentScore: 85,
          scoreChange: 11,
          hasMcp: false,
          hasA2a: true,
        },
        rank: 3,
      },
      {
        agent: {
          ...mockAgent,
          id: '80002:23',
          name: 'Content Writer',
          chainId: 80002,
          currentScore: 81,
          scoreChange: 11,
          x402Support: true,
        },
        rank: 4,
      },
      {
        agent: {
          ...mockAgent,
          id: '84532:67',
          name: 'Security Scanner',
          chainId: 84532,
          currentScore: 79,
          scoreChange: 11,
          hasA2a: false,
        },
        rank: 5,
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl">
        {agents.map(({ agent, rank }) => (
          <TrendingAgentCard key={agent.id} agent={agent} rank={rank} />
        ))}
      </div>
    );
  },
};
