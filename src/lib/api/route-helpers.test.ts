import { NextResponse } from 'next/server';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BackendError } from './backend';
import {
  handleRouteError,
  successResponse,
  errorResponse,
  parseIntParam,
  parseIntArrayParam,
  parseBoolParam,
} from './route-helpers';

// Mock console.error to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('handleRouteError', () => {
  it('should handle SyntaxError as 400 PARSE_ERROR', async () => {
    const error = new SyntaxError('Unexpected token');
    const response = handleRouteError(error, 'Fallback', 'FALLBACK_CODE');

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe('PARSE_ERROR');
    expect(body.error).toBe('Invalid JSON body');
  });

  it('should handle BackendError with status and code', async () => {
    const error = new BackendError('Not found', 'NOT_FOUND', 404);
    const response = handleRouteError(error, 'Fallback', 'FALLBACK_CODE');

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe('NOT_FOUND');
    expect(body.error).toBe('Not found');
  });

  it('should handle BackendError without status', async () => {
    const error = new BackendError('Server error', 'SERVER_ERROR');
    const response = handleRouteError(error, 'Fallback', 'FALLBACK_CODE');

    expect(response.status).toBe(500);
  });

  it('should handle generic Error with message', async () => {
    const error = new Error('Something went wrong');
    const response = handleRouteError(error, 'Fallback', 'FALLBACK_CODE');

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Something went wrong');
    expect(body.code).toBe('FALLBACK_CODE');
  });

  it('should use fallback message for non-Error', async () => {
    const error = 'string error';
    const response = handleRouteError(error, 'Fallback message', 'FALLBACK_CODE');

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Fallback message');
    expect(body.code).toBe('FALLBACK_CODE');
  });
});

describe('successResponse', () => {
  it('should create success response with data', async () => {
    const data = { agents: [] };
    const response = successResponse(data);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual(data);
  });

  it('should include meta when provided', async () => {
    const data = { agents: [] };
    const response = successResponse(data, { meta: { total: 100 } });

    const body = await response.json();
    expect(body.meta).toEqual({ total: 100 });
  });

  it('should set headers when provided', () => {
    const data = { agents: [] };
    const response = successResponse(data, {
      headers: { 'Cache-Control': 's-maxage=60' },
    });

    expect(response.headers.get('Cache-Control')).toBe('s-maxage=60');
  });

  it('should not include meta when not provided', async () => {
    const data = { agents: [] };
    const response = successResponse(data);

    const body = await response.json();
    expect(body.meta).toBeUndefined();
  });
});

describe('errorResponse', () => {
  it('should create error response with default 500 status', async () => {
    const response = errorResponse('Server error', 'SERVER_ERROR');

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Server error');
    expect(body.code).toBe('SERVER_ERROR');
  });

  it('should create error response with custom status', async () => {
    const response = errorResponse('Not found', 'NOT_FOUND', 404);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.code).toBe('NOT_FOUND');
  });
});

describe('parseIntParam', () => {
  it('should parse valid integer string', () => {
    expect(parseIntParam('42')).toBe(42);
  });

  it('should parse negative integer', () => {
    expect(parseIntParam('-5')).toBe(-5);
  });

  it('should return undefined for null', () => {
    expect(parseIntParam(null)).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    expect(parseIntParam('')).toBeUndefined();
  });

  it('should return undefined for non-numeric string', () => {
    expect(parseIntParam('abc')).toBeUndefined();
  });

  it('should parse integer part of float', () => {
    expect(parseIntParam('3.14')).toBe(3);
  });
});

describe('parseIntArrayParam', () => {
  it('should parse comma-separated integers', () => {
    expect(parseIntArrayParam('1,2,3')).toEqual([1, 2, 3]);
  });

  it('should handle spaces around values', () => {
    expect(parseIntArrayParam('1, 2, 3')).toEqual([1, 2, 3]);
  });

  it('should filter out non-numeric values', () => {
    expect(parseIntArrayParam('1,abc,3')).toEqual([1, 3]);
  });

  it('should return empty array for null', () => {
    expect(parseIntArrayParam(null)).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(parseIntArrayParam('')).toEqual([]);
  });

  it('should handle single value', () => {
    expect(parseIntArrayParam('42')).toEqual([42]);
  });
});

describe('parseBoolParam', () => {
  it('should return true for "true"', () => {
    expect(parseBoolParam('true')).toBe(true);
  });

  it('should return true for "1"', () => {
    expect(parseBoolParam('1')).toBe(true);
  });

  it('should return false for "false"', () => {
    expect(parseBoolParam('false')).toBe(false);
  });

  it('should return false for "0"', () => {
    expect(parseBoolParam('0')).toBe(false);
  });

  it('should return undefined for null', () => {
    expect(parseBoolParam(null)).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    expect(parseBoolParam('')).toBeUndefined();
  });

  it('should return undefined for other strings', () => {
    expect(parseBoolParam('yes')).toBeUndefined();
    expect(parseBoolParam('no')).toBeUndefined();
    expect(parseBoolParam('TRUE')).toBeUndefined();
  });
});
