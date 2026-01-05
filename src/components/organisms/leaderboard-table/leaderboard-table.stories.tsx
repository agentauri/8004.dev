import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { LeaderboardTable } from './leaderboard-table';

const mockEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    agentId: '11155111:42',
    chainId: 11155111,
    tokenId: '42',
    name: 'CodeReview Pro',
    description: 'An AI code review assistant',
    score: 95,
    feedbackCount: 156,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
  },
  {
    rank: 2,
    agentId: '84532:15',
    chainId: 84532,
    tokenId: '15',
    name: 'Trading Assistant',
    description: 'Automated trading helper',
    score: 92,
    feedbackCount: 203,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: true,
  },
  {
    rank: 3,
    agentId: '11155111:88',
    chainId: 11155111,
    tokenId: '88',
    name: 'Data Analyzer',
    description: 'Data analysis specialist',
    score: 89,
    feedbackCount: 98,
    trend: 'stable',
    active: true,
    hasMcp: false,
    hasA2a: true,
    x402Support: false,
  },
  {
    rank: 4,
    agentId: '80002:23',
    chainId: 80002,
    tokenId: '23',
    name: 'Content Writer',
    description: 'AI content creator',
    score: 87,
    feedbackCount: 145,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: true,
  },
  {
    rank: 5,
    agentId: '84532:67',
    chainId: 84532,
    tokenId: '67',
    name: 'Security Scanner',
    description: 'Security vulnerability scanner',
    score: 85,
    feedbackCount: 67,
    trend: 'down',
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: false,
  },
  {
    rank: 6,
    agentId: '11155111:101',
    chainId: 11155111,
    tokenId: '101',
    name: 'Research Assistant',
    description: 'Research and analysis helper',
    score: 82,
    feedbackCount: 89,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
  },
  {
    rank: 7,
    agentId: '80002:55',
    chainId: 80002,
    tokenId: '55',
    name: 'Translation Bot',
    description: 'Multi-language translator',
    score: 79,
    feedbackCount: 134,
    trend: 'stable',
    active: false,
    hasMcp: false,
    hasA2a: true,
    x402Support: true,
  },
  {
    rank: 8,
    agentId: '84532:33',
    chainId: 84532,
    tokenId: '33',
    name: 'Image Generator',
    description: 'AI image creation tool',
    score: 76,
    feedbackCount: 212,
    trend: 'down',
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: true,
  },
  {
    rank: 9,
    agentId: '11155111:77',
    chainId: 11155111,
    tokenId: '77',
    name: 'Code Debugger',
    description: 'Automated debugging assistant',
    score: 74,
    feedbackCount: 56,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
  },
  {
    rank: 10,
    agentId: '80002:12',
    chainId: 80002,
    tokenId: '12',
    name: 'Sentiment Analyzer',
    description: 'Text sentiment analysis',
    score: 71,
    feedbackCount: 78,
    trend: 'stable',
    active: true,
    hasMcp: false,
    hasA2a: false,
    x402Support: false,
  },
];

const meta = {
  title: 'Organisms/LeaderboardTable',
  component: LeaderboardTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the full leaderboard table with header, rows, and load more functionality. Shows rank, agent info, feedback count, trend, and score.',
      },
    },
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether data is loading',
    },
    error: {
      control: 'text',
      description: 'Error message if any',
    },
    hasMore: {
      control: 'boolean',
      description: 'Whether more entries are available',
    },
    isLoadingMore: {
      control: 'boolean',
      description: 'Whether loading more entries',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeaderboardTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
};

export const TopThree: Story = {
  args: {
    entries: mockEntries.slice(0, 3),
  },
};

export const WithLoadMore: Story = {
  args: {
    entries: mockEntries.slice(0, 5),
    hasMore: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const LoadingMore: Story = {
  args: {
    entries: mockEntries.slice(0, 5),
    hasMore: true,
    isLoadingMore: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const Loading: Story = {
  args: {
    entries: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    entries: [],
    error: 'Failed to load leaderboard. Please try again.',
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
};

export const InteractiveLoadMore: Story = {
  args: {
    entries: mockEntries.slice(0, 5),
    hasMore: true,
  },
  render: function InteractiveLoadMoreStory(args) {
    const [entries, setEntries] = useState(args.entries);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = () => {
      setIsLoading(true);
      setTimeout(() => {
        const newEntries = mockEntries.slice(entries.length, entries.length + 5);
        setEntries((prev) => [...prev, ...newEntries]);
        setHasMore(entries.length + newEntries.length < mockEntries.length);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <LeaderboardTable
        entries={entries}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoading}
      />
    );
  },
};

export const InPageContext: Story = {
  args: {
    entries: mockEntries,
  },
  render: (args) => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl text-[var(--pixel-gray-100)]">
          Leaderboard
        </h1>
      </div>
      <p className="text-[var(--pixel-gray-400)]">
        Top agents ranked by reputation score. Filter by chain, protocol support, and time period.
      </p>
      <LeaderboardTable {...args} />
    </div>
  ),
};
