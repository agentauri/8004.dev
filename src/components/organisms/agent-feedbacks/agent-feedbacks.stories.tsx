import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { AgentFeedback } from '@/types/agent';
import { AgentFeedbacks } from './agent-feedbacks';

const meta = {
  title: 'Organisms/AgentFeedbacks',
  component: AgentFeedbacks,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the full feedback list for an agent with pagination support. Used in the Feedbacks tab of the agent detail page.',
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
} satisfies Meta<typeof AgentFeedbacks>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockFeedback = (id: number, options?: Partial<AgentFeedback>): AgentFeedback => ({
  id: `feedback-${id}`,
  score: options?.score ?? 70 + Math.floor(Math.random() * 30),
  tags: options?.tags ?? ['reliable', 'responsive'],
  context: options?.context ?? `Great experience with this agent. Response #${id}`,
  submitter: `0x${id.toString(16).padStart(40, '0')}`,
  timestamp: new Date(Date.now() - id * 3600000 * 24).toISOString(),
  feedbackUri: `https://sepolia.easscan.org/attestation/view/0x${id.toString(16).padStart(64, '0')}`,
});

const manyFeedbacks = Array.from({ length: 25 }, (_, i) => createMockFeedback(i + 1));

const mixedFeedbacks: AgentFeedback[] = [
  createMockFeedback(1, {
    score: 95,
    tags: ['excellent', 'fast', 'accurate'],
    context: 'Outstanding performance! This agent consistently delivers high-quality results.',
  }),
  createMockFeedback(2, {
    score: 88,
    tags: ['reliable', 'helpful'],
    context: 'Very reliable agent, always responds quickly.',
  }),
  createMockFeedback(3, {
    score: 45,
    tags: ['slow', 'needs-improvement'],
    context: 'Response time could be better.',
  }),
  createMockFeedback(4, {
    score: 92,
    tags: ['professional', 'accurate'],
    context: 'Highly accurate and professional.',
  }),
  createMockFeedback(5, {
    score: 78,
    tags: ['good'],
    context: 'Good overall, meets expectations.',
  }),
  createMockFeedback(6, {
    score: 25,
    tags: ['poor', 'failed'],
    context: 'Failed to complete the task.',
  }),
];

export const Default: Story = {
  args: {
    feedback: manyFeedbacks,
    totalCount: 25,
  },
};

export const FewFeedbacks: Story = {
  args: {
    feedback: mixedFeedbacks.slice(0, 3),
    totalCount: 3,
  },
};

export const MixedScores: Story = {
  args: {
    feedback: mixedFeedbacks,
    totalCount: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows feedbacks with a mix of high, medium, and low scores.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    feedback: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when the agent has no feedback.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    feedback: [],
    isLoading: true,
  },
};

export const LoadingMore: Story = {
  args: {
    feedback: manyFeedbacks.slice(0, 10),
    totalCount: 50,
    hasMore: true,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when fetching more feedbacks.',
      },
    },
  },
};

export const WithMoreToLoad: Story = {
  args: {
    feedback: manyFeedbacks.slice(0, 10),
    totalCount: 150,
    hasMore: true,
    onLoadMore: () => console.log('Loading more feedbacks...'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows "Load more" button when there are more feedbacks on the server.',
      },
    },
  },
};

export const SingleFeedback: Story = {
  args: {
    feedback: [
      createMockFeedback(1, {
        score: 85,
        tags: ['first-interaction', 'positive'],
        context: 'First interaction with this agent was great!',
      }),
    ],
    totalCount: 1,
  },
};
