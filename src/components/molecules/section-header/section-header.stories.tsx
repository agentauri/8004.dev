import type { Meta, StoryObj } from '@storybook/react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import { SectionHeader } from './section-header';

const meta = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Consistent section header component for homepage sections. Provides UPPERCASE titles with optional icons and action links.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Optional icon to display before the title',
    },
    children: {
      control: false,
      description: 'Optional children for additional controls',
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Recent Evaluations',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Trending Agents',
    icon: <Flame className="w-5 h-5 text-[var(--pixel-red-fire)]" />,
  },
};

export const WithActionLink: Story = {
  args: {
    title: 'Workflow Templates',
    actionHref: '/intents',
    actionText: 'Browse all',
  },
};

export const WithIconAndAction: Story = {
  args: {
    title: 'Trending Agents',
    icon: <TrendingUp className="w-5 h-5 text-[var(--pixel-green-pipe)]" />,
    actionHref: '/trending',
    actionText: 'View all',
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Trending Agents',
    icon: <Flame className="w-5 h-5 text-[var(--pixel-red-fire)]" />,
    children: (
      <div className="flex items-center gap-2">
        <span className="text-[var(--pixel-gray-500)] text-xs uppercase tracking-wider">
          Period:
        </span>
        <button
          type="button"
          className="px-3 py-1.5 text-xs uppercase tracking-wider border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)]"
        >
          24H
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs uppercase tracking-wider border-2 border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)]"
        >
          7D
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs uppercase tracking-wider border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)]"
        >
          30D
        </button>
      </div>
    ),
  },
};

export const AllFeatures: Story = {
  args: {
    title: 'Featured Section',
    icon: <Sparkles className="w-5 h-5 text-[var(--pixel-gold-coin)]" />,
    actionHref: '/featured',
    actionText: 'See more',
    children: <span className="text-xs text-[var(--pixel-gray-500)]">Updated just now</span>,
  },
};
