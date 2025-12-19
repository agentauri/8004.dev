import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FeedbackEntry } from './feedback-entry';

const meta = {
  title: 'Molecules/FeedbackEntry',
  component: FeedbackEntry,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a single feedback entry with score, tags, context, submitter info, and timestamp. Supports compact mode for list views.',
      },
    },
  },
  argTypes: {
    feedback: {
      control: 'object',
      description: 'Feedback data object',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to show compact view',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FeedbackEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseFeedback = {
  id: 'feedback-1',
  score: 85,
  tags: ['reliable', 'fast', 'accurate'],
  context:
    'Great agent for trading tasks. Executed my orders quickly and accurately with minimal slippage.',
  feedbackUri: 'https://example.com/feedback/1',
  submitter: '0x1234567890abcdef1234567890abcdef12345678',
  timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
};

export const Default: Story = {
  args: {
    feedback: baseFeedback,
  },
};

export const HighScore: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      score: 95,
      tags: ['excellent', 'professional', 'efficient'],
      context: 'Outstanding performance! This agent exceeded all my expectations.',
    },
  },
};

export const MediumScore: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      score: 55,
      tags: ['average', 'slow'],
      context: 'The agent completed the task but took longer than expected.',
    },
  },
};

export const LowScore: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      score: 25,
      tags: ['unreliable', 'errors'],
      context: 'Multiple errors during execution. Had to retry several times.',
    },
  },
};

export const Compact: Story = {
  args: {
    feedback: baseFeedback,
    compact: true,
  },
};

export const WithoutContext: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      context: undefined,
    },
  },
};

export const WithoutUri: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      feedbackUri: undefined,
    },
  },
};

export const WithoutTags: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      tags: [],
    },
  },
};

export const ManyTags: Story = {
  args: {
    feedback: {
      ...baseFeedback,
      tags: ['reliable', 'fast', 'accurate', 'professional', 'helpful', 'responsive'],
    },
  },
};

export const MinimalFeedback: Story = {
  args: {
    feedback: {
      id: 'feedback-minimal',
      score: 70,
      tags: [],
      submitter: '0xabcdef1234567890abcdef1234567890abcdef12',
      timestamp: new Date().toISOString(),
    },
  },
};

export const FeedbackList: Story = {
  args: {
    feedback: baseFeedback,
  },
  render: () => (
    <div className="space-y-4 max-w-lg">
      <FeedbackEntry
        feedback={{
          id: '1',
          score: 95,
          tags: ['excellent', 'professional'],
          context: 'Outstanding agent!',
          submitter: '0x1111111111111111111111111111111111111111',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }}
      />
      <FeedbackEntry
        feedback={{
          id: '2',
          score: 72,
          tags: ['reliable'],
          context: 'Good performance overall.',
          submitter: '0x2222222222222222222222222222222222222222',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        }}
      />
      <FeedbackEntry
        feedback={{
          id: '3',
          score: 45,
          tags: ['slow', 'issues'],
          context: 'Had some timeout issues.',
          submitter: '0x3333333333333333333333333333333333333333',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }}
      />
    </div>
  ),
};

export const CompactList: Story = {
  args: {
    feedback: baseFeedback,
    compact: true,
  },
  render: () => (
    <div className="space-y-2 max-w-sm">
      <FeedbackEntry
        feedback={{
          id: '1',
          score: 95,
          tags: ['excellent', 'professional', 'fast', 'reliable'],
          context: 'Outstanding agent!',
          feedbackUri: 'https://example.com/1',
          submitter: '0x1111111111111111111111111111111111111111',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }}
        compact
      />
      <FeedbackEntry
        feedback={{
          id: '2',
          score: 72,
          tags: ['reliable', 'helpful'],
          context: 'Good performance overall.',
          feedbackUri: 'https://example.com/2',
          submitter: '0x2222222222222222222222222222222222222222',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        }}
        compact
      />
      <FeedbackEntry
        feedback={{
          id: '3',
          score: 45,
          tags: ['slow', 'issues', 'timeout'],
          context: 'Had some timeout issues.',
          feedbackUri: 'https://example.com/3',
          submitter: '0x3333333333333333333333333333333333333333',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }}
        compact
      />
    </div>
  ),
};
