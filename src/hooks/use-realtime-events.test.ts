import { describe, expect, it } from 'vitest';
import { useRealtimeEvents } from './use-realtime-events';

describe('useRealtimeEvents', () => {
  it('should export the hook from the provider', () => {
    expect(useRealtimeEvents).toBeDefined();
    expect(typeof useRealtimeEvents).toBe('function');
  });
});
