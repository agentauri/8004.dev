import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import { EventToastContainer } from './event-toast-container';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock EventSource
class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  listeners: Map<string, ((e: MessageEvent) => void)[]> = new Map();
  readyState = 0;

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
    }, 0);
  }

  addEventListener(type: string, handler: (e: MessageEvent) => void) {
    const handlers = this.listeners.get(type) || [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  removeEventListener() {}

  dispatchEvent(type: string, data: unknown) {
    const handlers = this.listeners.get(type) || [];
    const event = new MessageEvent(type, { data: JSON.stringify(data) });
    for (const handler of handlers) {
      handler(event);
    }
  }

  close() {
    this.readyState = 2;
    const index = MockEventSource.instances.indexOf(this);
    if (index > -1) {
      MockEventSource.instances.splice(index, 1);
    }
  }

  static reset() {
    for (const instance of MockEventSource.instances) {
      instance.close();
    }
    MockEventSource.instances = [];
  }

  static getLatest(): MockEventSource | undefined {
    return MockEventSource.instances[MockEventSource.instances.length - 1];
  }
}

const originalEventSource = globalThis.EventSource;

describe('EventToastContainer', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.useFakeTimers();
    MockEventSource.reset();
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource;
    mockPush.mockClear();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.EventSource = originalEventSource;
    MockEventSource.reset();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <RealtimeEventsProvider>{children}</RealtimeEventsProvider>
        </QueryClientProvider>
      );
    };
  };

  describe('rendering', () => {
    it('does not render when no events', async () => {
      render(<EventToastContainer />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(screen.queryByTestId('event-toast-container')).not.toBeInTheDocument();
    });

    it('renders container when event received', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'Test Agent',
        });
      });

      expect(screen.getByTestId('event-toast-container')).toBeInTheDocument();
      expect(screen.getByTestId('event-toast-0')).toBeInTheDocument();
    });

    it('applies custom className', async () => {
      render(<EventToastContainer className="custom-class" autoDismissMs={0} />, {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      expect(screen.getByTestId('event-toast-container')).toHaveClass('custom-class');
    });
  });

  describe('position', () => {
    it('positions bottom-right by default', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      const container = screen.getByTestId('event-toast-container');
      expect(container).toHaveClass('bottom-4');
      expect(container).toHaveClass('right-4');
    });

    it('positions top-right when specified', async () => {
      render(<EventToastContainer position="top-right" autoDismissMs={0} />, {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      const container = screen.getByTestId('event-toast-container');
      expect(container).toHaveClass('top-4');
      expect(container).toHaveClass('right-4');
    });
  });

  describe('toast management', () => {
    it('shows multiple toasts for multiple events', async () => {
      render(<EventToastContainer maxToasts={3} autoDismissMs={0} />, {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      // Send first event
      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'Agent 1',
        });
      });

      // Advance time so the timestamp differs
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Send second event
      await act(async () => {
        eventSource?.dispatchEvent('agent.updated', {
          agentId: '11155111:2',
          changedFields: ['name'],
        });
      });

      // Check we have at least one toast
      expect(screen.getByTestId('event-toast-0')).toBeInTheDocument();
    });

    it('removes toast when dismissed', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      expect(screen.getByTestId('event-toast-0')).toBeInTheDocument();

      // Click dismiss button
      const dismissButton = screen.getByTestId('event-notification-dismiss');
      fireEvent.click(dismissButton);

      // Wait for animation
      await act(async () => {
        await vi.advanceTimersByTimeAsync(150);
      });

      expect(screen.queryByTestId('event-toast-0')).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to agent page on action click', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:42',
          name: 'Test Agent',
        });
      });

      const actionButton = screen.getByTestId('event-notification-action');
      fireEvent.click(actionButton);

      expect(mockPush).toHaveBeenCalledWith('/agent/11155111:42');
    });
  });

  describe('accessibility', () => {
    it('has correct role', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      expect(screen.getByTestId('event-toast-container')).toHaveAttribute('role', 'region');
    });

    it('has accessible label', async () => {
      render(<EventToastContainer autoDismissMs={0} />, { wrapper: createWrapper() });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          name: 'Test',
        });
      });

      expect(screen.getByTestId('event-toast-container')).toHaveAttribute(
        'aria-label',
        'Event notifications',
      );
    });
  });
});
