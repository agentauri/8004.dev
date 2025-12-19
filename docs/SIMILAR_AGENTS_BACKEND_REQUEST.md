# Feature Request: Similar Agents Endpoint

**Date**: 2025-12-18
**Priority**: Medium
**Requester**: Frontend Team

---

## Summary

We need a new endpoint to retrieve agents similar to a given agent. The current frontend workaround uses basic protocol filtering (`?mcp=true&a2a=true`), which produces poor results. A backend implementation can leverage vector embeddings and OASF taxonomy for much better recommendations.

---

## Proposed Endpoint

```
GET /api/v1/agents/{agentId}/similar
```

### Parameters

| Parameter | Location | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `agentId` | path | string | required | Agent ID (`{chainId}:{tokenId}`) |
| `limit` | query | integer | 4 | Max results (1-20) |
| `crossChain` | query | boolean | true | Search all chains or same chain only |
| `minScore` | query | float | 0.3 | Minimum similarity threshold (0-1) |

### Example

```bash
curl "https://api.8004.dev/api/v1/agents/11155111:4473/similar?limit=4"
```

---

## Expected Response

```json
{
  "success": true,
  "data": [
    {
      "id": "84532:1610",
      "chainId": 84532,
      "tokenId": "1610",
      "name": "EVM E2E Agent",
      "description": "E2E test agent on Base Sepolia...",
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
        "Similar description",
        "Shared skills: EVALUATION_MONITORING",
        "Shared domains: TECHNOLOGY",
        "Both support A2A"
      ]
    }
  ],
  "meta": {
    "total": 4,
    "sourceAgentId": "11155111:4473"
  }
}
```

---

## Similarity Algorithm

We suggest a **weighted hybrid approach**:

```
score = (0.40 × semantic) + (0.25 × skills) + (0.20 × domains) + (0.15 × protocols)
```

### Factors

| Factor | Weight | Calculation |
|--------|--------|-------------|
| **Semantic** | 40% | Cosine similarity of description embeddings (Pinecone) |
| **Skills** | 25% | Jaccard similarity: `|A ∩ B| / |A ∪ B|` on OASF skills |
| **Domains** | 20% | Jaccard similarity on OASF domains |
| **Protocols** | 15% | `shared_protocols / source_protocols` (MCP, A2A, x402) |

### Match Reasons

Include human-readable explanations:

| Condition | Reason |
|-----------|--------|
| Semantic score > 0.6 | "Similar description" |
| Any shared skills | "Shared skills: X, Y, Z" |
| Any shared domains | "Shared domains: X, Y" |
| Both have MCP | "Both support MCP" |
| Both have A2A | "Both support A2A" |
| Both have x402 | "Both support x402" |

---

## Filtering

Before scoring, filter candidates:

```sql
WHERE id != :sourceAgentId
  AND active = true
  AND has_registration_file = true
  AND (:crossChain = true OR chain_id = :sourceChainId)
```

---

## Edge Cases

| Case | Behavior |
|------|----------|
| Agent not found | Return 404 |
| No OASF data on source | Skip skills/domains, redistribute weights |
| No description | Skip semantic, redistribute weights |
| No protocols | Skip protocol factor |
| Few results | Return what's available (may be < limit) |

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| Response time (p95) | < 200ms |
| Cache TTL | 5-10 minutes |
| Cache key | `similar:{agentId}:{limit}:{crossChain}` |

---

## Questions

1. **Embeddings**: Are description embeddings already in Pinecone for all agents? If not, what's needed to enable this?

2. **OASF Data**: Is OASF data (skills/domains) stored normalized or as JSON? Need to know for efficient Jaccard calculation.

3. **Weights**: Should we support custom weights via query params for A/B testing? e.g. `?semanticWeight=0.5`

4. **Fallback**: If Pinecone is unavailable, should we fall back to OASF-only matching?

---

## Why This Matters

Current frontend workaround:
```
/api/agents?mcp=true&a2a=true&active=true&limit=5
```

Problems:
- Only matches on protocol flags (binary)
- Ignores description similarity
- Ignores OASF taxonomy
- Returns arbitrary agents that happen to share protocols

With the new endpoint, we can show **actually relevant** similar agents based on what they do, not just what protocols they support.

---

## Timeline

No hard deadline, but would be great to have before the next release cycle.

Let me know if you need any clarification!
