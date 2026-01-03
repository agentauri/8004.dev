import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { RealtimeEvent } from '@/types/agent';
import { EventNotification } from './event-notification';

const meta = {
  title: 'Organisms/EventNotification',
  component: EventNotification,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toast-style notification for real-time events. Features auto-dismiss, action button, and retro pixel styling with glow effects.',
      },
    },
  },
  argTypes: {
    event: {
      description: 'The realtime event to display',
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Called when notification is dismissed',
    },
    onAction: {
      action: 'action clicked',
      description: 'Called when view action is clicked',
    },
    autoDismissMs: {
      control: { type: 'number', min: 0, max: 30000, step: 1000 },
      description: 'Auto-dismiss timeout in milliseconds (0 to disable)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

const createEvent = (
  type: RealtimeEvent['type'],
  data: Record<string, unknown> = {},
): RealtimeEvent =>
  ({
    type,
    timestamp: new Date(),
    data: {
      agentId: '11155111:42',
      chainId: 11155111,
      tokenId: '42',
      name: 'AI Assistant Pro',
      ...data,
    },
  }) as RealtimeEvent;

export const AgentCreated: Story = {
  args: {
    event: createEvent('agent.created'),
    autoDismissMs: 0,
  },
};

export const AgentUpdated: Story = {
  args: {
    event: createEvent('agent.updated', { changedFields: ['description', 'endpoints'] }),
    autoDismissMs: 0,
  },
};

export const AgentClassified: Story = {
  args: {
    event: createEvent('agent.classified', {
      skills: ['code_generation', 'debugging'],
      domains: ['technology', 'software'],
      confidence: 0.92,
    }),
    autoDismissMs: 0,
  },
};

export const ReputationChanged: Story = {
  args: {
    event: createEvent('reputation.changed', {
      previousScore: 65,
      newScore: 78,
      feedbackId: 'fb-12345',
    }),
    autoDismissMs: 0,
  },
};

export const EvaluationCompleted: Story = {
  args: {
    event: createEvent('evaluation.completed', {
      evaluationId: 'eval-67890',
      overallScore: 92,
      status: 'completed',
    }),
    autoDismissMs: 0,
  },
};

export const EvaluationFailed: Story = {
  args: {
    event: createEvent('evaluation.completed', {
      evaluationId: 'eval-67890',
      overallScore: 0,
      status: 'failed',
    }),
    autoDismissMs: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Evaluation that failed shows a different message.',
      },
    },
  },
};

export const WithAutoDissmiss: Story = {
  args: {
    event: createEvent('agent.created'),
    autoDismissMs: 5000,
  },
  parameters: {
    docs: {
      description: {
        story: 'This notification will auto-dismiss after 5 seconds.',
      },
    },
  },
};

export const AllEventTypes: Story = {
  args: {
    event: createEvent('agent.created'),
    autoDismissMs: 0,
  },
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <EventNotification event={createEvent('agent.created')} autoDismissMs={0} />
      <EventNotification
        event={createEvent('agent.updated', { changedFields: ['name'] })}
        autoDismissMs={0}
      />
      <EventNotification
        event={createEvent('agent.classified', {
          skills: ['analysis'],
          domains: ['finance'],
          confidence: 0.88,
        })}
        autoDismissMs={0}
      />
      <EventNotification
        event={createEvent('reputation.changed', {
          previousScore: 50,
          newScore: 75,
          feedbackId: 'fb-1',
        })}
        autoDismissMs={0}
      />
      <EventNotification
        event={createEvent('evaluation.completed', {
          evaluationId: 'eval-1',
          overallScore: 85,
          status: 'completed',
        })}
        autoDismissMs={0}
      />
    </div>
  ),
};

export const InBottomRightContext: Story = {
  args: {
    event: createEvent('agent.created'),
    autoDismissMs: 0,
  },
  render: (args) => (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 w-80 pointer-events-auto">
        <EventNotification {...args} />
        <EventNotification
          event={createEvent('reputation.changed', {
            previousScore: 50,
            newScore: 75,
            feedbackId: 'fb-1',
          })}
          autoDismissMs={0}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Notifications positioned in the bottom-right corner, as they would appear in the app.',
      },
    },
  },
};
