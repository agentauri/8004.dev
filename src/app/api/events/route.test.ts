import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';

// Mock the backend module with all required exports
vi.mock('@/lib/api/backend', async () => {
  const actual = await vi.importActual('@/lib/api/backend');
  return {
    ...actual,
    backendFetch: vi.fn(),
  };
});

describe('Events API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/events', () => {
    it('returns SSE content type', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: { Accept: 'text/event-stream' },
      });

      const response = await GET(request);

      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform');
      expect(response.headers.get('Connection')).toBe('keep-alive');
    });

    it('returns 406 when client does not accept SSE', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: { Accept: 'application/json' },
      });

      const response = await GET(request);

      expect(response.status).toBe(406);
      const text = await response.text();
      expect(text).toBe('This endpoint only supports Server-Sent Events');
    });

    it('accepts requests without Accept header', async () => {
      const request = new Request('http://localhost:3000/api/events');

      const response = await GET(request);

      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    });

    it('returns a readable stream', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: { Accept: 'text/event-stream' },
      });

      const response = await GET(request);

      expect(response.body).toBeInstanceOf(ReadableStream);
    });

    it('sends initial connection event', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: { Accept: 'text/event-stream' },
      });

      const response = await GET(request);
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Expected readable stream');
      }

      const { value } = await reader.read();
      const text = new TextDecoder().decode(value);

      expect(text).toContain('event: connected');
      expect(text).toContain('SSE connection established');

      reader.releaseLock();
    });

    it('includes X-Accel-Buffering header for nginx', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: { Accept: 'text/event-stream' },
      });

      const response = await GET(request);

      expect(response.headers.get('X-Accel-Buffering')).toBe('no');
    });
  });

  describe('POST /api/events', () => {
    it('returns method not allowed error', async () => {
      const response = await POST();

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe('METHOD_NOT_ALLOWED');
    });
  });
});
