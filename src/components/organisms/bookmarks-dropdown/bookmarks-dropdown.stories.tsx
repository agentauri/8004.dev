import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { BookmarkedAgent } from '@/hooks/use-bookmarks';
import { BookmarksDropdown } from './bookmarks-dropdown';

const meta = {
  title: 'Organisms/BookmarksDropdown',
  component: BookmarksDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown component for displaying and managing bookmarked agents. Shows in the header navigation.',
      },
    },
  },
} satisfies Meta<typeof BookmarksDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBookmarks: BookmarkedAgent[] = [
  {
    agentId: '11155111:123',
    name: 'Trading Bot Pro',
    chainId: 11155111,
    description: 'AI-powered trading strategies with risk management',
    bookmarkedAt: Date.now() - 86400000,
  },
  {
    agentId: '84532:456',
    name: 'Code Review Assistant',
    chainId: 84532,
    description: 'Automated code review and suggestions',
    bookmarkedAt: Date.now() - 172800000,
  },
  {
    agentId: '80002:789',
    name: 'Data Analyzer',
    chainId: 80002,
    bookmarkedAt: Date.now() - 259200000,
  },
  {
    agentId: '11155111:321',
    name: 'Customer Support Bot',
    chainId: 11155111,
    description: 'Handles customer inquiries and ticket routing',
    bookmarkedAt: Date.now() - 345600000,
  },
];

export const Default: Story = {
  args: {
    bookmarks: mockBookmarks,
    onRemove: () => {},
    onClearAll: () => {},
  },
};

export const Empty: Story = {
  args: {
    bookmarks: [],
    onRemove: () => {},
    onClearAll: () => {},
  },
};

export const SingleBookmark: Story = {
  args: {
    bookmarks: [mockBookmarks[0]],
    onRemove: () => {},
    onClearAll: () => {},
  },
};

export const ManyBookmarks: Story = {
  args: {
    bookmarks: [
      ...mockBookmarks,
      {
        agentId: '11155111:001',
        name: 'Agent Alpha',
        chainId: 11155111,
        bookmarkedAt: Date.now(),
      },
      {
        agentId: '84532:002',
        name: 'Agent Beta',
        chainId: 84532,
        bookmarkedAt: Date.now(),
      },
      {
        agentId: '80002:003',
        name: 'Agent Gamma',
        chainId: 80002,
        bookmarkedAt: Date.now(),
      },
      {
        agentId: '11155111:004',
        name: 'Agent Delta',
        chainId: 11155111,
        bookmarkedAt: Date.now(),
      },
    ],
    onRemove: () => {},
    onClearAll: () => {},
  },
};

export const Interactive: Story = {
  args: {
    bookmarks: mockBookmarks,
    onRemove: () => {},
    onClearAll: () => {},
  },
  render: function InteractiveStory(args) {
    const [bookmarks, setBookmarks] = useState(args.bookmarks);

    const handleRemove = (agentId: string) => {
      setBookmarks((prev) => prev.filter((b) => b.agentId !== agentId));
    };

    const handleClearAll = () => {
      setBookmarks([]);
    };

    const handleAddSample = () => {
      const newBookmark: BookmarkedAgent = {
        agentId: `11155111:${Date.now()}`,
        name: `New Agent ${Date.now() % 1000}`,
        chainId: 11155111,
        description: 'A newly added agent',
        bookmarkedAt: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    };

    return (
      <div className="flex items-center gap-4">
        <BookmarksDropdown
          bookmarks={bookmarks}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />
        <button
          type="button"
          onClick={handleAddSample}
          className="px-3 py-2 text-sm border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] transition-colors"
        >
          Add sample bookmark
        </button>
      </div>
    );
  },
};

export const InHeader: Story = {
  args: {
    bookmarks: mockBookmarks,
    onRemove: () => {},
    onClearAll: () => {},
  },
  render: (args) => (
    <div className="border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-900)] p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-pixel-title text-lg text-[var(--pixel-blue-text)]">8004.dev</h1>
        <div className="flex items-center gap-4">
          <BookmarksDropdown {...args} />
          <span className="text-sm text-[var(--pixel-gray-400)]">Other Header Items</span>
        </div>
      </div>
    </div>
  ),
};
