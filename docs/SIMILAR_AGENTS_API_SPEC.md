# Similar Agents API Specification

**Version**: 1.0
**Date**: 2025-12-18
**Status**: ✅ IMPLEMENTED
**Author**: Frontend Team
**Last Updated**: 2026-01-05

> **Note**: This endpoint has been implemented by the backend team. The frontend now uses this endpoint for the "Related Agents" section on agent detail pages.

---

## Overview

This document specifies a new backend endpoint to retrieve agents similar to a given agent. The current frontend implementation uses basic protocol filtering, which produces suboptimal results. A backend implementation can leverage vector embeddings and OASF taxonomy for more relevant recommendations.

---

## Endpoint

```
GET /api/v1/agents/{agentId}/similar
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agentId` | string | Yes | Agent ID in format `{chainId}:{tokenId}` |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 4 | Maximum number of similar agents to return (1-20) |
| `crossChain` | boolean | true | Include agents from all chains, or same chain only |
| `minScore` | float | 0.3 | Minimum similarity score threshold (0-1) |

### Example Request

```bash
GET /api/v1/agents/11155111:4473/similar?limit=4&crossChain=true
```

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "84532:1610",
      "chainId": 84532,
      "tokenId": "1610",
      "name": "EVM E2E Agent",
      "description": "E2E test agent on Base Sepolia with x402 and OASF taxonomy",
      "image": null,
      "active": true,
      "hasMcp": false,
      "hasA2a": true,
      "x402Support": true,
      "reputationScore": 75,
      "walletAddress": "0x54bf...dfc8",
      "oasf": {
        "skills": ["EVALUATION_MONITORING", "DEVOPS_MLOPS"],
        "domains": ["TECHNOLOGY", "RESEARCH_DEVELOPMENT"]
      },
      "similarityScore": 0.87,
      "matchReasons": [
        "Similar description (semantic)",
        "Shared skills: EVALUATION_MONITORING",
        "Shared domains: TECHNOLOGY",
        "Both support A2A protocol"
      ]
    }
  ],
  "meta": {
    "total": 4,
    "sourceAgentId": "11155111:4473",
    "algorithm": "hybrid_v1",
    "weights": {
      "semantic": 0.4,
      "skills": 0.25,
      "domains": 0.2,
      "protocols": 0.15
    }
  }
}
```

### Error Responses

#### Agent Not Found (404)

```json
{
  "success": false,
  "error": "Agent not found",
  "code": "AGENT_NOT_FOUND"
}
```

#### Invalid Agent ID (400)

```json
{
  "success": false,
  "error": "Invalid agent ID format. Expected: {chainId}:{tokenId}",
  "code": "INVALID_AGENT_ID"
}
```

---

## Similarity Algorithm

### Hybrid Scoring Model

The similarity score is calculated as a weighted combination of multiple factors:

```
similarityScore = (w1 * semanticScore) + (w2 * skillsScore) + (w3 * domainsScore) + (w4 * protocolScore)
```

### Default Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| `semantic` | 0.40 | Vector embedding cosine similarity of descriptions |
| `skills` | 0.25 | Jaccard similarity of OASF skills arrays |
| `domains` | 0.20 | Jaccard similarity of OASF domains arrays |
| `protocols` | 0.15 | Protocol compatibility score |

### Factor Calculations

#### 1. Semantic Similarity (0.40)

Use the existing vector embeddings in Pinecone to calculate cosine similarity between agent descriptions.

```sql
-- Pseudocode
semantic_score = cosine_similarity(
  source_agent.embedding,
  candidate_agent.embedding
)
```

#### 2. Skills Similarity (0.25)

Jaccard similarity of OASF skills arrays:

```
skills_score = |A ∩ B| / |A ∪ B|
```

Where A = source agent skills, B = candidate agent skills.

**Example**:
- Source: `["NLP", "SECURITY", "EVALUATION"]`
- Candidate: `["NLP", "EVALUATION", "DATA_ENGINEERING"]`
- Intersection: `["NLP", "EVALUATION"]` = 2
- Union: `["NLP", "SECURITY", "EVALUATION", "DATA_ENGINEERING"]` = 4
- Score: 2/4 = 0.5

#### 3. Domains Similarity (0.20)

Same Jaccard formula applied to OASF domains arrays.

#### 4. Protocol Compatibility (0.15)

Binary match scoring:

```
protocol_score = matches / total_protocols
```

Where:
- `matches` = number of shared protocols (MCP, A2A, x402)
- `total_protocols` = number of protocols the source agent has

**Example**:
- Source has: MCP, A2A
- Candidate has: A2A, x402
- Matches: 1 (A2A)
- Score: 1/2 = 0.5

---

## Match Reasons

The `matchReasons` array provides human-readable explanations for why agents are similar. Include reasons when scores exceed thresholds:

| Factor | Threshold | Reason Template |
|--------|-----------|-----------------|
| Semantic | > 0.6 | "Similar description (semantic)" |
| Skills | > 0 | "Shared skills: {skill1}, {skill2}, ..." |
| Domains | > 0 | "Shared domains: {domain1}, {domain2}, ..." |
| MCP | both true | "Both support MCP protocol" |
| A2A | both true | "Both support A2A protocol" |
| x402 | both true | "Both support x402 protocol" |
| Chain | same | "Same blockchain network" |

---

## Implementation Notes

### Performance Optimization

1. **Pre-filter candidates**: Before calculating full similarity, filter by:
   - `active = true` (only active agents)
   - `hasRegistrationFile = true` (only agents with metadata)
   - Optionally `chainId` if `crossChain = false`

2. **Limit vector search**: Use Pinecone's top-K query with `k = limit * 3` to get semantic candidates, then re-rank with full algorithm.

3. **Cache results**: Similar agents change infrequently. Cache for 5-10 minutes with key `similar:{agentId}:{limit}:{crossChain}`.

### Edge Cases

| Case | Behavior |
|------|----------|
| Agent has no OASF data | Skip skills/domains factors, redistribute weights |
| Agent has no description | Skip semantic factor, redistribute weights |
| Agent has no protocols | Skip protocol factor, redistribute weights |
| < limit similar agents found | Return all found (may be empty) |
| Source agent inactive | Still return results (allow viewing similar to inactive) |

### Weight Redistribution

When a factor cannot be calculated, redistribute its weight proportionally:

```
If semantic unavailable (no description):
  skills_weight = 0.25 / 0.60 * 1.0 = 0.417
  domains_weight = 0.20 / 0.60 * 1.0 = 0.333
  protocols_weight = 0.15 / 0.60 * 1.0 = 0.250
