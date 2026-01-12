/**
 * Webhooks API routes
 * GET /api/webhooks - List webhooks
 * POST /api/webhooks - Create webhook
 */

import { backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';
import {
  applyRateLimit,
  errorResponse,
  handleRouteError,
  successResponse,
} from '@/lib/api/route-helpers';
import type { CreateWebhookRequest, Webhook, WebhookWithSecret } from '@/types/webhook';

/**
 * Private IP ranges for SSRF protection
 */
const PRIVATE_IP_PATTERNS = [
  /^127\./, // Loopback (127.0.0.0/8)
  /^10\./, // Class A private (10.0.0.0/8)
  /^192\.168\./, // Class C private (192.168.0.0/16)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private (172.16.0.0/12)
  /^169\.254\./, // Link-local (169.254.0.0/16)
  /^0\./, // Current network (0.0.0.0/8)
  /^fc[0-9a-f][0-9a-f]:/i, // IPv6 unique local
  /^fd[0-9a-f][0-9a-f]:/i, // IPv6 unique local
  /^fe80:/i, // IPv6 link-local
  /^::1$/, // IPv6 loopback
];

const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '::1',
  'metadata.google.internal', // GCP metadata
  '169.254.169.254', // AWS/GCP/Azure metadata
  'metadata.azure.com', // Azure metadata
];

/**
 * Validate webhook URL for SSRF protection
 * Returns null if valid, error message if invalid
 */
function validateWebhookUrl(urlString: string): string | null {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return 'Invalid URL format';
  }

  // Require HTTPS only
  if (url.protocol !== 'https:') {
    return 'Only HTTPS URLs are allowed for webhooks';
  }

  // Check for blocked hostnames
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return 'Blocked hostname: webhook URLs cannot target localhost or metadata endpoints';
  }

  // Check if hostname is an IP address matching private ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return 'Blocked IP range: webhook URLs cannot target private or internal IP addresses';
    }
  }

  // Block URLs with user info (user:pass@host)
  if (url.username || url.password) {
    return 'URLs with embedded credentials are not allowed';
  }

  return null; // Valid
}

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

export async function GET(request: Request) {
  // Apply rate limiting
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

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
  // Apply rate limiting (stricter for mutations)
  const rateLimitResponse = applyRateLimit(request, RATE_LIMIT_CONFIGS.mutation);
  if (rateLimitResponse) return rateLimitResponse;

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

    // Validate URL with SSRF protection
    const urlValidationError = validateWebhookUrl(body.url);
    if (urlValidationError) {
      return errorResponse(urlValidationError, 'VALIDATION_ERROR', 400);
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
