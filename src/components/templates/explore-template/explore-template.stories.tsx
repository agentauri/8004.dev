import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { SearchFiltersState } from '@/components/organisms';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import { ExploreTemplate } from './explore-template';

const meta = {
  title: 'Templates/ExploreTemplate',
  component: ExploreTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Template for the agent exploration page with sidebar filters, search bar, and results grid.',
      },
    },
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    totalCount: {
      control: 'number',
      description: 'Total results count',
    },
  },
} satisfies Meta<typeof ExploreTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAgents: AgentCardAgent[] = [
  {
    id: '0x1111111111111111111111111111111111111111',
    name: 'Data Analyzer Pro',
    description: 'Advanced AI agent for analyzing large datasets.',
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 92,
    capabilities: ['mcp', 'a2a'],
  },
  {
    id: '0x2222222222222222222222222222222222222222',
    name: 'Code Assistant',
    description: 'Helps with code review and suggestions.',
    chainId: 84532,
    isActive: true,
    trustScore: 88,
    capabilities: ['mcp'],
  },
  {
    id: '0x3333333333333333333333333333333333333333',
    name: 'Content Creator',
    description: 'Creates marketing content and copy.',
    chainId: 80002,
    isActive: false,
    trustScore: 45,
    capabilities: ['a2a'],
  },
  {
    id: '0x4444444444444444444444444444444444444444',
    name: 'Trading Bot',
    description: 'Automated trading strategies.',
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 78,
    capabilities: ['mcp', 'x402'],
  },
];

const defaultFilters: SearchFiltersState = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
};

export const Default: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: defaultFilters,
    onFiltersChange: () => {},
    agents: mockAgents,
    totalCount: 4,
    filterCounts: {
      active: 3,
      inactive: 1,
      mcp: 3,
      a2a: 2,
      x402: 1,
    },
  },
};

export const Loading: Story = {
  args: {
    query: 'AI assistant',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: defaultFilters,
    onFiltersChange: () => {},
    agents: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    query: 'nonexistent agent',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: defaultFilters,
    onFiltersChange: () => {},
    agents: [],
    totalCount: 0,
  },
};

export const ErrorState: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: defaultFilters,
    onFiltersChange: () => {},
    agents: [],
    error: 'Failed to fetch agents. Please try again later.',
  },
};

export const WithFilters: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: {
      status: ['active'],
      protocols: ['mcp'],
      chains: [],
      filterMode: 'AND',
      minReputation: 0,
      maxReputation: 100,
      skills: [],
      domains: [],
      showAllAgents: false,
    },
    onFiltersChange: () => {},
    agents: mockAgents.filter((a) => a.isActive && a.capabilities?.includes('mcp')),
    totalCount: 3,
    filterCounts: {
      active: 3,
      inactive: 1,
      mcp: 3,
      a2a: 2,
      x402: 1,
    },
  },
};

export const Interactive: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    onSearch: () => {},
    filters: defaultFilters,
    onFiltersChange: () => {},
    agents: mockAgents,
    totalCount: 4,
  },
  render: function InteractiveStory() {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFiltersState>({
      status: [],
      protocols: [],
      chains: [],
      filterMode: 'AND',
      minReputation: 0,
      maxReputation: 100,
      skills: [],
      domains: [],
      showAllAgents: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(mockAgents);

    const handleSearch = async (q: string) => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      const filtered = mockAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(q.toLowerCase()) ||
          a.description?.toLowerCase().includes(q.toLowerCase()),
      );
      setResults(filtered);
      setIsLoading(false);
    };

    return (
      <ExploreTemplate
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        filters={filters}
        onFiltersChange={setFilters}
        agents={results}
        totalCount={results.length}
        isLoading={isLoading}
        filterCounts={{
          active: 3,
          inactive: 1,
          mcp: 3,
          a2a: 2,
          x402: 1,
        }}
        onAgentClick={(agent) => alert(`Clicked: ${agent.name}`)}
      />
    );
  },
};
