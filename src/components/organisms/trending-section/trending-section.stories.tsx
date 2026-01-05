import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import type { TrendingAgent } from '@/types/trending';
import { TrendingSection } from './trending-section';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const mockAgents: TrendingAgent[] = [
  {
    id: '11155111:42',
    chainId: 11155111,
    tokenId: '42',
    name: 'CodeReview Pro',
    currentScore: 92,
    previousScore: 78,
    scoreChange: 14,
    percentageChange: 17.9,
    trend: 'up',
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
    isActive: true,
  },
  {
    id: '84532:15',
    chainId: 84532,
    tokenId: '15',
    name: 'Trading Assistant',
    currentScore: 87,
    previousScore: 72,
    scoreChange: 15,
    percentageChange: 20.8,
    trend: 'up',
    hasMcp: true,
    hasA2a: false,
    x402Support: true,
    isActive: true,
  },
  {
    id: '11155111:88',
    chainId: 11155111,
    tokenId: '88',
    name: 'Data Analyzer',
    currentScore: 85,
    previousScore: 74,
    scoreChange: 11,
    percentageChange: 14.9,
    trend: 'up',
    hasMcp: false,
    hasA2a: true,
    x402Support: false,
    isActive: true,
  },
  {
    id: '80002:23',
    chainId: 80002,
    tokenId: '23',
    name: 'Content Writer',
    currentScore: 81,
    previousScore: 70,
    scoreChange: 11,
    percentageChange: 15.7,
    trend: 'up',
    hasMcp: true,
    hasA2a: true,
    x402Support: true,
    isActive: true,
  },
  {
    id: '84532:67',
    chainId: 84532,
    tokenId: '67',
    name: 'Security Scanner',
    currentScore: 79,
    previousScore: 68,
    scoreChange: 11,
    percentageChange: 16.2,
    trend: 'up',
    hasMcp: true,
    hasA2a: false,
    x402Support: false,
    isActive: true,
  },
];

const meta = {
  title: 'Organisms/TrendingSection',
  component: TrendingSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays agents with the highest reputation growth over a selected time period. Features period selector (24H/7D/30D) and auto-refresh every 5 minutes.',
      },
    },
    msw: {
      handlers: [
        http.get('/api/trending', () => {
          return HttpResponse.json({
            success: true,
            data: {
              agents: mockAgents,
              period: '7d',
              generatedAt: new Date().toISOString(),
            },
          });
        }),
      ],
    },
  },
  argTypes: {
    initialPeriod: {
      control: 'select',
      options: ['24h', '7d', '30d'],
      description: 'Initial time period for trending calculation',
    },
    limit: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of agents to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="max-w-6xl mx-auto p-4">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof TrendingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialPeriod: '7d',
    limit: 5,
  },
};

export const Period24Hours: Story = {
  args: {
    initialPeriod: '24h',
    limit: 5,
  },
};

export const Period30Days: Story = {
  args: {
    initialPeriod: '30d',
    limit: 5,
  },
};

export const ThreeAgents: Story = {
  args: {
    initialPeriod: '7d',
    limit: 3,
  },
};

export const TenAgents: Story = {
  args: {
    initialPeriod: '7d',
    limit: 10,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/trending', () => {
          const extendedAgents = [
            ...mockAgents,
            ...mockAgents.map((a, i) => ({
              ...a,
              id: `${a.id}-copy-${i}`,
              name: `${a.name} Extended ${i + 1}`,
              currentScore: a.currentScore - 5,
            })),
          ].slice(0, 10);

          return HttpResponse.json({
            success: true,
            data: {
              agents: extendedAgents,
              period: '7d',
              generatedAt: new Date().toISOString(),
            },
          });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    initialPeriod: '7d',
    limit: 5,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/trending', async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Long delay to simulate loading
          return HttpResponse.json({
            success: true,
            data: { agents: mockAgents, period: '7d', generatedAt: new Date().toISOString() },
          });
        }),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    initialPeriod: '7d',
    limit: 5,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/trending', () => {
          return HttpResponse.json(
            { success: false, error: 'Failed to fetch trending agents' },
            { status: 500 },
          );
        }),
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    initialPeriod: '7d',
    limit: 5,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/trending', () => {
          return HttpResponse.json({
            success: true,
            data: { agents: [], period: '7d', generatedAt: new Date().toISOString() },
          });
        }),
      ],
    },
  },
};

export const InHomepageContext: Story = {
  args: {
    initialPeriod: '7d',
    limit: 5,
  },
  render: (args) => (
    <div className="space-y-8">
      <div className="p-8 bg-[var(--pixel-gray-900)] text-center">
        <h1 className="font-[family-name:var(--font-pixel-display)] text-3xl text-[var(--pixel-gray-100)] mb-4">
          Agent Explorer
        </h1>
        <p className="text-[var(--pixel-gray-400)]">Homepage content above trending section</p>
      </div>

      <TrendingSection {...args} />

      <div className="p-8 bg-[var(--pixel-gray-900)] text-center">
        <p className="text-[var(--pixel-gray-400)]">Homepage content below trending section</p>
      </div>
    </div>
  ),
};
