import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { AgentCardAgent } from '../agent-card';
import { SearchResults } from './search-results';

const meta = {
  title: 'Organisms/SearchResults',
  component: SearchResults,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays search results as a grid of agent cards with loading, empty, and error states.',
      },
    },
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Show loading skeletons',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    totalCount: {
      control: 'number',
      description: 'Total number of results',
    },
    emptyMessage: {
      control: 'text',
      description: 'Custom empty state message',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAgents: AgentCardAgent[] = [
  {
    id: '0x1111111111111111111111111111111111111111',
    name: 'Data Analyzer Pro',
    description:
      'Advanced AI agent for analyzing large datasets and providing actionable insights.',
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 92,
    capabilities: ['mcp', 'a2a'],
  },
  {
    id: '0x2222222222222222222222222222222222222222',
    name: 'Code Assistant',
    description: 'Helps with code review, suggestions, and automated testing.',
    chainId: 84532,
    isActive: true,
    trustScore: 88,
    capabilities: ['mcp'],
  },
  {
    id: '0x3333333333333333333333333333333333333333',
    name: 'Content Creator',
    description: 'Creates marketing content, blog posts, and social media copy.',
    chainId: 80002,
    isActive: false,
    trustScore: 45,
    capabilities: ['a2a'],
  },
  {
    id: '0x4444444444444444444444444444444444444444',
    name: 'Trading Bot',
    description: 'Automated trading strategies with support for payment protocols.',
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 78,
    capabilities: ['mcp', 'x402'],
  },
];

export const WithResults: Story = {
  args: {
    agents: mockAgents,
    totalCount: 4,
  },
};

export const Loading: Story = {
  args: {
    agents: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    agents: [],
    emptyMessage: 'No agents found matching your search.',
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    agents: [],
    emptyMessage: 'Try adjusting your filters or search query.',
  },
};

export const ErrorState: Story = {
  args: {
    agents: [],
    error: 'Failed to fetch agents. Please try again later.',
  },
};

export const SingleResult: Story = {
  args: {
    agents: [mockAgents[0]],
    totalCount: 1,
  },
};

export const ManyResults: Story = {
  args: {
    agents: [...mockAgents, ...mockAgents.map((a, i) => ({ ...a, id: `0x555${i}` }))],
    totalCount: 8,
  },
};

export const WithoutCount: Story = {
  args: {
    agents: mockAgents,
  },
};

export const Interactive: Story = {
  args: {
    agents: mockAgents,
    totalCount: 4,
    onAgentClick: (agent) => {
      alert(`Clicked: ${agent.name}`);
    },
  },
};

export const InPageContext: Story = {
  args: {
    agents: mockAgents,
    totalCount: 156,
  },
  render: (args) => (
    <div className="min-h-[600px] bg-[var(--pixel-gray-dark)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-6">
          SEARCH RESULTS
        </h1>
        <SearchResults {...args} />
      </div>
    </div>
  ),
};
