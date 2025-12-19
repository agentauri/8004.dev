import { describe, expect, it } from 'vitest';
import { queryKeys } from './query-keys';

describe('queryKeys', () => {
  describe('all', () => {
    it('returns base agents key', () => {
      expect(queryKeys.all).toEqual(['agents']);
    });
  });

  describe('lists', () => {
    it('returns list key extending all', () => {
      expect(queryKeys.lists()).toEqual(['agents', 'list']);
    });
  });

  describe('list', () => {
    it('returns list key with params', () => {
      const params = { q: 'test', chains: [11155111] };
      expect(queryKeys.list(params)).toEqual(['agents', 'list', params]);
    });

    it('returns list key with empty params', () => {
      const params = {};
      expect(queryKeys.list(params)).toEqual(['agents', 'list', params]);
    });

    it('returns list key with all filter params', () => {
      const params = {
        q: 'trading',
        chains: [11155111, 84532],
        mcp: true,
        a2a: false,
        x402: true,
        active: true,
        sort: 'reputation' as const,
        order: 'desc' as const,
        limit: 20,
        cursor: '10',
      };
      expect(queryKeys.list(params)).toEqual(['agents', 'list', params]);
    });
  });

  describe('details', () => {
    it('returns details key extending all', () => {
      expect(queryKeys.details()).toEqual(['agents', 'detail']);
    });
  });

  describe('detail', () => {
    it('returns detail key with agent ID', () => {
      expect(queryKeys.detail('11155111:1')).toEqual(['agents', 'detail', '11155111:1']);
    });

    it('returns detail key with different agent ID', () => {
      expect(queryKeys.detail('84532:42')).toEqual(['agents', 'detail', '84532:42']);
    });
  });

  describe('reputations', () => {
    it('returns reputations key extending all', () => {
      expect(queryKeys.reputations()).toEqual(['agents', 'reputation']);
    });
  });

  describe('reputation', () => {
    it('returns reputation key with agent ID', () => {
      expect(queryKeys.reputation('11155111:1')).toEqual(['agents', 'reputation', '11155111:1']);
    });
  });

  describe('feedbacks', () => {
    it('returns feedbacks key extending all', () => {
      expect(queryKeys.feedbacks()).toEqual(['agents', 'feedback']);
    });
  });

  describe('feedback', () => {
    it('returns feedback key with agent ID', () => {
      expect(queryKeys.feedback('11155111:1')).toEqual(['agents', 'feedback', '11155111:1']);
    });
  });

  describe('chains', () => {
    it('returns chains key', () => {
      expect(queryKeys.chains()).toEqual(['chains']);
    });
  });

  describe('stats', () => {
    it('returns stats key', () => {
      expect(queryKeys.stats()).toEqual(['stats']);
    });
  });

  describe('relatedAgents', () => {
    it('returns relatedAgents key extending all', () => {
      expect(queryKeys.relatedAgents()).toEqual(['agents', 'related']);
    });
  });

  describe('related', () => {
    it('returns related key with agent ID', () => {
      expect(queryKeys.related('11155111:1')).toEqual([
        'agents',
        'related',
        '11155111:1',
        { limit: undefined, crossChain: undefined },
      ]);
    });

    it('returns related key with different agent ID', () => {
      expect(queryKeys.related('84532:42')).toEqual([
        'agents',
        'related',
        '84532:42',
        { limit: undefined, crossChain: undefined },
      ]);
    });

    it('returns related key with limit and crossChain options', () => {
      expect(queryKeys.related('11155111:1', 5, true)).toEqual([
        'agents',
        'related',
        '11155111:1',
        { limit: 5, crossChain: true },
      ]);
    });

    it('returns related key with only limit option', () => {
      expect(queryKeys.related('84532:42', 10)).toEqual([
        'agents',
        'related',
        '84532:42',
        { limit: 10, crossChain: undefined },
      ]);
    });
  });
});
