import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BackendError,
  backendFetch,
  getBackendUrl,
  isBackendHealthy,
  isPaymentRequiredError,
  PaymentRequiredError,
} from './backend';

// Mock environment variables
const mockEnv = {
  BACKEND_API_URL: 'https://api.8004.dev',
  BACKEND_API_KEY: 'test-api-key-12345',
};

// Store original env
const originalEnv = { ...process.env };

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('backend client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Set mock environment variables
    process.env.BACKEND_API_URL = mockEnv.BACKEND_API_URL;
    process.env.BACKEND_API_KEY = mockEnv.BACKEND_API_KEY;
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  describe('backendFetch', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = {
        success: true,
        data: { agents: [] },
        meta: { total: 0 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await backendFetch('/api/v1/agents');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.8004.dev/api/v1/agents',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-API-Key': mockEnv.BACKEND_API_KEY,
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should append query parameters to URL', async () => {
      const mockResponse = { success: true, data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/agents', {
        params: { limit: 10, active: true, search: 'AI assistant' },
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('active=true');
      expect(calledUrl).toContain('search=AI+assistant');
    });

    it('should handle array parameters correctly', async () => {
      const mockResponse = { success: true, data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/agents', {
        params: { chainIds: [11155111, 84532] },
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('chainIds%5B%5D=11155111');
      expect(calledUrl).toContain('chainIds%5B%5D=84532');
    });

    it('should skip undefined and null parameters', async () => {
      const mockResponse = { success: true, data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/agents', {
        params: { limit: 10, active: undefined, search: null as unknown as undefined },
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).not.toContain('active');
      expect(calledUrl).not.toContain('search');
    });

    it('should make a POST request with body', async () => {
      const mockResponse = { success: true, data: { results: [] } };
      const requestBody = { query: 'AI assistant', limit: 5 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/search', {
        method: 'POST',
        body: requestBody,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.8004.dev/api/v1/search',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        }),
      );
    });

    it('should include custom headers', async () => {
      const mockResponse = { success: true, data: {} };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/agents', {
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
          }),
        }),
      );
    });

    it('should throw BackendError on API error response', async () => {
      const errorResponse = {
        success: false,
        error: 'Agent not found',
        code: 'NOT_FOUND',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      try {
        await backendFetch('/api/v1/agents/invalid-id');
        // Should not reach here
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).message).toBe('Agent not found');
        expect((error as BackendError).code).toBe('NOT_FOUND');
        expect((error as BackendError).status).toBe(404);
      }
    });

    it('should throw BackendError on unauthorized', async () => {
      const errorResponse = {
        success: false,
        error: 'Invalid API key',
        code: 'UNAUTHORIZED',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(errorResponse),
      });

      try {
        await backendFetch('/api/v1/agents');
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('UNAUTHORIZED');
        expect((error as BackendError).status).toBe(401);
      }
    });

    it('should throw BackendError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      try {
        await backendFetch('/api/v1/agents');
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('NETWORK_ERROR');
        expect((error as BackendError).status).toBe(0);
      }
    });

    it('should throw BackendError on invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      try {
        await backendFetch('/api/v1/agents');
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('PARSE_ERROR');
      }
    });

    it('should throw BackendError when BACKEND_API_URL is not configured', async () => {
      delete process.env.BACKEND_API_URL;

      try {
        await backendFetch('/api/v1/agents');
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('CONFIG_ERROR');
        expect((error as BackendError).message).toContain('BACKEND_API_URL');
      }
    });

    it('should throw BackendError when BACKEND_API_KEY is not configured', async () => {
      delete process.env.BACKEND_API_KEY;

      try {
        await backendFetch('/api/v1/agents');
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('CONFIG_ERROR');
        expect((error as BackendError).message).toContain('BACKEND_API_KEY');
      }
    });

    it('should handle success:false response even with ok:true HTTP status', async () => {
      const errorResponse = {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(backendFetch('/api/v1/agents')).rejects.toThrow(BackendError);
    });

    it('should pass next.js fetch options for caching', async () => {
      const mockResponse = { success: true, data: {} };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await backendFetch('/api/v1/stats', {
        next: { revalidate: 300, tags: ['stats'] },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 300, tags: ['stats'] },
        }),
      );
    });
  });

  describe('isBackendHealthy', () => {
    it('should return true when backend is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'healthy',
            services: { database: 'ok', cache: 'ok', search: 'ok' },
          }),
      });

      const result = await isBackendHealthy();
      expect(result).toBe(true);
    });

    it('should return false when backend returns unhealthy status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'unhealthy' }),
      });

      const result = await isBackendHealthy();
      expect(result).toBe(false);
    });

    it('should return false when backend returns non-ok HTTP status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const result = await isBackendHealthy();
      expect(result).toBe(false);
    });

    it('should return false when network error occurs', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await isBackendHealthy();
      expect(result).toBe(false);
    });

    it('should return false when BACKEND_API_URL is not configured', async () => {
      delete process.env.BACKEND_API_URL;

      const result = await isBackendHealthy();
      expect(result).toBe(false);
    });

    it('should not include API key in health check request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy' }),
      });

      await isBackendHealthy();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.8004.dev/api/v1/health',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'X-API-Key': expect.any(String),
          }),
        }),
      );
    });
  });

  describe('getBackendUrl', () => {
    it('should return the configured backend URL', () => {
      const url = getBackendUrl();
      expect(url).toBe(mockEnv.BACKEND_API_URL);
    });

    it('should return undefined when not configured', () => {
      delete process.env.BACKEND_API_URL;
      const url = getBackendUrl();
      expect(url).toBeUndefined();
    });
  });

  describe('BackendError', () => {
    it('should create error with correct properties', () => {
      const error = new BackendError('Test error', 'TEST_CODE', 400);

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.status).toBe(400);
      expect(error.name).toBe('BackendError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BackendError);
    });
  });

  describe('PaymentRequiredError', () => {
    it('should create error with correct properties', () => {
      const paymentDetails = {
        x402Version: 1,
        accepts: [
          {
            scheme: 'exact',
            network: 'eip155:8453',
            maxAmountRequired: '50000',
            asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
          },
        ],
      };

      const error = new PaymentRequiredError('Payment required', paymentDetails);

      expect(error.message).toBe('Payment required');
      expect(error.name).toBe('PaymentRequiredError');
      expect(error.paymentDetails).toEqual(paymentDetails);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(PaymentRequiredError);
    });
  });

  describe('isPaymentRequiredError', () => {
    it('should return true for PaymentRequiredError', () => {
      const error = new PaymentRequiredError('Payment required', {
        x402Version: 1,
        accepts: [],
      });
      expect(isPaymentRequiredError(error)).toBe(true);
    });

    it('should return false for BackendError', () => {
      const error = new BackendError('Not found', 'NOT_FOUND', 404);
      expect(isPaymentRequiredError(error)).toBe(false);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Generic error');
      expect(isPaymentRequiredError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isPaymentRequiredError(null)).toBe(false);
      expect(isPaymentRequiredError(undefined)).toBe(false);
      expect(isPaymentRequiredError('string')).toBe(false);
      expect(isPaymentRequiredError({})).toBe(false);
    });
  });

  describe('backendFetch - 402 handling', () => {
    it('should throw PaymentRequiredError on 402 with valid x402 response', async () => {
      const x402Response = {
        x402Version: 1,
        accepts: [
          {
            scheme: 'exact',
            network: 'eip155:8453',
            maxAmountRequired: '50000',
            asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: () => Promise.resolve(x402Response),
      });

      try {
        await backendFetch('/api/v1/compose', { method: 'POST', body: { task: 'test' } });
        expect.fail('Should have thrown PaymentRequiredError');
      } catch (error) {
        expect(error).toBeInstanceOf(PaymentRequiredError);
        expect((error as PaymentRequiredError).message).toBe('Payment required for this operation');
        expect((error as PaymentRequiredError).paymentDetails).toEqual(x402Response);
      }
    });

    it('should throw BackendError on 402 with invalid x402 response (missing version)', async () => {
      const invalidResponse = {
        accepts: [{ scheme: 'exact' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: () => Promise.resolve(invalidResponse),
      });

      try {
        await backendFetch('/api/v1/compose', { method: 'POST', body: { task: 'test' } });
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('INVALID_402_RESPONSE');
        expect((error as BackendError).status).toBe(402);
      }
    });

    it('should throw BackendError on 402 with invalid x402 response (missing accepts)', async () => {
      const invalidResponse = {
        x402Version: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: () => Promise.resolve(invalidResponse),
      });

      try {
        await backendFetch('/api/v1/compose', { method: 'POST', body: { task: 'test' } });
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('INVALID_402_RESPONSE');
      }
    });

    it('should throw BackendError on 402 with non-array accepts', async () => {
      const invalidResponse = {
        x402Version: 1,
        accepts: 'not-an-array',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: () => Promise.resolve(invalidResponse),
      });

      try {
        await backendFetch('/api/v1/compose', { method: 'POST', body: { task: 'test' } });
        expect.fail('Should have thrown BackendError');
      } catch (error) {
        expect(error).toBeInstanceOf(BackendError);
        expect((error as BackendError).code).toBe('INVALID_402_RESPONSE');
      }
    });
  });
});
