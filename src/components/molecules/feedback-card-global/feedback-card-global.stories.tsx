import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { GlobalFeedback } from '@/types/feedback';
import { FeedbackCardGlobal } from './feedback-card-global';

const now = new Date();

const mockFeedback: GlobalFeedback = {
  id: 'fb_1',
  score: 92,
  tags: ['reliable', 'fast'],
  context: 'Excellent code review, caught several edge cases I missed.',
  submitter: '0x1234567890abcdef1234567890abcdef12345678',
  timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
  transactionHash: '0xabc123def456789',
  agentId: '11155111:42',
  agentName: 'CodeReview Pro',
  agentChainId: 11155111,
};

const meta = {
  title: 'Molecules/FeedbackCardGlobal',
  component: FeedbackCardGlobal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a single feedback entry with agent link, score badge, tags, context, and transaction link. Used in the global feedbacks feed.',
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
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackCardGlobal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feedback: mockFeedback,
  },
};

export const PositiveScore: Story = {
  args: {
    feedback: mockFeedback,
  },
};

export const NeutralScore: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      id: 'fb_2',
      score: 55,
      tags: ['average'],
      context: 'Response was okay but nothing exceptional.',
      agentId: '84532:15',
      agentName: 'Trading Assistant',
      agentChainId: 84532,
    },
  },
};

export const NegativeScore: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      id: 'fb_3',
      score: 25,
      tags: ['inaccurate', 'slow'],
      context: 'Translation had several errors in technical terms.',
      agentId: '80002:55',
      agentName: 'Translation Bot',
      agentChainId: 80002,
    },
  },
};

export const NoContext: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      context: undefined,
    },
  },
};

export const NoTags: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      tags: [],
    },
  },
};

export const ManyTags: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      tags: ['reliable', 'fast', 'accurate', 'helpful', 'thorough'],
    },
  },
};

export const NoTransactionHash: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      transactionHash: undefined,
    },
  },
};

export const LongContext: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      context:
        'This agent provided an extremely detailed and comprehensive analysis of the codebase. It identified multiple potential security vulnerabilities and suggested specific fixes for each one. The recommendations were well-structured and easy to follow.',
    },
  },
};

export const JustNow: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      timestamp: new Date().toISOString(),
    },
  },
};

export const HoursAgo: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const DaysAgo: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const BaseChain: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      agentId: '84532:15',
      agentName: 'Trading Assistant',
      agentChainId: 84532,
    },
  },
};

export const PolygonChain: Story = {
  args: {
    feedback: {
      ...mockFeedback,
      agentId: '80002:23',
      agentName: 'Content Writer',
      agentChainId: 80002,
    },
  },
};

export const FeedbackFeed: Story = {
  args: {
    feedback: mockFeedback,
  },
  render: () => {
    const feedbacks: GlobalFeedback[] = [
      mockFeedback,
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

    return (
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <FeedbackCardGlobal key={feedback.id} feedback={feedback} />
        ))}
      </div>
    );
  },
};
