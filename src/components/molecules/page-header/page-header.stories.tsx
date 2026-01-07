import type { Meta, StoryObj } from '@storybook/react';
import { FlaskConical, MessageSquare, Trophy, Users, Workflow } from 'lucide-react';
import { PageHeader } from './page-header';

const meta = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PageHeader displays a standardized header section for pages with icon, title, optional description, and optional action button. Follows the 80s retro pixel art design system.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
    layout: 'padded',
  },
  argTypes: {
    title: {
      description: 'Page title (displayed in UPPERCASE)',
      control: 'text',
    },
    description: {
      description: 'Optional description text below the title',
      control: 'text',
    },
    glow: {
      description: 'Glow effect color',
      control: 'select',
      options: ['blue', 'gold', 'green'],
    },
    align: {
      description: 'Text alignment',
      control: 'radio',
      options: ['left', 'center'],
    },
    icon: {
      description: 'Lucide icon component',
      control: false,
    },
    action: {
      description: 'Optional action element (button, link, etc.)',
      control: false,
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default page header with blue glow
 */
export const Default: Story = {
  args: {
    title: 'Page Title',
    icon: Trophy,
  },
};

/**
 * Page header with description
 */
export const WithDescription: Story = {
  args: {
    title: 'Page Title',
    description:
      'A brief description of what this page does and what users can expect to find here.',
    icon: Trophy,
  },
};

/**
 * Gold glow variant - used for premium/highlight pages like Leaderboard
 */
export const GoldGlow: Story = {
  args: {
    title: 'Leaderboard',
    description: 'Top agents ranked by reputation score.',
    icon: Trophy,
    glow: 'gold',
  },
};

/**
 * Green glow variant
 */
export const GreenGlow: Story = {
  args: {
    title: 'Success',
    description: 'Operation completed successfully.',
    icon: Trophy,
    glow: 'green',
  },
};

/**
 * Center-aligned header - used for focused/wizard pages like Compose
 */
export const Centered: Story = {
  args: {
    title: 'Team Composer',
    description: 'Build the perfect agent team for your task.',
    icon: Users,
    glow: 'gold',
    align: 'center',
  },
};

/**
 * Header with action button
 */
export const WithAction: Story = {
  args: {
    title: 'Evaluations',
    description: 'Agent benchmark results and performance scores.',
    icon: FlaskConical,
    glow: 'blue',
    action: (
      <button
        type="button"
        className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)] hover:shadow-[0_0_12px_var(--glow-green)] transition-all"
      >
        + New Evaluation
      </button>
    ),
  },
};

/**
 * Leaderboard page example
 */
export const LeaderboardExample: Story = {
  name: 'Example: Leaderboard',
  args: {
    title: 'Leaderboard',
    description:
      'Top agents ranked by reputation score. Filter by chain, protocol support, and time period.',
    icon: Trophy,
    glow: 'gold',
  },
};

/**
 * Feedbacks page example
 */
export const FeedbacksExample: Story = {
  name: 'Example: Feedbacks',
  args: {
    title: 'Global Feedbacks',
    description: 'Browse all on-chain feedbacks submitted for agents across all supported chains.',
    icon: MessageSquare,
    glow: 'blue',
  },
};

/**
 * Evaluate page example with action button
 */
export const EvaluateExample: Story = {
  name: 'Example: Evaluate',
  args: {
    title: 'Evaluations',
    description: 'Agent benchmark results and performance scores.',
    icon: FlaskConical,
    glow: 'blue',
    action: (
      <button
        type="button"
        className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)] hover:shadow-[0_0_12px_var(--glow-green)] transition-all"
      >
        + New Evaluation
      </button>
    ),
  },
};

/**
 * Compose page example - centered with gold glow
 */
export const ComposeExample: Story = {
  name: 'Example: Compose',
  args: {
    title: 'Team Composer',
    description: 'Build the perfect agent team for your task.',
    icon: Users,
    glow: 'gold',
    align: 'center',
  },
};

/**
 * Intents page example
 */
export const IntentsExample: Story = {
  name: 'Example: Intents',
  args: {
    title: 'Intent Templates',
    description: 'Browse workflow templates for common AI agent tasks.',
    icon: Workflow,
    glow: 'blue',
  },
};
