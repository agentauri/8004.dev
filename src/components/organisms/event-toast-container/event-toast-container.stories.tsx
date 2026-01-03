import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { EventNotification } from '@/components/organisms/event-notification';
import type { RealtimeEvent } from '@/types/agent';
import { EventToastContainer } from './event-toast-container';

// Create a demo version that doesn't rely on SSE for Storybook
function DemoToastContainer({
  position = 'bottom-right',
  maxToasts = 3,
}: {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}) {
  const [toasts, setToasts] = useState<RealtimeEvent[]>([]);

  const addToast = (type: RealtimeEvent['type']) => {
    const newEvent = createEvent(type);
    setToasts((prev) => [newEvent, ...prev].slice(0, maxToasts));
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const stackDirection = position.startsWith('top') ? 'flex-col' : 'flex-col-reverse';

  return (
    <div className="relative h-[500px] bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-700)]">
      {/* Controls */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addToast('agent.created')}
          className="px-3 py-1.5 bg-[var(--pixel-green-pipe)] text-[var(--pixel-black)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        >
          + Agent Created
        </button>
        <button
          type="button"
          onClick={() => addToast('agent.updated')}
          className="px-3 py-1.5 bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        >
          * Agent Updated
        </button>
        <button
          type="button"
          onClick={() => addToast('reputation.changed')}
          className="px-3 py-1.5 bg-[var(--pixel-gold-coin)] text-[var(--pixel-black)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        >
          ^ Reputation
        </button>
        <button
          type="button"
          onClick={() => addToast('evaluation.completed')}
          className="px-3 py-1.5 bg-[var(--pixel-red-fire)] text-[var(--pixel-white)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        >
          ! Evaluation
        </button>
        <button
          type="button"
          onClick={() => setToasts([])}
          className="px-3 py-1.5 border border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        >
          Clear All
        </button>
      </div>

      {/* Toast container */}
      {toasts.length > 0 && (
        <div className={`absolute flex gap-2 w-80 ${positionClasses[position]} ${stackDirection}`}>
          {toasts.map((event, index) => (
            <div
              key={`${event.type}-${event.timestamp.getTime()}-${index}`}
              className="animate-in slide-in-from-right-full fade-in duration-200"
            >
              <EventNotification
                event={event}
                onDismiss={() => removeToast(index)}
                autoDismissMs={5000}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function createEvent(type: RealtimeEvent['type']): RealtimeEvent {
  const eventData: Record<RealtimeEvent['type'], Record<string, unknown>> = {
    'agent.created': {
      agentId: `11155111:${Math.floor(Math.random() * 1000)}`,
      chainId: 11155111,
      tokenId: String(Math.floor(Math.random() * 1000)),
      name: `Agent ${Math.floor(Math.random() * 1000)}`,
    },
    'agent.updated': {
      agentId: '11155111:42',
      changedFields: ['description', 'endpoints'],
    },
    'agent.classified': {
      agentId: '11155111:42',
      skills: ['code_generation'],
      domains: ['technology'],
      confidence: 0.92,
    },
    'reputation.changed': {
      agentId: '11155111:42',
      previousScore: 65 + Math.floor(Math.random() * 20),
      newScore: 75 + Math.floor(Math.random() * 20),
      feedbackId: 'fb-12345',
    },
    'evaluation.completed': {
      evaluationId: 'eval-67890',
      agentId: '11155111:42',
      overallScore: 80 + Math.floor(Math.random() * 20),
      status: 'completed',
    },
  };

  return {
    type,
    timestamp: new Date(),
    data: eventData[type],
  } as unknown as RealtimeEvent;
}

const meta = {
  title: 'Organisms/EventToastContainer',
  component: EventToastContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Container for displaying incoming real-time events as toast notifications. Positions toasts in screen corners with animated entrance and stacking.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the toast container',
    },
    maxToasts: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of toasts to display',
    },
    autoDismissMs: {
      control: { type: 'number', min: 0, max: 30000, step: 1000 },
      description: 'Auto-dismiss timeout in milliseconds',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof EventToastContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    position: 'bottom-right',
    maxToasts: 3,
  },
  render: (args) => <DemoToastContainer {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Click the buttons to simulate incoming events and see the toast behavior.',
      },
    },
  },
};

export const BottomRight: Story = {
  args: {
    position: 'bottom-right',
    maxToasts: 3,
  },
  render: (args) => <DemoToastContainer {...args} />,
};

export const TopRight: Story = {
  args: {
    position: 'top-right',
    maxToasts: 3,
  },
  render: (args) => <DemoToastContainer {...args} />,
};

export const BottomLeft: Story = {
  args: {
    position: 'bottom-left',
    maxToasts: 3,
  },
  render: (args) => <DemoToastContainer {...args} />,
};

export const TopLeft: Story = {
  args: {
    position: 'top-left',
    maxToasts: 3,
  },
  render: (args) => <DemoToastContainer {...args} />,
};

export const SingleToast: Story = {
  args: {
    position: 'bottom-right',
    maxToasts: 1,
  },
  render: (args) => <DemoToastContainer {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'With maxToasts=1, only the most recent event is shown.',
      },
    },
  },
};

export const ManyToasts: Story = {
  args: {
    position: 'bottom-right',
    maxToasts: 5,
  },
  render: (args) => <DemoToastContainer {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'With maxToasts=5, more events are visible at once.',
      },
    },
  },
};
