import { describe, expect, it, vi } from 'vitest';
import {
  cn,
  copyToClipboard,
  createAgentId,
  formatDate,
  formatDateTimeSafe,
  getChainKey,
  getChainName,
  getTrustLevel,
  isValidDate,
  parseAgentId,
  truncateAddress,
} from './utils';

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('truncateAddress', () => {
  it('truncates a long address', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(truncateAddress(address)).toBe('0x1234...7890');
  });

  it('returns empty string for empty input', () => {
    expect(truncateAddress('')).toBe('');
  });

  it('returns short addresses unchanged', () => {
    expect(truncateAddress('0x1234')).toBe('0x1234');
  });

  it('accepts custom start and end chars', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(truncateAddress(address, 4, 6)).toBe('0x12...567890');
  });
});

describe('getChainName', () => {
  it('returns Sepolia for chain ID 11155111', () => {
    expect(getChainName(11155111)).toBe('Sepolia');
  });

  it('returns Base Sepolia for chain ID 84532', () => {
    expect(getChainName(84532)).toBe('Base Sepolia');
  });

  it('returns Polygon Amoy for chain ID 80002', () => {
    expect(getChainName(80002)).toBe('Polygon Amoy');
  });

  it('returns fallback for unknown chain ID', () => {
    expect(getChainName(12345)).toBe('Chain 12345');
  });
});

describe('getChainKey', () => {
  it('returns sepolia for chain ID 11155111', () => {
    expect(getChainKey(11155111)).toBe('sepolia');
  });

  it('returns base for chain ID 84532', () => {
    expect(getChainKey(84532)).toBe('base');
  });

  it('returns polygon for chain ID 80002', () => {
    expect(getChainKey(80002)).toBe('polygon');
  });

  it('returns unknown for unrecognized chain ID', () => {
    expect(getChainKey(12345)).toBe('unknown');
  });
});

describe('getTrustLevel', () => {
  it('returns high for score >= 70', () => {
    expect(getTrustLevel(70)).toBe('high');
    expect(getTrustLevel(100)).toBe('high');
    expect(getTrustLevel(85)).toBe('high');
  });

  it('returns medium for score >= 40 and < 70', () => {
    expect(getTrustLevel(40)).toBe('medium');
    expect(getTrustLevel(69)).toBe('medium');
    expect(getTrustLevel(55)).toBe('medium');
  });

  it('returns low for score < 40', () => {
    expect(getTrustLevel(0)).toBe('low');
    expect(getTrustLevel(39)).toBe('low');
    expect(getTrustLevel(20)).toBe('low');
  });
});

describe('formatDate', () => {
  it('formats a timestamp', () => {
    const date = new Date('2025-06-15T12:00:00Z');
    expect(formatDate(date)).toBe('Jun 15, 2025');
  });

  it('formats a number timestamp', () => {
    const timestamp = new Date('2025-06-15T12:00:00Z').getTime();
    expect(formatDate(timestamp)).toBe('Jun 15, 2025');
  });

  it('formats a string timestamp', () => {
    expect(formatDate('2025-06-15')).toBe('Jun 15, 2025');
  });
});

describe('isValidDate', () => {
  it('returns true for valid Date object', () => {
    expect(isValidDate(new Date('2025-06-15'))).toBe(true);
  });

  it('returns true for valid ISO string', () => {
    expect(isValidDate('2025-06-15T12:00:00Z')).toBe(true);
  });

  it('returns true for valid timestamp number', () => {
    expect(isValidDate(Date.now())).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidDate('')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidDate(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidDate(undefined)).toBe(false);
  });

  it('returns false for invalid date string', () => {
    expect(isValidDate('not-a-date')).toBe(false);
  });
});

describe('formatDateTimeSafe', () => {
  it('formats a valid ISO string', () => {
    const result = formatDateTimeSafe('2025-06-15T12:00:00Z');
    expect(result).toContain('June');
    expect(result).toContain('2025');
  });

  it('formats a valid Date object', () => {
    const result = formatDateTimeSafe(new Date('2025-06-15T12:00:00Z'));
    expect(result).toContain('June');
    expect(result).toContain('2025');
  });

  it('formats a valid timestamp number', () => {
    const result = formatDateTimeSafe(new Date('2025-06-15T12:00:00Z').getTime());
    expect(result).toContain('June');
    expect(result).toContain('2025');
  });

  it('returns null for empty string', () => {
    expect(formatDateTimeSafe('')).toBeNull();
  });

  it('returns null for null', () => {
    expect(formatDateTimeSafe(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(formatDateTimeSafe(undefined)).toBeNull();
  });

  it('returns null for invalid date string', () => {
    expect(formatDateTimeSafe('not-a-date')).toBeNull();
  });
});

describe('copyToClipboard', () => {
  it('copies text successfully', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });

    const result = await copyToClipboard('test text');
    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('returns false on failure', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Failed'));
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });

    const result = await copyToClipboard('test text');
    expect(result).toBe(false);
  });
});

describe('parseAgentId', () => {
  it('parses valid agent ID', () => {
    expect(parseAgentId('11155111:123')).toEqual({
      chainId: 11155111,
      tokenId: '123',
    });
  });

  it('returns null for invalid format without colon', () => {
    expect(parseAgentId('invalid')).toBeNull();
  });

  it('returns null for invalid chain ID', () => {
    expect(parseAgentId('invalid:123')).toBeNull();
  });

  it('returns null for empty token ID', () => {
    expect(parseAgentId('11155111:')).toBeNull();
  });

  it('returns null for multiple colons', () => {
    expect(parseAgentId('11155111:123:456')).toBeNull();
  });
});

describe('createAgentId', () => {
  it('creates valid agent ID', () => {
    expect(createAgentId(11155111, '123')).toBe('11155111:123');
  });

  it('handles string token IDs', () => {
    expect(createAgentId(84532, 'abc')).toBe('84532:abc');
  });
});
