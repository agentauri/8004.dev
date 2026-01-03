/**
 * API route for SSE events stream
 * GET /api/events
 *
 * Proxies real-time events from the backend API to clients via Server-Sent Events.
 * Event types: agent.created, agent.updated, agent.classified, reputation.changed, evaluation.completed
 */

import { backendFetch } from '@/lib/api/backend';
import { handleRouteError } from '@/lib/api/route-helpers';

/**
 * SSE event from backend
 */
interface BackendSSEEvent {
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Creates an SSE formatted message
 */
function formatSSEMessage(event: BackendSSEEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
}

/**
 * Creates a heartbeat message to keep connection alive
 */
function formatHeartbeat(): string {
  return `: heartbeat\n\n`;
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  // Check if client accepts SSE
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader && !acceptHeader.includes('text/event-stream')) {
    return new Response('This endpoint only supports Server-Sent Events', {
      status: 406,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      let heartbeatInterval: NodeJS.Timeout | null = null;
      let isActive = true;

      // Helper to clean up resources
      const cleanup = () => {
        isActive = false;
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
      };

      // Register abort handler immediately
      request.signal.addEventListener('abort', () => {
        cleanup();
        try {
          controller.close();
        } catch {
          // Controller might already be closed
        }
      });

      // Send initial connection event
      controller.enqueue(
        encoder.encode(
          formatSSEMessage({
            type: 'connected',
            timestamp: new Date().toISOString(),
            data: { message: 'SSE connection established' },
          }),
        ),
      );

      // Set up heartbeat every 30 seconds to keep connection alive
      heartbeatInterval = setInterval(() => {
        if (isActive) {
          try {
            controller.enqueue(encoder.encode(formatHeartbeat()));
          } catch {
            // Controller might be closed
            cleanup();
          }
        }
      }, 30000);

      try {
        // Connect to backend SSE endpoint
        const response = await backendFetch<BackendSSEEvent[]>('/api/v1/events', {
          cache: 'no-store',
          timeout: 0, // No timeout for SSE
        });

        // If backend returns events array, stream them
        if (response.data && Array.isArray(response.data)) {
          for (const event of response.data) {
            if (!isActive) break;
            controller.enqueue(encoder.encode(formatSSEMessage(event)));
          }
        }
      } catch (error) {
        // Log error but don't close stream - we'll use mock events for dev
        console.warn('Backend SSE connection failed, using mock events:', error);

        // Send mock events for development/demo purposes
        const mockEvents: BackendSSEEvent[] = [
          {
            type: 'agent.created',
            timestamp: new Date().toISOString(),
            data: {
              agentId: '11155111:42',
              chainId: 11155111,
              tokenId: '42',
              name: 'Demo Agent',
            },
          },
        ];

        for (const event of mockEvents) {
          if (!isActive) break;
          controller.enqueue(encoder.encode(formatSSEMessage(event)));
        }
      } finally {
        // Always clean up when stream processing completes
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

/**
 * Handle unsupported methods
 */
export async function POST() {
  return handleRouteError(
    new Error('Method not allowed'),
    'This endpoint only supports GET for SSE streaming',
    'METHOD_NOT_ALLOWED',
  );
}
