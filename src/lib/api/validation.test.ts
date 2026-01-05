import { describe, expect, it } from 'vitest';
import { VALID_CHAIN_IDS, validateAgentId, validateLimit, validateSearchQuery } from './validation';

describe('validateAgentId', () => {
  describe('valid cases', () => {
    it('should accept valid agent ID with Sepolia chain', () => {
      const result = validateAgentId('11155111:42');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.chainId).toBe(11155111);
        expect(result.tokenId).toBe('42');
      }
    });

    it('should accept valid agent ID with Base chain', () => {
      const result = validateAgentId('84532:abc123');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.chainId).toBe(84532);
        expect(result.tokenId).toBe('abc123');
      }
    });

    it('should accept valid agent ID with Polygon chain', () => {
      const result = validateAgentId('80002:99');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.chainId).toBe(80002);
        expect(result.tokenId).toBe('99');
      }
    });
  });

  describe('missing agent ID', () => {
    it('should reject undefined agent ID', () => {
      const result = validateAgentId(undefined);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('MISSING_AGENT_ID');
        expect(result.error).toBe('Agent ID is required');
      }
    });

    it('should reject empty string', () => {
      const result = validateAgentId('');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('MISSING_AGENT_ID');
      }
    });
  });

  describe('invalid format', () => {
    it('should reject ID without colon', () => {
      const result = validateAgentId('1115511142');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_AGENT_ID_FORMAT');
      }
    });

    it('should reject ID with multiple colons', () => {
      const result = validateAgentId('11155111:42:extra');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_AGENT_ID_FORMAT');
      }
    });

    it('should reject ID with special characters', () => {
      const result = validateAgentId('11155111:abc@def');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_AGENT_ID_FORMAT');
      }
    });
  });

  describe('invalid chain ID', () => {
    it('should reject unsupported chain ID', () => {
      const result = validateAgentId('1:42');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_CHAIN_ID');
        expect(result.error).toContain('Invalid chain ID: 1');
        expect(result.error).toContain(VALID_CHAIN_IDS.join(', '));
      }
    });

    it('should reject mainnet chain ID', () => {
      const result = validateAgentId('1:123');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_CHAIN_ID');
      }
    });
  });

  describe('token ID too long', () => {
    it('should reject token ID exceeding max length', () => {
      const longTokenId = 'a'.repeat(101);
      const result = validateAgentId(`11155111:${longTokenId}`);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('TOKEN_ID_TOO_LONG');
        expect(result.error).toContain('Token ID too long');
      }
    });

    it('should accept token ID at max length', () => {
      const maxTokenId = 'a'.repeat(100);
      const result = validateAgentId(`11155111:${maxTokenId}`);

      expect(result.valid).toBe(true);
    });
  });
});

describe('validateSearchQuery', () => {
  describe('valid queries', () => {
    it('should accept simple query', () => {
      const result = validateSearchQuery('code review');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.query).toBe('code review');
      }
    });

    it('should accept query with special characters', () => {
      const result = validateSearchQuery('AI assistant (v2.0)');

      expect(result.valid).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = validateSearchQuery('  query with spaces  ');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.query).toBe('query with spaces');
      }
    });
  });

  describe('missing query', () => {
    it('should reject undefined query', () => {
      const result = validateSearchQuery(undefined);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('MISSING_QUERY');
      }
    });

    it('should reject null query', () => {
      const result = validateSearchQuery(null);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('MISSING_QUERY');
      }
    });

    it('should reject empty string', () => {
      const result = validateSearchQuery('');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('MISSING_QUERY');
      }
    });
  });

  describe('query too short', () => {
    it('should reject whitespace-only query', () => {
      const result = validateSearchQuery('   ');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('QUERY_TOO_SHORT');
        expect(result.error).toContain('at least');
      }
    });
  });

  describe('query too long', () => {
    it('should reject query exceeding max length', () => {
      const longQuery = 'a'.repeat(1001);
      const result = validateSearchQuery(longQuery);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('QUERY_TOO_LONG');
        expect(result.error).toContain('at most');
      }
    });

    it('should accept query at max length', () => {
      const maxQuery = 'a'.repeat(1000);
      const result = validateSearchQuery(maxQuery);

      expect(result.valid).toBe(true);
    });
  });

  describe('invalid characters', () => {
    it('should reject query with null bytes', () => {
      const result = validateSearchQuery('test\x00query');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.code).toBe('INVALID_QUERY_CHARACTERS');
        expect(result.error).toContain('invalid characters');
      }
    });
  });
});

describe('validateLimit', () => {
  describe('valid limits', () => {
    it('should accept valid number', () => {
      const result = validateLimit(50);

      expect(result).toBe(50);
    });

    it('should accept string number', () => {
      const result = validateLimit('25');

      expect(result).toBe(25);
    });

    it('should cap at max limit', () => {
      const result = validateLimit(200, 100);

      expect(result).toBe(100);
    });
  });

  describe('default values', () => {
    it('should return default for undefined', () => {
      const result = validateLimit(undefined);

      expect(result).toBe(20);
    });

    it('should return default for null', () => {
      const result = validateLimit(null);

      expect(result).toBe(20);
    });

    it('should use custom default', () => {
      const result = validateLimit(undefined, 100, 50);

      expect(result).toBe(50);
    });
  });

  describe('invalid limits', () => {
    it('should return default for NaN', () => {
      const result = validateLimit('not-a-number');

      expect(result).toBe(20);
    });

    it('should return default for zero', () => {
      const result = validateLimit(0);

      expect(result).toBe(20);
    });

    it('should return default for negative', () => {
      const result = validateLimit(-5);

      expect(result).toBe(20);
    });
  });
});
