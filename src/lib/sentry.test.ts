import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addBreadcrumb,
  captureError,
  captureMessage,
  getSentryConfig,
  isSentryEnabled,
  setUser,
  startTransaction,
} from './sentry';

describe('sentry', () => {
  const originalEnv = process.env;
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  // Spy on console.info to suppress logs during tests
  vi.spyOn(console, 'info').mockImplementation(() => {});

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isSentryEnabled', () => {
    it('returns false when DSN is not set', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      expect(isSentryEnabled()).toBe(false);
    });

    it('returns true when DSN is set', () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
      expect(isSentryEnabled()).toBe(true);
    });

    it('returns false for empty DSN', () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = '';
      expect(isSentryEnabled()).toBe(false);
    });
  });

  describe('getSentryConfig', () => {
    it('returns default config when no env vars set', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      delete process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
      delete process.env.NEXT_PUBLIC_SENTRY_RELEASE;

      const config = getSentryConfig();

      expect(config.dsn).toBeUndefined();
      expect(config.environment).toBe('test'); // vitest sets NODE_ENV to test
      expect(config.release).toBeUndefined();
      expect(config.tracesSampleRate).toBe(0.1);
    });

    it('returns configured values from env vars', () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = 'production';
      process.env.NEXT_PUBLIC_SENTRY_RELEASE = '1.0.0';
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE = '0.5';

      const config = getSentryConfig();

      expect(config.dsn).toBe('https://test@sentry.io/123');
      expect(config.environment).toBe('production');
      expect(config.release).toBe('1.0.0');
      expect(config.tracesSampleRate).toBe(0.5);
    });
  });

  describe('captureError', () => {
    it('logs to console when Sentry is not enabled', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      const error = new Error('Test error');
      captureError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[Sentry]', error, undefined);
    });

    it('accepts string error', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      captureError('String error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Sentry]',
        expect.objectContaining({ message: 'String error' }),
        undefined,
      );
    });

    it('accepts context with tags', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      const error = new Error('Test');
      const context = { tags: { feature: 'search' } };
      captureError(error, context);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[Sentry]', error, context);
    });
  });

  describe('captureMessage', () => {
    it('logs to console when Sentry is not enabled', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      captureMessage('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith('[Sentry:info]', 'Test message', undefined);
    });

    it('uses console.error for error level', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      captureMessage('Error message', 'error');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[Sentry:error]', 'Error message', undefined);
    });

    it('uses console.error for fatal level', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      captureMessage('Fatal message', 'fatal');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[Sentry:fatal]', 'Fatal message', undefined);
    });
  });

  describe('setUser', () => {
    it('does not throw when Sentry is not enabled', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      expect(() => setUser({ id: '123' })).not.toThrow();
      expect(() => setUser(null)).not.toThrow();
    });
  });

  describe('addBreadcrumb', () => {
    it('logs in development mode when Sentry is not enabled', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      vi.stubEnv('NODE_ENV', 'development');

      addBreadcrumb('User clicked button', 'action', { button: 'submit' });

      expect(consoleDebugSpy).toHaveBeenCalledWith('[Breadcrumb:action]', 'User clicked button', {
        button: 'submit',
      });
    });

    it('does not log in production mode', () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
      vi.stubEnv('NODE_ENV', 'production');

      addBreadcrumb('User clicked button', 'action');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('startTransaction', () => {
    it('returns object with finish and setTag methods', () => {
      const transaction = startTransaction('test-operation', 'task');

      expect(transaction).toHaveProperty('finish');
      expect(transaction).toHaveProperty('setTag');
      expect(typeof transaction.finish).toBe('function');
      expect(typeof transaction.setTag).toBe('function');
    });

    it('finish logs duration in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const transaction = startTransaction('test-operation', 'task');
      transaction.finish();

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[Performance:task]',
        'test-operation',
        expect.stringMatching(/^\d+\.\d+ms$/),
      );
    });

    it('setTag logs in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const transaction = startTransaction('test-operation', 'task');
      transaction.setTag('chainId', '11155111');

      expect(consoleDebugSpy).toHaveBeenCalledWith('[Transaction Tag]', 'chainId', '11155111');
    });
  });
});
