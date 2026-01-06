import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WatchButton } from './watch-button';

const meta = {
  title: 'Atoms/WatchButton',
  component: WatchButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A toggle button for watching/unwatching agents. Uses blue theme colors and eye icons to indicate watch status.',
      },
    },
  },
  argTypes: {
    isWatched: {
      control: 'boolean',
      description: 'Whether the agent is currently being watched',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size variant of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
} satisfies Meta<typeof WatchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unwatched state
 */
export const Default: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
  },
};

/**
 * Active watched state with blue glow
 */
export const Watched: Story = {
  args: {
    isWatched: true,
    onToggle: () => {},
  },
};

/**
 * Extra small size for compact layouts
 */
export const ExtraSmall: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
    size: 'xs',
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
    size: 'sm',
  },
};

/**
 * Large size
 */
export const Large: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
    size: 'lg',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
    disabled: true,
  },
};

/**
 * Disabled while watched
 */
export const DisabledWatched: Story = {
  args: {
    isWatched: true,
    onToggle: () => {},
    disabled: true,
  },
};

/**
 * With custom accessible label
 */
export const CustomLabel: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
    label: 'Monitor this agent for changes',
  },
};

/**
 * Interactive demo with toggle functionality
 */
export const Interactive: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
  },
  render: () => {
    const [isWatched, setIsWatched] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <WatchButton isWatched={isWatched} onToggle={() => setIsWatched(!isWatched)} />
        <p className="text-sm text-[var(--pixel-gray-400)]">
          Status: {isWatched ? 'Watching' : 'Not watching'}
        </p>
      </div>
    );
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
  },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} size="xs" />
        <span className="text-xs text-[var(--pixel-gray-500)]">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} size="sm" />
        <span className="text-xs text-[var(--pixel-gray-500)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} size="md" />
        <span className="text-xs text-[var(--pixel-gray-500)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} size="lg" />
        <span className="text-xs text-[var(--pixel-gray-500)]">lg</span>
      </div>
    </div>
  ),
};

/**
 * All states comparison
 */
export const AllStates: Story = {
  args: {
    isWatched: false,
    onToggle: () => {},
  },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} />
        <span className="text-xs text-[var(--pixel-gray-500)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={true} onToggle={() => {}} />
        <span className="text-xs text-[var(--pixel-gray-500)]">Watched</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={false} onToggle={() => {}} disabled />
        <span className="text-xs text-[var(--pixel-gray-500)]">Disabled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WatchButton isWatched={true} onToggle={() => {}} disabled />
        <span className="text-xs text-[var(--pixel-gray-500)]">Disabled+Watched</span>
      </div>
    </div>
  ),
};
