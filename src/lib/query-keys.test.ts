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
    it('returns list key with serialized params', () => {
      const params = { q: 'test', chains: [11155111] };
      const result = queryKeys.list(params);
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('list');
      expect(typeof result[2]).toBe('string');
      expect(JSON.parse(result[2] as string)).toEqual(params);
    });

    it('returns list key with empty params', () => {
      const params = {};
      const result = queryKeys.list(params);
      expect(result).toEqual(['agents', 'list', '{}']);
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
      const result = queryKeys.list(params);
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('list');
      expect(typeof result[2]).toBe('string');
      // Parse and verify all properties are present
      const parsed = JSON.parse(result[2] as string);
      expect(parsed.q).toBe('trading');
      // Arrays are sorted for stable cache keys
      expect(parsed.chains).toEqual([84532, 11155111]);
      expect(parsed.mcp).toBe(true);
    });

    it('produces same key for params with different property order', () => {
      const params1 = { q: 'test', mcp: true, chains: [11155111] };
      const params2 = { chains: [11155111], q: 'test', mcp: true };
      const params3 = { mcp: true, chains: [11155111], q: 'test' };

      const key1 = queryKeys.list(params1);
      const key2 = queryKeys.list(params2);
      const key3 = queryKeys.list(params3);

      // All should produce identical serialized keys
      expect(key1[2]).toBe(key2[2]);
      expect(key2[2]).toBe(key3[2]);
    });

    it('produces different keys for different params', () => {
      const params1 = { q: 'test' };
      const params2 = { q: 'other' };

      const key1 = queryKeys.list(params1);
      const key2 = queryKeys.list(params2);

      expect(key1[2]).not.toBe(key2[2]);
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

  describe('evaluations', () => {
    it('returns evaluations key', () => {
      expect(queryKeys.evaluations()).toEqual(['evaluations']);
    });
  });

  describe('evaluation', () => {
    it('returns evaluation key with id', () => {
      expect(queryKeys.evaluation('eval-123')).toEqual(['evaluations', 'eval-123']);
    });
  });

  describe('agentEvaluations', () => {
    it('returns agentEvaluations key with agent ID', () => {
      expect(queryKeys.agentEvaluations('11155111:1')).toEqual([
        'evaluations',
        'agent',
        '11155111:1',
      ]);
    });
  });

  describe('evaluationsByStatus', () => {
    it('returns evaluationsByStatus key with pending status', () => {
      expect(queryKeys.evaluationsByStatus('pending')).toEqual([
        'evaluations',
        'status',
        'pending',
      ]);
    });

    it('returns evaluationsByStatus key with completed status', () => {
      expect(queryKeys.evaluationsByStatus('completed')).toEqual([
        'evaluations',
        'status',
        'completed',
      ]);
    });
  });

  describe('events', () => {
    it('returns events key', () => {
      expect(queryKeys.events()).toEqual(['events']);
    });
  });

  describe('eventsByType', () => {
    it('returns eventsByType key with type', () => {
      expect(queryKeys.eventsByType('agent_registered')).toEqual(['events', 'agent_registered']);
    });
  });

  describe('intents', () => {
    it('returns intents key', () => {
      expect(queryKeys.intents()).toEqual(['intents']);
    });
  });

  describe('intent', () => {
    it('returns intent key with id', () => {
      expect(queryKeys.intent('intent-456')).toEqual(['intents', 'intent-456']);
    });
  });

  describe('intentsByCategory', () => {
    it('returns intentsByCategory key with category', () => {
      expect(queryKeys.intentsByCategory('trading')).toEqual(['intents', 'category', 'trading']);
    });
  });

  describe('intentMatches', () => {
    it('returns intentMatches key with intent id', () => {
      expect(queryKeys.intentMatches('intent-789')).toEqual(['intents', 'intent-789', 'matches']);
    });
  });

  describe('stats', () => {
    it('returns stats key', () => {
      expect(queryKeys.stats()).toEqual(['stats']);
    });
  });

  describe('teams', () => {
    it('returns teams key', () => {
      expect(queryKeys.teams()).toEqual(['teams']);
    });
  });

  describe('composition', () => {
    it('returns composition key with id', () => {
      expect(queryKeys.composition('team-123')).toEqual(['teams', 'composition', 'team-123']);
    });
  });

  describe('composeTask', () => {
    it('returns composeTask key with serialized task', () => {
      const result = queryKeys.composeTask('analyze market data');
      expect(result[0]).toBe('teams');
      expect(result[1]).toBe('task');
      expect(typeof result[2]).toBe('string');
      const parsed = JSON.parse(result[2] as string);
      expect(parsed.task).toBe('analyze market data');
    });
  });

  describe('relatedAgents', () => {
    it('returns relatedAgents key extending all', () => {
      expect(queryKeys.relatedAgents()).toEqual(['agents', 'related']);
    });
  });

  describe('related', () => {
    it('returns related key with agent ID and serialized options', () => {
      const result = queryKeys.related('11155111:1');
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('related');
      expect(result[2]).toBe('11155111:1');
      expect(typeof result[3]).toBe('string');
    });

    it('returns related key with different agent ID', () => {
      const result = queryKeys.related('84532:42');
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('related');
      expect(result[2]).toBe('84532:42');
    });

    it('returns related key with limit and crossChain options', () => {
      const result = queryKeys.related('11155111:1', 5, true);
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('related');
      expect(result[2]).toBe('11155111:1');
      const options = JSON.parse(result[3] as string);
      expect(options.limit).toBe(5);
      expect(options.crossChain).toBe(true);
    });

    it('returns related key with only limit option', () => {
      const result = queryKeys.related('84532:42', 10);
      const options = JSON.parse(result[3] as string);
      expect(options.limit).toBe(10);
    });
  });

  describe('similarAgents', () => {
    it('returns similarAgents key extending all', () => {
      expect(queryKeys.similarAgents()).toEqual(['agents', 'similar']);
    });
  });

  describe('similar', () => {
    it('returns similar key with agent ID and serialized options', () => {
      const result = queryKeys.similar('11155111:1');
      expect(result[0]).toBe('agents');
      expect(result[1]).toBe('similar');
      expect(result[2]).toBe('11155111:1');
      expect(typeof result[3]).toBe('string');
    });

    it('returns similar key with limit option', () => {
      const result = queryKeys.similar('11155111:1', 5);
      const options = JSON.parse(result[3] as string);
      expect(options.limit).toBe(5);
    });
  });
});
