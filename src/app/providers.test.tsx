import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRealtimeEvents } from '@/hooks/use-realtime-events';
import { Providers } from './providers';

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
    // Simulate connection
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
}

const originalEventSource = globalThis.EventSource;

// Test component to verify QueryClient is available
function TestComponent() {
  const queryClient = useQueryClient();
  return (
    <div data-testid="test-component">
      {queryClient ? 'QueryClient Available' : 'No QueryClient'}
    </div>
  );
}

// Test component to verify RealtimeEventsProvider is available
function RealtimeTestComponent() {
  const { isConnected } = useRealtimeEvents();
  return (
    <div data-testid="realtime-test">
      {isConnected !== undefined ? 'RealtimeEvents Available' : 'No RealtimeEvents'}
    </div>
  );
}

describe('Providers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    MockEventSource.reset();
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource;
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.EventSource = originalEventSource;
    MockEventSource.reset();
  });

  describe('QueryClientProvider', () => {
    it('provides QueryClient to children', () => {
      render(
        <Providers>
          <TestComponent />
        </Providers>,
      );

      expect(screen.getByTestId('test-component')).toHaveTextContent('QueryClient Available');
    });

    it('renders children correctly', () => {
      render(
        <Providers>
          <div data-testid="child">Child Content</div>
        </Providers>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Providers>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </Providers>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });

  describe('RealtimeEventsProvider', () => {
    it('provides RealtimeEvents context to children', () => {
      render(
        <Providers>
          <RealtimeTestComponent />
        </Providers>,
      );

      expect(screen.getByTestId('realtime-test')).toHaveTextContent('RealtimeEvents Available');
    });

    it('connects to SSE endpoint on mount', async () => {
      render(
        <Providers>
          <div>Test</div>
        </Providers>,
      );

      await vi.runAllTimersAsync();

      expect(MockEventSource.instances).toHaveLength(1);
      expect(MockEventSource.instances[0].url).toBe('/api/events');
    });
  });
});
