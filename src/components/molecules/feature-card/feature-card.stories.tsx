import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FeatureCard } from './feature-card';

// Icon components for stories
const ZapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const meta = {
  title: 'Molecules/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a feature highlight with an icon, title, and description. Links to a feature page with hover glow effects in the retro pixel art style.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    icon: {
      description: 'Icon element to display',
    },
    title: {
      control: 'text',
      description: 'Feature title',
    },
    description: {
      control: 'text',
      description: 'Feature description',
    },
    href: {
      control: 'text',
      description: 'Link destination',
    },
    glowColor: {
      control: 'select',
      options: ['blue', 'gold', 'green', 'red'],
      description: 'Glow color variant on hover',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Streaming Search',
    description: "Real-time results as they're found",
    href: '/explore',
  },
};

export const BlueGlow: Story = {
  args: {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Streaming Search',
    description: "Real-time results as they're found",
    href: '/explore',
    glowColor: 'blue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Blue glow variant (default).',
      },
    },
  },
};

export const GoldGlow: Story = {
  args: {
    icon: <UsersIcon className="w-5 h-5" />,
    title: 'Compose Teams',
    description: 'Build optimal agent teams for tasks',
    href: '/compose',
    glowColor: 'gold',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gold glow variant for premium features.',
      },
    },
  },
};

export const GreenGlow: Story = {
  args: {
    icon: <TrophyIcon className="w-5 h-5" />,
    title: 'Evaluations',
    description: 'Benchmark agent performance',
    href: '/evaluate',
    glowColor: 'green',
  },
  parameters: {
    docs: {
      description: {
        story: 'Green glow variant for success/completion features.',
      },
    },
  },
};

export const RedGlow: Story = {
  args: {
    icon: <SearchIcon className="w-5 h-5" />,
    title: 'Security Audit',
    description: 'Scan for vulnerabilities',
    href: '/audit',
    glowColor: 'red',
  },
  parameters: {
    docs: {
      description: {
        story: 'Red glow variant for security features.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Advanced Search',
    description:
      'Powerful semantic search with AI-powered matching, filters, and real-time streaming results for finding the perfect agents.',
    href: '/explore',
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with a longer description text.',
      },
    },
  },
};

export const FeatureGrid: Story = {
  args: {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Streaming Search',
    description: "Real-time results as they're found",
    href: '/explore',
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
      <FeatureCard
        icon={<ZapIcon className="w-5 h-5" />}
        title="Streaming Search"
        description="Real-time results as they're found"
        href="/explore"
        glowColor="blue"
      />
      <FeatureCard
        icon={<UsersIcon className="w-5 h-5" />}
        title="Compose Teams"
        description="Build optimal agent teams for tasks"
        href="/compose"
        glowColor="gold"
      />
      <FeatureCard
        icon={<TrophyIcon className="w-5 h-5" />}
        title="Evaluations"
        description="Benchmark agent performance"
        href="/evaluate"
        glowColor="green"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple feature cards in a grid layout as shown on the home page.',
      },
    },
  },
};
