import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BookmarkButton } from './bookmark-button';

const meta = {
  title: 'Atoms/BookmarkButton',
  component: BookmarkButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle button for bookmarking/unbookmarking items. Uses gold color for bookmarked state to indicate saved items.',
      },
    },
  },
  argTypes: {
    isBookmarked: {
      control: 'boolean',
      description: 'Whether the item is currently bookmarked',
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback when bookmark is toggled',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    label: {
      control: 'text',
      description: 'Custom accessible label for screen readers',
    },
  },
} satisfies Meta<typeof BookmarkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
  },
};

export const Bookmarked: Story = {
  args: {
    isBookmarked: true,
    onToggle: () => {},
  },
};

export const Interactive: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
  },
  render: function InteractiveBookmark(args) {
    const [isBookmarked, setIsBookmarked] = useState(args.isBookmarked);

    return (
      <div className="flex items-center gap-4">
        <BookmarkButton
          {...args}
          isBookmarked={isBookmarked}
          onToggle={() => setIsBookmarked(!isBookmarked)}
        />
        <span className="text-[var(--pixel-gray-400)] font-mono text-sm">
          {isBookmarked ? 'Bookmarked' : 'Not bookmarked'}
        </span>
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="xs" />
        <span className="text-xs text-[var(--pixel-gray-500)]">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="sm" />
        <span className="text-xs text-[var(--pixel-gray-500)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="md" />
        <span className="text-xs text-[var(--pixel-gray-500)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="lg" />
        <span className="text-xs text-[var(--pixel-gray-500)]">lg</span>
      </div>
    </div>
  ),
};

export const BookmarkedSizes: Story = {
  args: {
    isBookmarked: true,
    onToggle: () => {},
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="xs" />
        <span className="text-xs text-[var(--pixel-gray-500)]">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="sm" />
        <span className="text-xs text-[var(--pixel-gray-500)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="md" />
        <span className="text-xs text-[var(--pixel-gray-500)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BookmarkButton {...args} size="lg" />
        <span className="text-xs text-[var(--pixel-gray-500)]">lg</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
    disabled: true,
  },
};

export const DisabledBookmarked: Story = {
  args: {
    isBookmarked: true,
    onToggle: () => {},
    disabled: true,
  },
};

export const CustomLabel: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
    label: 'Save this agent to your collection',
  },
};

export const InCard: Story = {
  args: {
    isBookmarked: false,
    onToggle: () => {},
  },
  render: function CardExample(args) {
    const [isBookmarked, setIsBookmarked] = useState(args.isBookmarked);

    return (
      <div className="border border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)] p-4 rounded max-w-xs">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-pixel text-sm text-[var(--pixel-white)]">Trading Bot</h3>
          <BookmarkButton
            {...args}
            size="sm"
            isBookmarked={isBookmarked}
            onToggle={() => setIsBookmarked(!isBookmarked)}
          />
        </div>
        <p className="text-xs text-[var(--pixel-gray-400)] font-mono">
          An AI agent for automated trading strategies
        </p>
      </div>
    );
  },
};
