/**
 * MSW request handlers for mocking the 8004.dev backend API
 *
 * These handlers intercept server-side requests from Next.js API routes
 * to the backend API (api.8004.dev), allowing E2E tests to run without
 * requiring a real backend connection.
 */

import { HttpResponse, http } from 'msw';
import {
  filterBackendAgents,
  getBackendAgent,
  getMockBackendReputation,
  getMockBackendSimilarAgents,
  getMockBackendValidations,
  mockBackendStats,
  mockBackendTaxonomy,
} from './backend-mock-data';

// Backend API base URL
const BACKEND_API_URL = 'https://api.8004.dev';

/**
 * MSW handlers for the 8004.dev backend API
 */
export const handlers = [
  // Health check endpoint
  http.get(`${BACKEND_API_URL}/api/v1/health`, () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        cache: 'ok',
        search: 'ok',
      },
    });
  }),

  // Search endpoint (POST)
  http.post(`${BACKEND_API_URL}/api/v1/search`, async ({ request }) => {
    const body = (await request.json()) as {
      query?: string;
      limit?: number;
      filters?: {
        chainIds?: number[];
        active?: boolean;
        mcp?: boolean;
        a2a?: boolean;
        x402?: boolean;
      };
    };

    const query = body.query || '';
    const limit = body.limit || 20;
    const filters = body.filters;

    const results = filterBackendAgents(query, filters).slice(0, limit);

    return HttpResponse.json({
      success: true,
      data: results,
      meta: {
        query,
        total: results.length,
        limit,
      },
    });
  }),

  // Streaming search endpoint (POST) - Returns SSE events
  http.post(`${BACKEND_API_URL}/api/v1/search/stream`, async ({ request }) => {
    const body = (await request.json()) as {
      query?: string;
      limit?: number;
      filters?: {
        chainIds?: number[];
        mcp?: boolean;
        a2a?: boolean;
        minReputation?: number;
      };
    };

    const query = body.query || '';
    const limit = body.limit || 20;
    const filters = body.filters;

    const results = filterBackendAgents(query, filters).slice(0, limit);

    // Build SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send metadata event first
        const metaEvent = `data: ${JSON.stringify({
          type: 'meta',
          data: { query, total: results.length, hydeQuery: `Enhanced: ${query}` },
        })}\n\n`;
        controller.enqueue(encoder.encode(metaEvent));

        // Send each result as a separate event
        for (const result of results) {
          const resultEvent = `data: ${JSON.stringify({ type: 'result', data: result })}\n\n`;
          controller.enqueue(encoder.encode(resultEvent));
        }

        // Send done event
        const doneEvent = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
        controller.enqueue(encoder.encode(doneEvent));

        controller.close();
      },
    });

    return new HttpResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),

  // Agents list endpoint (GET)
  http.get(`${BACKEND_API_URL}/api/v1/agents`, ({ request }) => {
    const url = new URL(request.url);
    const chainIds = url.searchParams.get('chainIds[]');
    const mcp = url.searchParams.get('mcp');
    const a2a = url.searchParams.get('a2a');
    const x402 = url.searchParams.get('x402');
    const active = url.searchParams.get('active');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    const filters: {
      chainIds?: number[];
      active?: boolean;
      mcp?: boolean;
      a2a?: boolean;
      x402?: boolean;
    } = {};

    if (chainIds) {
      filters.chainIds = chainIds.split(',').map(Number);
    }
    if (mcp === 'true') filters.mcp = true;
    if (a2a === 'true') filters.a2a = true;
    if (x402 === 'true') filters.x402 = true;
    if (active === 'true') filters.active = true;

    const results = filterBackendAgents('', filters).slice(0, limit);

    return HttpResponse.json({
      success: true,
      data: results,
      meta: {
        total: results.length,
        limit,
        hasMore: false,
      },
    });
  }),

  // Agent detail endpoint (GET /api/v1/agents/:agentId)
  // Note: agentId format is "chainId:tokenId" (e.g., "11155111:1")
  http.get(`${BACKEND_API_URL}/api/v1/agents/:agentId`, ({ params }) => {
    const agentId = params.agentId as string;

    // Skip if this looks like a sub-resource request (has more path segments)
    if (agentId.includes('/')) {
      return;
    }

    const agent = getBackendAgent(agentId);

    if (!agent) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Agent not found',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: agent,
    });
  }),

  // Agent reputation endpoint
  http.get(`${BACKEND_API_URL}/api/v1/agents/:agentId/reputation`, ({ params }) => {
    const agentId = params.agentId as string;

    return HttpResponse.json({
      success: true,
      data: getMockBackendReputation(agentId),
    });
  }),

  // Agent validations endpoint
  http.get(`${BACKEND_API_URL}/api/v1/agents/:agentId/validations`, ({ params }) => {
    const agentId = params.agentId as string;

    return HttpResponse.json({
      success: true,
      data: getMockBackendValidations(agentId),
    });
  }),

  // Similar agents endpoint
  // Note: Backend returns array directly in data field
  http.get(`${BACKEND_API_URL}/api/v1/agents/:agentId/similar`, ({ params }) => {
    const agentId = params.agentId as string;
    const similarAgents = getMockBackendSimilarAgents(agentId);

    return HttpResponse.json({
      success: true,
      data: similarAgents,
    });
  }),

  // Stats endpoint
  http.get(`${BACKEND_API_URL}/api/v1/stats`, () => {
    return HttpResponse.json({
      success: true,
      data: mockBackendStats,
    });
  }),

  // Taxonomy endpoint
  http.get(`${BACKEND_API_URL}/api/v1/taxonomy`, () => {
    return HttpResponse.json({
      success: true,
      data: mockBackendTaxonomy,
    });
  }),
];

/**
 * Additional handlers for edge cases and error scenarios
 */
export const errorHandlers = [
  // Simulate server error
  http.get(`${BACKEND_API_URL}/api/v1/error`, () => {
    return HttpResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }),

  // Simulate rate limiting
  http.get(`${BACKEND_API_URL}/api/v1/rate-limited`, () => {
    return HttpResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMITED',
      },
      { status: 429 },
    );
  }),
];

/**
 * All handlers combined
 */
export const allHandlers = [...handlers, ...errorHandlers];
