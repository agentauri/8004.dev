import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FeedbackTimeline } from './feedback-timeline';

const meta = {
  title: 'Organisms/FeedbackTimeline',
  component: FeedbackTimeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a chronological list of feedback entries with optional pagination and compact mode.',
      },
    },
  },
  argTypes: {
    feedback: {
      control: 'object',
      description: 'Array of feedback entries',
    },
    maxEntries: {
      control: { type: 'number', min: 1 },
      description: 'Maximum number of entries to display',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to use compact display',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the section header',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FeedbackTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFeedback = [
  {
    id: '1',
    score: 95,
    tags: ['excellent', 'fast', 'professional'],
    context: 'Outstanding agent! Completed my trading task flawlessly.',
    feedbackUri: 'https://example.com/feedback/1',
    submitter: '0x1111111111111111111111111111111111111111',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    score: 72,
    tags: ['reliable', 'helpful'],
    context: 'Good performance overall. Would use again.',
    feedbackUri: 'https://example.com/feedback/2',
    submitter: '0x2222222222222222222222222222222222222222',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    score: 45,
    tags: ['slow', 'issues'],
    context: 'Some timeout issues during execution. Had to retry.',
    submitter: '0x3333333333333333333333333333333333333333',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    score: 88,
    tags: ['accurate', 'efficient'],
    context: 'Very efficient and accurate results.',
    feedbackUri: 'https://example.com/feedback/4',
    submitter: '0x4444444444444444444444444444444444444444',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    score: 60,
    tags: ['average'],
    context: 'Average experience. Nothing special.',
    submitter: '0x5555555555555555555555555555555555555555',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const Default: Story = {
  args: {
    feedback: mockFeedback,
  },
};

export const WithLimit: Story = {
  args: {
    feedback: mockFeedback,
    maxEntries: 3,
  },
};

export const WithShowMore: Story = {
  args: {
    feedback: mockFeedback,
    maxEntries: 3,
    onShowMore: () => alert('Load more feedback'),
  },
};

export const Compact: Story = {
  args: {
    feedback: mockFeedback,
    compact: true,
  },
};

export const CompactWithLimit: Story = {
  args: {
    feedback: mockFeedback,
    maxEntries: 3,
    compact: true,
  },
};

export const Empty: Story = {
  args: {
    feedback: [],
  },
};

export const SingleEntry: Story = {
  args: {
    feedback: [mockFeedback[0]],
  },
};

export const WithoutHeader: Story = {
  args: {
    feedback: mockFeedback.slice(0, 3),
    showHeader: false,
  },
};

export const InContext: Story = {
  args: {
    feedback: mockFeedback,
    maxEntries: 3,
  },
  render: () => (
    <div className="max-w-lg p-6 bg-[var(--pixel-gray-900)]">
      <h1 className="text-lg font-[family-name:var(--font-pixel-heading)] text-white mb-6">
        Trading Assistant v2
      </h1>
      <FeedbackTimeline
        feedback={mockFeedback}
        maxEntries={3}
        onShowMore={() => alert('Load more')}
      />
    </div>
  ),
};
