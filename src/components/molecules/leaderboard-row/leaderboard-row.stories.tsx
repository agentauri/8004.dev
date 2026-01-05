import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { LeaderboardRow } from './leaderboard-row';

const mockEntry: LeaderboardEntry = {
  rank: 1,
  agentId: '11155111:42',
  name: 'CodeReview Pro',
  score: 95,
  feedbackCount: 156,
  trend: 'up',
  hasMcp: true,
  hasA2a: true,
  x402Support: false,
  chainId: 11155111,
  active: true,
};

const meta = {
  title: 'Molecules/LeaderboardRow',
  component: LeaderboardRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a single row in the leaderboard table with rank, agent info, feedback count, trend, and score. Features gold/silver/bronze styling for top 3 ranks.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--pixel-gray-900)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeaderboardRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    entry: mockEntry,
  },
};

export const RankOne: Story = {
  args: {
    entry: mockEntry,
  },
};

export const RankTwo: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 2,
      agentId: '84532:15',
      name: 'Trading Assistant',
      score: 92,
      feedbackCount: 203,
      chainId: 84532,
      hasA2a: false,
      x402Support: true,
    },
  },
};

export const RankThree: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 3,
      agentId: '11155111:88',
      name: 'Data Analyzer',
      score: 89,
      feedbackCount: 98,
      trend: 'stable',
      hasMcp: false,
    },
  },
};

export const RankFive: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 5,
      agentId: '84532:67',
      name: 'Security Scanner',
      score: 85,
      feedbackCount: 67,
      trend: 'down',
      chainId: 84532,
      hasA2a: false,
    },
  },
};

export const DownTrend: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 8,
      trend: 'down',
    },
  },
};

export const StableTrend: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 7,
      trend: 'stable',
    },
  },
};

export const InactiveAgent: Story = {
  args: {
    entry: {
      ...mockEntry,
      active: false,
    },
  },
};

export const NoProtocols: Story = {
  args: {
    entry: {
      ...mockEntry,
      rank: 10,
      hasMcp: false,
      hasA2a: false,
      x402Support: false,
    },
  },
};

export const AllProtocols: Story = {
  args: {
    entry: {
      ...mockEntry,
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
    },
  },
};

export const LongAgentName: Story = {
  args: {
    entry: {
      ...mockEntry,
      name: 'Super Advanced AI Agent With Very Long Name That Should Truncate Properly',
    },
  },
};

export const HighFeedbackCount: Story = {
  args: {
    entry: {
      ...mockEntry,
      feedbackCount: 12345,
    },
  },
};

export const LeaderboardTable: Story = {
  args: {
    entry: mockEntry,
  },
  render: () => {
    const entries: LeaderboardEntry[] = [
      mockEntry,
      {
        ...mockEntry,
        rank: 2,
        agentId: '84532:15',
        name: 'Trading Assistant',
        score: 92,
        feedbackCount: 203,
        chainId: 84532,
        hasA2a: false,
        x402Support: true,
      },
      {
        ...mockEntry,
        rank: 3,
        agentId: '11155111:88',
        name: 'Data Analyzer',
        score: 89,
        feedbackCount: 98,
        trend: 'stable',
        hasMcp: false,
      },
      {
        ...mockEntry,
        rank: 4,
        agentId: '80002:23',
        name: 'Content Writer',
        score: 87,
        feedbackCount: 145,
        chainId: 80002,
        x402Support: true,
      },
      {
        ...mockEntry,
        rank: 5,
        agentId: '84532:67',
        name: 'Security Scanner',
        score: 85,
        feedbackCount: 67,
        trend: 'down',
        chainId: 84532,
        hasA2a: false,
      },
    ];

    return (
      <div className="border-2 border-[var(--pixel-gray-700)]">
        {/* Header */}
        <div className="grid grid-cols-[4rem_1fr_auto] md:grid-cols-[4rem_1fr_8rem_6rem_auto] gap-4 items-center p-4 border-b-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)]">
          <span className="text-[var(--pixel-gray-400)] text-xs uppercase">Rank</span>
          <span className="text-[var(--pixel-gray-400)] text-xs uppercase">Agent</span>
          <span className="hidden md:block text-[var(--pixel-gray-400)] text-xs uppercase text-right">
            Feedbacks
          </span>
          <span className="hidden md:block text-[var(--pixel-gray-400)] text-xs uppercase text-right">
            Trend
          </span>
          <span className="text-[var(--pixel-gray-400)] text-xs uppercase text-right">Score</span>
        </div>
        {/* Rows */}
        {entries.map((entry) => (
          <LeaderboardRow key={entry.agentId} entry={entry} />
        ))}
      </div>
    );
  },
};
