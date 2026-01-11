/**
 * Individual webhook API routes
 * GET /api/webhooks/:id - Get webhook details
 * DELETE /api/webhooks/:id - Delete webhook
 * POST /api/webhooks/:id/test - Test webhook (if path ends with /test)
 */

import { backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { WebhookTestResult, WebhookWithDeliveries } from '@/types/webhook';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Generate mock webhook details for development/testing
 */
function getMockWebhookDetails(id: string): WebhookWithDeliveries {
  return {
    id,
    url: 'https://example.com/webhook',
    events: ['agent.registered', 'agent.updated'],
    filters: { chainIds: [11155111] },
    active: true,
    description: 'Mock webhook for testing',
    lastDeliveryAt: new Date(Date.now() - 3600000).toISOString(),
    lastDeliveryStatus: 'delivered',
    failureCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    recentDeliveries: [
      {
        id: 'del_1',
        eventType: 'agent.registered',
        status: 'delivered',
        attempts: 1,
        responseStatus: 200,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'del_2',
        eventType: 'agent.updated',
        status: 'delivered',
        attempts: 1,
        responseStatus: 200,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    let webhook: WebhookWithDeliveries;

    try {
      const response = await backendFetch<WebhookWithDeliveries>(`/api/v1/webhooks/${id}`, {
        cache: 'no-store',
      });
      webhook = response.data;
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.warn(`Backend /api/v1/webhooks/${id} not available, using mock data`);
        webhook = getMockWebhookDetails(id);
      } else {
        throw error;
      }
    }

    return successResponse(webhook);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch webhook', 'WEBHOOK_FETCH_ERROR');
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      await backendFetch<void>(`/api/v1/webhooks/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.warn(`Backend /api/v1/webhooks/${id} DELETE not available, using mock`);
        // Mock successful deletion
      } else {
        throw error;
      }
    }

    return successResponse(null, {
      meta: { message: 'Webhook deleted successfully' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to delete webhook', 'WEBHOOK_DELETE_ERROR');
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if this is a test request
    const url = new URL(request.url);
    const isTestRequest = url.pathname.endsWith('/test');

    if (!isTestRequest) {
      return errorResponse('Invalid request', 'INVALID_REQUEST', 400);
    }

    let result: WebhookTestResult;

    try {
      const response = await backendFetch<WebhookTestResult>(`/api/v1/webhooks/${id}/test`, {
        method: 'POST',
      });
      result = response.data;
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.warn(`Backend /api/v1/webhooks/${id}/test not available, using mock`);
        result = {
          delivered: true,
          responseStatus: 200,
          responseBody: '{"status": "ok"}',
        };
      } else {
        throw error;
      }
    }

    return successResponse(result, {
      meta: {
        message: result.delivered
          ? 'Test webhook delivered successfully'
          : 'Test webhook delivery failed',
      },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to test webhook', 'WEBHOOK_TEST_ERROR');
  }
}
