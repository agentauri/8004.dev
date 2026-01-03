import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeEvent } from '@/types/agent';
import { EventNotification } from './event-notification';

describe('EventNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockEvent = (
    type: RealtimeEvent['type'] = 'agent.created',
    data: Record<string, unknown> = {},
  ): RealtimeEvent =>
    ({
      type,
      timestamp: new Date(),
      data: {
        agentId: '11155111:1',
        chainId: 11155111,
        tokenId: '1',
        name: 'Test Agent',
        ...data,
      },
    }) as RealtimeEvent;

  describe('rendering', () => {
    it('renders notification', () => {
      render(<EventNotification event={createMockEvent()} />);
      expect(screen.getByTestId('event-notification')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EventNotification event={createMockEvent()} className="custom-class" />);
      expect(screen.getByTestId('event-notification')).toHaveClass('custom-class');
    });

    it('has correct role attribute', () => {
      render(<EventNotification event={createMockEvent()} />);
      expect(screen.getByTestId('event-notification')).toHaveAttribute('role', 'alert');
    });

    it('renders dismiss button', () => {
      render(<EventNotification event={createMockEvent()} />);
      expect(screen.getByTestId('event-notification-dismiss')).toBeInTheDocument();
    });
  });

  describe('event types', () => {
    it('renders agent.created event', () => {
      render(<EventNotification event={createMockEvent('agent.created')} />);
      expect(screen.getByText('New Agent Registered')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('renders agent.updated event', () => {
      render(
        <EventNotification event={createMockEvent('agent.updated', { changedFields: ['name'] })} />,
      );
      expect(screen.getByText('Agent Updated')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders agent.classified event', () => {
      render(
        <EventNotification
          event={createMockEvent('agent.classified', {
            skills: ['code'],
            domains: ['tech'],
            confidence: 0.9,
          })}
        />,
      );
      expect(screen.getByText('Agent Classified')).toBeInTheDocument();
      expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('renders reputation.changed event', () => {
      render(
        <EventNotification
          event={createMockEvent('reputation.changed', {
            previousScore: 50,
            newScore: 75,
            feedbackId: 'fb-1',
          })}
        />,
      );
      expect(screen.getByText('Reputation Changed')).toBeInTheDocument();
      expect(screen.getByText('Score: 50 -> 75')).toBeInTheDocument();
    });

    it('renders evaluation.completed event', () => {
      render(
        <EventNotification
          event={createMockEvent('evaluation.completed', {
            evaluationId: 'eval-1',
            overallScore: 85,
            status: 'completed',
          })}
        />,
      );
      expect(screen.getByText('Evaluation Complete')).toBeInTheDocument();
      expect(screen.getByText('Score: 85')).toBeInTheDocument();
    });
  });

  describe('action button', () => {
    it('shows view button when agentId exists', () => {
      render(<EventNotification event={createMockEvent()} onAction={vi.fn()} />);
      expect(screen.getByTestId('event-notification-action')).toBeInTheDocument();
    });

    it('hides view button when no agentId', () => {
      // Create an event without agentId (cast to bypass type check for edge case testing)
      const event = {
        type: 'evaluation.completed' as const,
        timestamp: new Date(),
        data: {
          evaluationId: 'eval-1',
          agentId: undefined,
          overallScore: 85,
          status: 'completed' as const,
        },
      } as unknown as RealtimeEvent;
      render(<EventNotification event={event} onAction={vi.fn()} />);
      expect(screen.queryByTestId('event-notification-action')).not.toBeInTheDocument();
    });

    it('calls onAction when clicked', () => {
      const handleAction = vi.fn();
      const event = createMockEvent();
      render(<EventNotification event={event} onAction={handleAction} />);

      fireEvent.click(screen.getByTestId('event-notification-action'));
      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(handleAction).toHaveBeenCalledWith(event);
    });
  });

  describe('dismiss behavior', () => {
    it('calls onDismiss when dismiss button clicked', async () => {
      const handleDismiss = vi.fn();
      render(<EventNotification event={createMockEvent()} onDismiss={handleDismiss} />);

      fireEvent.click(screen.getByTestId('event-notification-dismiss'));

      // Wait for animation timeout
      await act(async () => {
        await vi.advanceTimersByTimeAsync(150);
      });

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses after timeout', async () => {
      const handleDismiss = vi.fn();
      render(
        <EventNotification
          event={createMockEvent()}
          onDismiss={handleDismiss}
          autoDismissMs={5000}
        />,
      );

      expect(handleDismiss).not.toHaveBeenCalled();

      // Wait for auto-dismiss timeout + animation
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5150);
      });

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-dismiss when autoDismissMs is 0', async () => {
      const handleDismiss = vi.fn();
      render(
        <EventNotification event={createMockEvent()} onDismiss={handleDismiss} autoDismissMs={0} />,
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(handleDismiss).not.toHaveBeenCalled();
    });

    it('applies exit animation class on dismiss', () => {
      render(<EventNotification event={createMockEvent()} />);

      fireEvent.click(screen.getByTestId('event-notification-dismiss'));

      expect(screen.getByTestId('event-notification')).toHaveClass('opacity-0');
      expect(screen.getByTestId('event-notification')).toHaveClass('translate-x-4');
    });
  });

  describe('styling', () => {
    it('applies green styling for agent.created', () => {
      render(<EventNotification event={createMockEvent('agent.created')} />);
      expect(screen.getByTestId('event-notification')).toHaveClass(
        'border-[var(--pixel-green-pipe)]',
      );
    });

    it('applies blue styling for agent.updated', () => {
      render(<EventNotification event={createMockEvent('agent.updated', { changedFields: [] })} />);
      expect(screen.getByTestId('event-notification')).toHaveClass(
        'border-[var(--pixel-blue-sky)]',
      );
    });

    it('applies gold styling for reputation.changed', () => {
      render(
        <EventNotification
          event={createMockEvent('reputation.changed', {
            previousScore: 50,
            newScore: 75,
            feedbackId: 'fb-1',
          })}
        />,
      );
      expect(screen.getByTestId('event-notification')).toHaveClass(
        'border-[var(--pixel-gold-coin)]',
      );
    });
  });

  describe('accessibility', () => {
    it('dismiss button has accessible label', () => {
      render(<EventNotification event={createMockEvent()} />);
      expect(screen.getByTestId('event-notification-dismiss')).toHaveAttribute(
        'aria-label',
        'Dismiss notification',
      );
    });

    it('icon is hidden from screen readers', () => {
      render(<EventNotification event={createMockEvent()} />);
      const icon = screen.getByText('+');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
