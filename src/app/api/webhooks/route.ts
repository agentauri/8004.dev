/**
 * Webhooks API routes
 * GET /api/webhooks - List webhooks
 * POST /api/webhooks - Create webhook
 */

import { backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { CreateWebhookRequest, Webhook, WebhookWithSecret } from '@/types/webhook';

/**
 * Generate mock webhooks for development/testing
 */
function getMockWebhooks(): Webhook[] {
  return [
    {
      id: 'wh_mock_1',
      url: 'https://example.com/webhook/agents',
      events: ['agent.registered', 'agent.updated'],
      filters: { chainIds: [11155111, 84532] },
      active: true,
      description: 'Agent registration notifications',
      lastDeliveryAt: new Date(Date.now() - 3600000).toISOString(),
      lastDeliveryStatus: 'delivered',
      failureCount: 0,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: 'wh_mock_2',
      url: 'https://example.com/webhook/feedback',
      events: ['feedback.received', 'reputation.changed'],
      filters: {},
      active: true,
      description: 'Feedback and reputation notifications',
      lastDeliveryAt: new Date(Date.now() - 7200000).toISOString(),
      lastDeliveryStatus: 'delivered',
      failureCount: 0,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
}

export async function GET() {
  try {
    let webhooks: Webhook[] = [];

    try {
      const response = await backendFetch<Webhook[]>('/api/v1/webhooks', {
        cache: 'no-store', // Don't cache webhook list
      });
      webhooks = response.data;
    } catch (error) {
      // Fallback to mock data if backend not available
      if (shouldUseMockData(error)) {
        console.warn('Backend /api/v1/webhooks not available, using mock data');
        webhooks = getMockWebhooks();
      } else {
        throw error;
      }
    }

    return successResponse(webhooks, {
      meta: { total: webhooks.length },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch webhooks', 'WEBHOOKS_ERROR');
  }
}

export async function POST(request: Request) {
  try {
    let body: CreateWebhookRequest;

    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 'PARSE_ERROR', 400);
    }

    // Validate required fields
    if (!body.url) {
      return errorResponse('URL is required', 'VALIDATION_ERROR', 400);
    }
    if (!body.events || body.events.length === 0) {
      return errorResponse('At least one event type is required', 'VALIDATION_ERROR', 400);
    }

    // Validate URL format
    try {
      new URL(body.url);
    } catch {
      return errorResponse('Invalid URL format', 'VALIDATION_ERROR', 400);
    }

    let webhook: WebhookWithSecret;

    try {
      const response = await backendFetch<WebhookWithSecret>('/api/v1/webhooks', {
        method: 'POST',
        body: {
          url: body.url,
          events: body.events,
          filters: body.filters,
          description: body.description,
        },
      });
      webhook = response.data;
    } catch (error) {
      // For mock mode, return a fake webhook with secret
      if (shouldUseMockData(error)) {
        console.warn('Backend /api/v1/webhooks POST not available, using mock data');
        const now = new Date().toISOString();
        webhook = {
          id: `wh_${Date.now()}`,
          url: body.url,
          events: body.events,
          filters: body.filters ?? {},
          active: true,
          description: body.description,
          failureCount: 0,
          createdAt: now,
          secret: `mock_secret_${Math.random().toString(36).substring(2, 15)}`,
        };
      } else {
        throw error;
      }
    }

    return successResponse(webhook, {
      meta: {
        message: 'Webhook created successfully. Save the secret - it will not be shown again.',
      },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to create webhook', 'WEBHOOK_CREATE_ERROR');
  }
}
