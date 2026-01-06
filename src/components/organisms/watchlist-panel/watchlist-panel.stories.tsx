import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { WatchedAgent } from '@/hooks/use-watchlist';
import { WatchlistItem, WatchlistPanel } from './watchlist-panel';

const meta = {
  title: 'Organisms/WatchlistPanel',
  component: WatchlistPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Panel for displaying and managing watched agents. Shows agent status, reputation changes, and allows users to add notes and remove agents from the watchlist.',
      },
    },
  },
} satisfies Meta<typeof WatchlistPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockWatchlist: WatchedAgent[] = [
  {
    agentId: '11155111:123',
    name: 'Trading Bot Alpha',
    chainId: 11155111,
    description: 'An advanced automated trading agent with ML-powered market analysis.',
    watchedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastReputationScore: 92,
    lastActiveStatus: true,
    lastChangeAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  {
    agentId: '84532:456',
    name: 'Code Review Agent',
    chainId: 84532,
    description: 'Expert code reviewer that analyzes code quality and security.',
    watchedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastReputationScore: 78,
    lastActiveStatus: true,
    notes: 'Use for PR reviews',
  },
  {
    agentId: '80002:789',
    name: 'Data Analysis Bot',
    chainId: 80002,
    description: 'Specializes in processing and analyzing large datasets.',
    watchedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    lastReputationScore: 85,
    lastActiveStatus: false,
  },
];

/**
 * Default watchlist with multiple agents
 */
export const Default: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    maxAgents: 50,
  },
};

/**
 * Empty watchlist state
 */
export const Empty: Story = {
  args: {
    watchlist: [],
    onRemove: () => {},
    maxAgents: 50,
  },
};

/**
 * With clear all button
 */
export const WithClearAll: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    onClearAll: () => {},
    maxAgents: 50,
  },
};

/**
 * With notes editing enabled
 */
export const WithNotesEditing: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    onUpdateNotes: () => {},
    maxAgents: 50,
  },
};

/**
 * Showing only recently changed agents
 */
export const OnlyChanged: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    showOnlyChanged: true,
    maxAgents: 50,
  },
};

/**
 * Filtered by chain
 */
export const FilteredByChain: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    filterChainId: 11155111,
    maxAgents: 50,
  },
};

/**
 * Near capacity
 */
export const NearCapacity: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    maxAgents: 5,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    watchlist: mockWatchlist,
    onRemove: () => {},
    isLoading: true,
    maxAgents: 50,
  },
};

/**
 * Single item component
 */
export const SingleItem: StoryObj<typeof WatchlistItem> = {
  args: {
    agent: mockWatchlist[0],
    onRemove: () => {},
    onUpdateNotes: () => {},
  },
  render: (args) => <WatchlistItem {...args} />,
};

/**
 * Interactive demo with full functionality
 */
export const Interactive: Story = {
  args: {
    watchlist: [],
    onRemove: () => {},
    maxAgents: 50,
  },
  render: () => {
    const [watchlist, setWatchlist] = useState<WatchedAgent[]>(mockWatchlist);

    const handleRemove = (agentId: string) => {
      setWatchlist((prev) => prev.filter((a) => a.agentId !== agentId));
    };

    const handleUpdateNotes = (agentId: string, notes: string) => {
      setWatchlist((prev) =>
        prev.map((a) => (a.agentId === agentId ? { ...a, notes: notes || undefined } : a)),
      );
    };

    const handleClearAll = () => {
      setWatchlist([]);
    };

    return (
      <WatchlistPanel
        watchlist={watchlist}
        onRemove={handleRemove}
        onUpdateNotes={handleUpdateNotes}
        onClearAll={handleClearAll}
        maxAgents={50}
      />
    );
  },
};
