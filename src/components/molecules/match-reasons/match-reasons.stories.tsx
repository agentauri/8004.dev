import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MatchReasons } from './match-reasons';

const meta = {
  title: 'Molecules/MatchReasons',
  component: MatchReasons,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays why an agent matched a semantic search query. Shows a comma-separated list of match reasons with optional truncation and query term highlighting.',
      },
    },
  },
  argTypes: {
    reasons: {
      description: 'List of match reasons',
      control: 'object',
    },
    query: {
      description: 'Optional query for highlighting terms',
      control: 'text',
    },
    maxVisible: {
      description: 'Maximum number of reasons to show before truncating',
      control: { type: 'number', min: 1, max: 10 },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof MatchReasons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reasons: ['Strong capability match', 'Description relevance'],
    maxVisible: 2,
  },
};

export const SingleReason: Story = {
  args: {
    reasons: ['Exact name match'],
  },
  parameters: {
    docs: {
      description: {
        story: 'A single match reason without truncation.',
      },
    },
  },
};

export const ManyReasons: Story = {
  args: {
    reasons: [
      'Strong capability match',
      'Description relevance',
      'Tool compatibility',
      'Category alignment',
      'High trust score',
    ],
    maxVisible: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple reasons with truncation. Shows first 2 reasons and "+3 more" indicator.',
      },
    },
  },
};

export const WithQuery: Story = {
  args: {
    reasons: [
      'Matches "trading bot" in description',
      'Trading capabilities found',
      'Bot architecture detected',
    ],
    query: 'trading bot',
    maxVisible: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Highlights query terms within the match reasons. Query terms appear in gold color.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    reasons: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty reasons array renders nothing (null).',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    reasons: ['API compatibility', 'Tool support'],
    className: 'text-sm font-semibold',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom className for styling overrides.',
      },
    },
  },
};

export const LongReasons: Story = {
  args: {
    reasons: [
      'Strong semantic match based on advanced natural language processing analysis',
      'Capability overlap detected across multiple tool categories including code generation and data analysis',
    ],
    maxVisible: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Long reason text that may wrap to multiple lines.',
      },
    },
  },
};