```

---

## Database Query (Pseudocode)

```sql
WITH source_agent AS (
  SELECT * FROM agents WHERE id = :agentId
),
candidates AS (
  SELECT
    a.*,
    -- Semantic similarity (from vector DB)
    vector_similarity(a.embedding, sa.embedding) as semantic_score,
    -- Skills Jaccard
    array_jaccard(a.oasf_skills, sa.oasf_skills) as skills_score,
    -- Domains Jaccard
    array_jaccard(a.oasf_domains, sa.oasf_domains) as domains_score,
    -- Protocol match
    protocol_match_score(a, sa) as protocol_score
  FROM agents a, source_agent sa
  WHERE a.id != sa.id
    AND a.active = true
    AND a.has_registration_file = true
    AND (:crossChain = true OR a.chain_id = sa.chain_id)
)
SELECT
  *,
  (0.40 * semantic_score + 0.25 * skills_score + 0.20 * domains_score + 0.15 * protocol_score) as similarity_score
FROM candidates
WHERE similarity_score >= :minScore
ORDER BY similarity_score DESC
LIMIT :limit;
```

---

## Frontend Integration

Once implemented, the frontend will update `use-related-agents.ts`:

```typescript
// Before (current implementation)
async function fetchRelatedAgents(agent: Agent, limit: number): Promise<AgentSummary[]> {
  const params = new URLSearchParams();
  if (agent.endpoints.mcp) params.set('mcp', 'true');
  if (agent.endpoints.a2a) params.set('a2a', 'true');
  // ... manual filter construction
  return fetch(`/api/agents?${params}`);
}

// After (with new endpoint)
async function fetchRelatedAgents(agent: Agent, limit: number, crossChain: boolean): Promise<AgentSummary[]> {
  const params = new URLSearchParams({ limit: String(limit), crossChain: String(crossChain) });
  const response = await fetch(`/api/agents/${agent.id}/similar?${params}`);
  return response.json();
}
```

---

## Testing Requirements

### Unit Tests

1. Similarity score calculation for each factor
2. Weight redistribution when factors unavailable
3. Match reasons generation
4. Edge cases (no OASF, no description, etc.)

### Integration Tests

1. Returns similar agents for agent with full data
2. Returns empty array when no similar agents found
3. Respects `crossChain` parameter
4. Respects `limit` parameter
5. Excludes source agent from results
6. Returns 404 for non-existent agent

### Performance Tests

1. Response time < 200ms for p95
2. Handles concurrent requests efficiently
3. Cache hit rate > 80% in production

---

## Rollout Plan

1. **Phase 1**: Deploy endpoint with feature flag (disabled)
2. **Phase 2**: Enable for 10% of traffic, monitor metrics
3. **Phase 3**: Compare click-through rates vs old implementation
4. **Phase 4**: Full rollout if metrics positive

---

## Questions for Backend Team

1. Are vector embeddings already indexed in Pinecone for all agents?
2. Is OASF data normalized in the database or stored as JSON?
3. What's the current latency budget for agent detail page APIs?
4. Should we support custom weights via query parameters for A/B testing?

---

## References

- [AG0 Semantic Search Standard](./AG0_SEMANTIC_SEARCH_STANDARD.md)
- [Backend API Documentation](https://api.8004.dev/docs)
- [OASF Schema](https://docs.agntcy.org/oasf/open-agentic-schema-framework/)
