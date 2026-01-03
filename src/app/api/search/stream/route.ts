/**
 * Streaming Search API Route
 * GET /api/search/stream
 *
 * Proxies SSE streaming search from the 8004 backend API.
 * Returns real-time search results as Server-Sent Events.
 *
 * Query Parameters:
 * - q (required): Search query string
 * - limit (optional): Max results (default 20, max 100)
 * - chains (optional): Comma-separated chain IDs
 * - mcp (optional): Filter by MCP support (true/false)
 * - a2a (optional): Filter by A2A support (true/false)
 * - minReputation (optional): Minimum reputation score (0-100)
 */

import type { NextRequest } from 'next/server';
import {
  errorResponse,
  parseBoolParam,
  parseIntArrayParam,
  parseIntParam,
} from '@/lib/api/route-helpers';
import { validateLimit, validateSearchQuery } from '@/lib/api/validation';

/** Streaming timeout in milliseconds (60 seconds) */
const STREAM_TIMEOUT_MS = 60000;

/** SSE headers for streaming response */
const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no', // Disable nginx buffering
};

/**
 * Get environment variables at runtime
 */
function getApiUrl(): string | undefined {
  return process.env.BACKEND_API_URL;
}

function getApiKey(): string | undefined {
  return process.env.BACKEND_API_KEY;
}

/**
 * Format data as SSE event
 */
function formatSSE(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * Format error as SSE event
 */
function formatSSEError(error: string, code: string): string {
  return formatSSE({ type: 'error', data: { error, code } });
}

/**
 * Build the backend streaming search request body
 */
interface StreamSearchRequest {
  query: string;
  limit: number;
  filters?: {
    chainIds?: number[];
    mcp?: boolean;
    a2a?: boolean;
    minReputation?: number;
  };
}

function buildStreamRequest(searchParams: URLSearchParams): StreamSearchRequest | null {
  const query = searchParams.get('q');
  const limitParam = parseIntParam(searchParams.get('limit'));
  const chains = parseIntArrayParam(searchParams.get('chains'));
  const mcp = parseBoolParam(searchParams.get('mcp'));
  const a2a = parseBoolParam(searchParams.get('a2a'));
  const minReputation = parseIntParam(searchParams.get('minReputation'));

  // Validate query
  const queryValidation = validateSearchQuery(query);
  if (!queryValidation.valid) {
    return null;
  }

  // Build request
  const request: StreamSearchRequest = {
    query: queryValidation.query,
    limit: validateLimit(limitParam, 100, 20),
  };

  // Add filters if any are specified
  const filters: StreamSearchRequest['filters'] = {};
  let hasFilters = false;

  if (chains.length > 0) {
    filters.chainIds = chains;
    hasFilters = true;
  }

  if (mcp !== undefined) {
    filters.mcp = mcp;
    hasFilters = true;
  }

  if (a2a !== undefined) {
    filters.a2a = a2a;
    hasFilters = true;
  }

  if (minReputation !== undefined && minReputation >= 0 && minReputation <= 100) {
    filters.minReputation = minReputation;
    hasFilters = true;
  }

  if (hasFilters) {
    request.filters = filters;
  }

  return request;
}

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;

  // Check for required query parameter
  const query = searchParams.get('q');
  if (!query) {
    return errorResponse('Query parameter "q" is required', 'MISSING_QUERY', 400);
  }

  // Validate query
  const queryValidation = validateSearchQuery(query);
  if (!queryValidation.valid) {
    return errorResponse(queryValidation.error, queryValidation.code, 400);
  }

  // Build backend request
  const streamRequest = buildStreamRequest(searchParams);
  if (!streamRequest) {
    return errorResponse('Invalid query parameters', 'INVALID_PARAMS', 400);
  }

  // Check environment configuration
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();

  if (!apiUrl) {
    console.error('BACKEND_API_URL is not configured');
    return errorResponse('Server configuration error', 'CONFIG_ERROR', 500);
  }

  if (!apiKey) {
    console.error('BACKEND_API_KEY is not configured');
    return errorResponse('Server configuration error', 'CONFIG_ERROR', 500);
  }

  // Set up abort controller for timeout and client disconnection
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), STREAM_TIMEOUT_MS);

  // Listen for client disconnection
  request.signal.addEventListener('abort', () => {
    abortController.abort();
    clearTimeout(timeoutId);
  });

  try {
    // Make streaming request to backend
    const backendResponse = await fetch(`${apiUrl}/api/v1/search/stream`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(streamRequest),
      signal: abortController.signal,
      // Disable caching for streaming
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    // Handle backend errors
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend streaming error:', backendResponse.status, errorText);

      // Try to parse error response
      try {
        const errorData = JSON.parse(errorText);
        return errorResponse(
          errorData.error || 'Backend request failed',
          errorData.code || 'BACKEND_ERROR',
          backendResponse.status,
        );
      } catch {
        return errorResponse(
          `Backend request failed (status ${backendResponse.status})`,
          'BACKEND_ERROR',
          backendResponse.status,
        );
      }
    }

    // Verify we got a streaming response
    if (!backendResponse.body) {
      return errorResponse('No response body from backend', 'STREAM_ERROR', 500);
    }

    // Create a new ReadableStream that proxies the backend response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = backendResponse.body!.getReader();
        const encoder = new TextEncoder();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Send done event and close stream
              controller.enqueue(encoder.encode(formatSSE({ type: 'done' })));
              controller.close();
              break;
            }

            // Forward the chunk as-is (backend sends properly formatted SSE)
            controller.enqueue(value);
          }
        } catch (error) {
          // Handle stream errors
          const errorMessage = error instanceof Error ? error.message : 'Stream error';

          // Check if it's an abort error (client disconnected or timeout)
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Stream aborted:', errorMessage);
          } else {
            console.error('Stream error:', error);
            // Try to send error event before closing
            try {
              controller.enqueue(encoder.encode(formatSSEError(errorMessage, 'STREAM_ERROR')));
            } catch {
              // Controller might already be closed
            }
          }

          try {
            controller.close();
          } catch {
            // Controller might already be closed
          }
        } finally {
          reader.releaseLock();
        }
      },

      cancel() {
        // Client disconnected
        abortController.abort();
      },
    });

    // Return streaming response
    return new Response(stream, {
      headers: SSE_HEADERS,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle fetch errors
    if (error instanceof Error && error.name === 'AbortError') {
      return errorResponse('Request timeout', 'TIMEOUT_ERROR', 408);
    }

    console.error('Streaming search error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to connect to backend',
      'CONNECTION_ERROR',
      500,
    );
  }
}
