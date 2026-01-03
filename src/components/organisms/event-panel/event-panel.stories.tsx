import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { RealtimeEvent } from '@/types/agent';
import { EventPanel } from './event-panel';

const mockEvents: RealtimeEvent[] = [
  {
    type: 'agent.created',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    data: {
      agentId: '11155111:1',
      chainId: 11155111,
      tokenId: '1',
      name: 'Code Review Assistant',
    },
  },
  {
    type: 'agent.updated',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    data: {
      agentId: '84532:2',
      changedFields: ['description', 'metadata'],
    },
  },
  {
    type: 'reputation.changed',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    data: {
      agentId: '80002:3',
      previousScore: 75,
      newScore: 82,
      feedbackId: 'feedback-123',
    },
  },
  {
    type: 'evaluation.completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    data: {
      evaluationId: 'eval-123',
      agentId: '11155111:4',
      status: 'completed',
      overallScore: 92,
    },
  },
  {
    type: 'agent.classified',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    data: {
      agentId: '84532:5',
      skills: ['code-review', 'testing'],
      domains: ['development'],
      confidence: 0.95,
    },
  },
];

const noop = () => {};

const meta = {
  title: 'Organisms/EventPanel',
  component: EventPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays a dropdown panel of recent real-time events. Shows event type, description, and timestamp with click-to-navigate functionality.',
      },
    },
  },
  argTypes: {
    events: {
      description: 'List of events to display',
    },
    onClear: {
      action: 'clear',
      description: 'Handler to clear all events',
    },
    onEventClick: {
      action: 'eventClick',
      description: 'Handler when an event is clicked',
    },
    onClose: {
      action: 'close',
      description: 'Handler to close the panel',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="relative w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: mockEvents,
    onClear: noop,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    onClear: noop,
  },
  parameters: {
    docs: {
      description: {
        story: 'When there are no events, shows an empty state message.',
      },
    },
  },
};

export const SingleEvent: Story = {
  args: {
    events: [mockEvents[0]],
    onClear: noop,
  },
};

export const ManyEvents: Story = {
  args: {
    events: [
      ...mockEvents,
      {
        type: 'agent.created',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        data: {
          agentId: '11155111:6',
          chainId: 11155111,
          tokenId: '6',
          name: 'Data Processor Agent',
        },
      },
      {
        type: 'agent.created',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
        data: {
          agentId: '84532:7',
          chainId: 84532,
          tokenId: '7',
          name: 'Task Scheduler',
        },
      },
      {
        type: 'reputation.changed',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        data: {
          agentId: '80002:8',
          previousScore: 60,
          newScore: 75,
          feedbackId: 'feedback-456',
        },
      },
    ] as RealtimeEvent[],
    onClear: noop,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel scrolls when there are many events.',
      },
    },
  },
};

export const WithCloseButton: Story = {
  args: {
    events: mockEvents,
    onClear: noop,
    onClose: () => console.log('Close clicked'),
  },
};

export const AllEventTypes: Story = {
  args: {
    events: [
      {
        type: 'agent.created',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        data: {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'New Agent Example',
        },
      },
      {
        type: 'agent.updated',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        data: {
          agentId: '84532:2',
          changedFields: ['metadata'],
        },
      },
      {
        type: 'agent.classified',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        data: {
          agentId: '80002:3',
          skills: ['analysis'],
          domains: ['finance'],
          confidence: 0.88,
        },
      },
      {
        type: 'reputation.changed',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        data: {
          agentId: '11155111:4',
          previousScore: 50,
          newScore: 65,
          feedbackId: 'feedback-789',
        },
      },
      {
        type: 'evaluation.completed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        data: {
          evaluationId: 'eval-abc',
          agentId: '84532:5',
          status: 'completed',
          overallScore: 88,
        },
      },
    ] as RealtimeEvent[],
    onClear: noop,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all different event types with their respective styling.',
      },
    },
  },
};

export const InHeaderContext: Story = {
  args: {
    events: mockEvents.slice(0, 3),
    onClear: noop,
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--pixel-gray-900)] p-4 rounded">
        <div className="flex items-center justify-end gap-4">
          <span className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
            8004<span className="text-[var(--pixel-primary)]">.dev</span>
          </span>
          <div className="flex-1" />
          <div className="relative">
            <button
              type="button"
              className="px-2 py-1.5 border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] text-xs"
            >
              Events (3)
            </button>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows how the panel appears when opened from the header.',
      },
    },
  },
};
