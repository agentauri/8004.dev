import type { Meta, StoryObj } from '@storybook/react';
import type { KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { ShortcutsModal } from './shortcuts-modal';

const meta = {
  title: 'Organisms/ShortcutsModal',
  component: ShortcutsModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal displaying all available keyboard shortcuts. Press ? to open this modal in the app.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is visible',
    },
    onClose: {
      action: 'closed',
      description: 'Called when the modal is closed',
    },
    shortcuts: {
      description: 'Array of keyboard shortcuts to display',
    },
  },
} satisfies Meta<typeof ShortcutsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockShortcuts: KeyboardShortcut[] = [
  {
    id: 'search-focus',
    description: 'Focus search input',
    keys: 'Ctrl+K',
    category: 'search',
    handler: () => {},
  },
  {
    id: 'clear-search',
    description: 'Clear search',
    keys: 'Ctrl+Shift+K',
    category: 'search',
    handler: () => {},
  },
  {
    id: 'toggle-filters',
    description: 'Toggle filters panel',
    keys: 'F',
    category: 'search',
    handler: () => {},
  },
  {
    id: 'go-home',
    description: 'Go to home page',
    keys: 'G',
    category: 'navigation',
    handler: () => {},
  },
  {
    id: 'go-explore',
    description: 'Go to explore page',
    keys: 'E',
    category: 'navigation',
    handler: () => {},
  },
  {
    id: 'next-result',
    description: 'Next search result',
    keys: 'ArrowDown',
    category: 'navigation',
    handler: () => {},
  },
  {
    id: 'prev-result',
    description: 'Previous search result',
    keys: 'ArrowUp',
    category: 'navigation',
    handler: () => {},
  },
  {
    id: 'select-result',
    description: 'Open selected agent',
    keys: 'Enter',
    category: 'actions',
    handler: () => {},
  },
  {
    id: 'copy-link',
    description: 'Copy agent link',
    keys: 'Ctrl+C',
    category: 'actions',
    handler: () => {},
  },
];

/**
 * Default modal with common shortcuts.
 */
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    shortcuts: mockShortcuts,
  },
};

/**
 * Modal with no custom shortcuts (only built-in).
 */
export const BuiltInOnly: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    shortcuts: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Even with no custom shortcuts, the modal shows built-in shortcuts like ? for help and Escape to close.',
      },
    },
  },
};

/**
 * Modal with only search shortcuts.
 */
export const SearchShortcuts: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    shortcuts: mockShortcuts.filter((s) => s.category === 'search'),
  },
};

/**
 * Modal with only navigation shortcuts.
 */
export const NavigationShortcuts: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    shortcuts: mockShortcuts.filter((s) => s.category === 'navigation'),
  },
};

/**
 * Closed state (invisible).
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    shortcuts: mockShortcuts,
  },
  parameters: {
    docs: {
      description: {
        story: 'When isOpen is false, the modal renders nothing.',
      },
    },
  },
};
