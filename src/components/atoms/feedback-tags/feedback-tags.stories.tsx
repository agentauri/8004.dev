import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FeedbackTags } from './feedback-tags';

const meta = {
  title: 'Atoms/FeedbackTags',
  component: FeedbackTags,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a list of styled tags for feedback entries. Uses retro pixel styling with optional truncation.',
      },
    },
  },
  argTypes: {
    tags: {
      control: 'object',
      description: 'Array of tag strings to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    maxTags: {
      control: { type: 'number', min: 1 },
      description: 'Maximum number of visible tags',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FeedbackTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tags: ['reliable', 'fast', 'accurate'],
  },
};

export const SingleTag: Story = {
  args: {
    tags: ['helpful'],
  },
};

export const ManyTags: Story = {
  args: {
    tags: ['reliable', 'fast', 'accurate', 'responsive', 'helpful', 'friendly'],
  },
};

export const WithMaxTags: Story = {
  args: {
    tags: ['reliable', 'fast', 'accurate', 'responsive', 'helpful'],
    maxTags: 3,
  },
};

export const Empty: Story = {
  args: {
    tags: [],
  },
};

export const Small: Story = {
  args: {
    tags: ['reliable', 'fast', 'accurate'],
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    tags: ['reliable', 'fast', 'accurate'],
    size: 'lg',
  },
};

export const AllSizes: Story = {
  args: {
    tags: ['reliable', 'fast'],
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Small</p>
        <FeedbackTags tags={['reliable', 'fast', 'accurate']} size="sm" />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Medium (default)</p>
        <FeedbackTags tags={['reliable', 'fast', 'accurate']} size="md" />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Large</p>
        <FeedbackTags tags={['reliable', 'fast', 'accurate']} size="lg" />
      </div>
    </div>
  ),
};

export const TruncationExample: Story = {
  args: {
    tags: ['quality', 'reliable', 'responsive', 'helpful', 'friendly', 'professional', 'fast'],
    maxTags: 4,
  },
  render: () => (
    <div className="space-y-4 max-w-xs">
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">No limit</p>
        <FeedbackTags
          tags={['quality', 'reliable', 'responsive', 'helpful', 'friendly', 'professional']}
        />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Max 4 tags</p>
        <FeedbackTags
          tags={['quality', 'reliable', 'responsive', 'helpful', 'friendly', 'professional']}
          maxTags={4}
        />
      </div>
      <div>
        <p className="text-sm text-[var(--pixel-gray-400)] mb-2">Max 2 tags</p>
        <FeedbackTags
          tags={['quality', 'reliable', 'responsive', 'helpful', 'friendly', 'professional']}
          maxTags={2}
        />
      </div>
    </div>
  ),
};
