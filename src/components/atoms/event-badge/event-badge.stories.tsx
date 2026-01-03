import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EventBadge } from './event-badge';

const meta = {
  title: 'Atoms/EventBadge',
  component: EventBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a notification badge with event count and real-time connection status. Shows a pulsing indicator when connected to the event stream.',
      },
    },
  },
  argTypes: {
    count: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'Number of unread events',
    },
    isConnected: {
      control: 'boolean',
      description: 'Whether connected to the event stream',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler for opening event panel',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof EventBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    count: 0,
    isConnected: true,
  },
};

export const ConnectedWithEvents: Story = {
  args: {
    count: 5,
    isConnected: true,
  },
};

export const ManyEvents: Story = {
  args: {
    count: 42,
    isConnected: true,
  },
};

export const OverflowCount: Story = {
  args: {
    count: 150,
    isConnected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When count exceeds 99, displays "99+" to save space.',
      },
    },
  },
};

export const Disconnected: Story = {
  args: {
    count: 0,
    isConnected: false,
  },
};

export const DisconnectedWithEvents: Story = {
  args: {
    count: 12,
    isConnected: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'When disconnected, the badge is disabled and shows the last known count.',
      },
    },
  },
};

export const AllStates: Story = {
  args: {
    count: 0,
    isConnected: true,
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={0} isConnected={true} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Connected, No Events</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={5} isConnected={true} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Connected, 5 Events</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={99} isConnected={true} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Connected, 99 Events</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={150} isConnected={true} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Connected, 99+ Events</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={0} isConnected={false} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Disconnected</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EventBadge count={8} isConnected={false} />
        <span className="text-[var(--pixel-gray-400)] text-xs">Disconnected, Pending</span>
      </div>
    </div>
  ),
};

export const InHeaderContext: Story = {
  args: {
    count: 3,
    isConnected: true,
  },
  render: (args) => (
    <div className="flex items-center gap-4 px-4 py-3 bg-[var(--pixel-gray-900)] border-b-2 border-[var(--pixel-gray-700)]">
      <span className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
        8004<span className="text-[var(--pixel-primary)]">.dev</span>
      </span>
      <div className="flex-1" />
      <EventBadge {...args} />
      <button
        type="button"
        className="px-3 py-1.5 border-2 border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)] text-xs uppercase"
      >
        Connect MCP
      </button>
    </div>
  ),
};
