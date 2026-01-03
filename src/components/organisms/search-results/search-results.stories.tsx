import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useState } from 'react';
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
          'Displays search results as a grid of agent cards with loading, empty, error, and streaming states. Supports progressive result rendering with animations.',
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
    isStreaming: {
      control: 'boolean',
      description: 'Whether results are being streamed',
    },
    hydeQuery: {
      control: 'text',
      description: 'AI-expanded query text',
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

// ============================================
// Streaming Stories
// ============================================

export const StreamingBasic: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
    isStreaming: true,
    streamProgress: {
      current: 2,
      expected: 5,
    },
    onStopStream: () => {
      alert('Stop stream clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic streaming state with progress indicator and stop button.',
      },
    },
  },
};

export const StreamingWithProgress: Story = {
  args: {
    agents: mockAgents.slice(0, 3),
    isStreaming: true,
    streamProgress: {
      current: 3,
      expected: 10,
    },
    onStopStream: () => {
      alert('Stop stream clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Streaming with visible progress bar showing 3/10 results received.',
      },
    },
  },
};

export const StreamingUnknownTotal: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
    isStreaming: true,
    streamProgress: {
      current: 2,
      expected: null,
    },
    onStopStream: () => {
      alert('Stop stream clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Streaming without known total - no progress bar shown.',
      },
    },
  },
};

export const StreamingWithHydeQuery: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
    isStreaming: true,
    streamProgress: {
      current: 2,
      expected: 5,
    },
    hydeQuery:
      'An AI agent capable of reviewing source code, identifying bugs, suggesting improvements, and providing automated testing capabilities. The agent should support multiple programming languages and integrate with version control systems.',
    onStopStream: () => {
      alert('Stop stream clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Streaming results with HyDE (Hypothetical Document Embeddings) expanded query displayed in a collapsible section.',
      },
    },
  },
};

export const StreamingComplete: Story = {
  args: {
    agents: mockAgents,
    isStreaming: false,
    totalCount: 4,
    hydeQuery:
      'An AI agent capable of reviewing source code, identifying bugs, suggesting improvements, and providing automated testing capabilities.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Streaming completed - shows normal results with HyDE query still visible for context.',
      },
    },
  },
};

export const StreamingEmpty: Story = {
  args: {
    agents: [],
    isStreaming: true,
    streamProgress: {
      current: 0,
      expected: null,
    },
    onStopStream: () => {
      alert('Stop stream clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Streaming state with no results yet - shows streaming indicator without empty state.',
      },
    },
  },
};

/**
 * Interactive streaming demo that simulates progressive result loading.
 */
export const StreamingInteractive: Story = {
  args: {
    agents: [],
    isStreaming: false,
  },
  render: function StreamingDemo() {
    const [agents, setAgents] = useState<AgentCardAgent[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [progress, setProgress] = useState({ current: 0, expected: mockAgents.length });

    const startStreaming = () => {
      setAgents([]);
      setIsStreaming(true);
      setProgress({ current: 0, expected: mockAgents.length });
    };

    const stopStreaming = () => {
      setIsStreaming(false);
    };

    useEffect(() => {
      if (!isStreaming) return;

      const interval = setInterval(() => {
        setAgents((prev) => {
          if (prev.length >= mockAgents.length) {
            setIsStreaming(false);
            return prev;
          }
          const nextAgent = mockAgents[prev.length];
          setProgress({ current: prev.length + 1, expected: mockAgents.length });
          return [...prev, nextAgent];
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [isStreaming]);

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={startStreaming}
            disabled={isStreaming}
            className="px-4 py-2 bg-[var(--pixel-blue-sky)] text-white font-[family-name:var(--font-pixel-body)] text-xs uppercase disabled:opacity-50"
          >
            Start Streaming
          </button>
          <button
            type="button"
            onClick={() => {
              setAgents([]);
              setIsStreaming(false);
              setProgress({ current: 0, expected: mockAgents.length });
            }}
            className="px-4 py-2 bg-[var(--pixel-gray-700)] text-white font-[family-name:var(--font-pixel-body)] text-xs uppercase"
          >
            Reset
          </button>
        </div>
        <SearchResults
          agents={agents}
          isStreaming={isStreaming}
          streamProgress={progress}
          onStopStream={stopStreaming}
          totalCount={isStreaming ? undefined : agents.length}
          hydeQuery={
            isStreaming || agents.length > 0
              ? 'AI agents for data analysis, code review, content creation, and automated trading with MCP and A2A capabilities.'
              : undefined
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing streaming behavior. Click "Start Streaming" to see results appear progressively.',
      },
    },
  },
};

export const StreamingInPageContext: Story = {
  args: {
    agents: mockAgents.slice(0, 2),
    isStreaming: true,
    streamProgress: {
      current: 2,
      expected: 6,
    },
    hydeQuery:
      'AI agent specialized in natural language processing and semantic search with vector database integration.',
  },
  render: (args) => (
    <div className="min-h-[600px] bg-[var(--pixel-gray-dark)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[var(--pixel-white)] font-[family-name:var(--font-pixel-body)] text-xl mb-2">
          SEARCH RESULTS
        </h1>
        <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-mono)] text-sm mb-6">
          Query: "semantic search agent"
        </p>
        <SearchResults
          {...args}
          onStopStream={() => {
            alert('Stop stream clicked');
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Streaming results displayed within a page context with header and query info.',
      },
    },
  },
};
