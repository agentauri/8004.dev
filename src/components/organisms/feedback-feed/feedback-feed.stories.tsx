import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { GlobalFeedback } from '@/types/feedback';
import { FeedbackFeed } from './feedback-feed';

const now = new Date();

const mockFeedbacks: GlobalFeedback[] = [
  {
    id: 'fb_1',
    score: 92,
    tags: ['reliable', 'fast'],
    context: 'Excellent code review, caught several edge cases I missed.',
    submitter: '0x1234567890abcdef1234567890abcdef12345678',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0xabc123',
    agentId: '11155111:42',
    agentName: 'CodeReview Pro',
    agentChainId: 11155111,
  },
  {
    id: 'fb_2',
    score: 45,
    tags: ['slow'],
    context: 'Response was accurate but took longer than expected.',
    submitter: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0xdef456',
    agentId: '84532:15',
    agentName: 'Trading Assistant',
    agentChainId: 84532,
  },
  {
    id: 'fb_3',
    score: 88,
    tags: ['accurate', 'helpful'],
    context: 'Great data analysis, very detailed insights.',
    submitter: '0x9876543210fedcba9876543210fedcba98765432',
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0x789abc',
    agentId: '11155111:88',
    agentName: 'Data Analyzer',
    agentChainId: 11155111,
  },
  {
    id: 'fb_4',
    score: 25,
    tags: ['inaccurate'],
    context: 'Translation had several errors in technical terms.',
    submitter: '0xfedcba9876543210fedcba9876543210fedcba98',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0xcde789',
    agentId: '80002:55',
    agentName: 'Translation Bot',
    agentChainId: 80002,
  },
];

const meta = {
  title: 'Organisms/FeedbackFeed',
  component: FeedbackFeed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a paginated feed of global feedbacks with load more functionality. Shows loading, error, and empty states.',
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
      description: 'Whether more feedbacks are available',
    },
    isLoadingMore: {
      control: 'boolean',
      description: 'Whether loading more feedbacks',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feedbacks: mockFeedbacks,
  },
};

export const WithLoadMore: Story = {
  args: {
    feedbacks: mockFeedbacks.slice(0, 2),
    hasMore: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const LoadingMore: Story = {
  args: {
    feedbacks: mockFeedbacks.slice(0, 2),
    hasMore: true,
    isLoadingMore: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const Loading: Story = {
  args: {
    feedbacks: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    feedbacks: [],
    error: 'Failed to load feedbacks. Please try again.',
  },
};

export const Empty: Story = {
  args: {
    feedbacks: [],
  },
};

export const SingleFeedback: Story = {
  args: {
    feedbacks: mockFeedbacks.slice(0, 1),
  },
};

export const InteractiveLoadMore: Story = {
  args: {
    feedbacks: mockFeedbacks.slice(0, 2),
    hasMore: true,
  },
  render: function InteractiveLoadMoreStory(args) {
    const [feedbacks, setFeedbacks] = useState(args.feedbacks);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = () => {
      setIsLoading(true);
      setTimeout(() => {
        const newFeedbacks = mockFeedbacks.slice(feedbacks.length, feedbacks.length + 2);
        setFeedbacks((prev) => [...prev, ...newFeedbacks]);
        setHasMore(feedbacks.length + newFeedbacks.length < mockFeedbacks.length);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <FeedbackFeed
        feedbacks={feedbacks}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoading}
      />
    );
  },
};

export const InPageContext: Story = {
  args: {
    feedbacks: mockFeedbacks,
  },
  render: (args) => (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl text-[var(--pixel-gray-100)] mb-2">
          Global Feedbacks
        </h1>
        <p className="text-[var(--pixel-gray-400)]">
          Browse all on-chain feedbacks submitted for agents.
        </p>
      </header>
      <FeedbackFeed {...args} />
    </div>
  ),
};
