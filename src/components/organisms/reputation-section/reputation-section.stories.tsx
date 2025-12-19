import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReputationSection } from './reputation-section';

const meta = {
  title: 'Organisms/ReputationSection',
  component: ReputationSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays the full reputation metrics section for an agent detail page. Shows average score, rating count, and distribution breakdown.',
      },
    },
  },
  argTypes: {
    reputation: {
      control: 'object',
      description: 'Reputation data object',
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
} satisfies Meta<typeof ReputationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reputation: {
      count: 42,
      averageScore: 85,
      distribution: {
        low: 5,
        medium: 10,
        high: 27,
      },
    },
  },
};

export const HighlyRated: Story = {
  args: {
    reputation: {
      count: 156,
      averageScore: 92,
      distribution: {
        low: 3,
        medium: 18,
        high: 135,
      },
    },
  },
};

export const MixedRatings: Story = {
  args: {
    reputation: {
      count: 100,
      averageScore: 55,
      distribution: {
        low: 30,
        medium: 40,
        high: 30,
      },
    },
  },
};

export const PoorlyRated: Story = {
  args: {
    reputation: {
      count: 45,
      averageScore: 28,
      distribution: {
        low: 32,
        medium: 10,
        high: 3,
      },
    },
  },
};

export const NewAgent: Story = {
  args: {
    reputation: {
      count: 3,
      averageScore: 75,
      distribution: {
        low: 0,
        medium: 1,
        high: 2,
      },
    },
  },
};

export const NoRatings: Story = {
  args: {
    reputation: undefined,
  },
};

export const ZeroCount: Story = {
  args: {
    reputation: {
      count: 0,
      averageScore: 0,
      distribution: {
        low: 0,
        medium: 0,
        high: 0,
      },
    },
  },
};

export const WithoutHeader: Story = {
  args: {
    reputation: {
      count: 42,
      averageScore: 85,
      distribution: {
        low: 5,
        medium: 10,
        high: 27,
      },
    },
    showHeader: false,
  },
};

export const InContext: Story = {
  args: {
    reputation: {
      count: 42,
      averageScore: 85,
      distribution: { low: 5, medium: 10, high: 27 },
    },
  },
  render: () => (
    <div className="max-w-md p-6 bg-[var(--pixel-gray-900)]">
      <h1 className="text-lg font-[family-name:var(--font-pixel-heading)] text-white mb-6">
        Trading Assistant v2
      </h1>
      <ReputationSection
        reputation={{
          count: 42,
          averageScore: 85,
          distribution: { low: 5, medium: 10, high: 27 },
        }}
      />
    </div>
  ),
};
