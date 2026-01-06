# Backend Roadmap - 8004.dev API

**Version**: 1.0
**Last Updated**: 2026-01-06
**Status**: Final

---

## Executive Summary

This roadmap outlines all backend development work for the 8004.dev Agent Explorer API. The frontend is complete and waiting on several API endpoints to replace mock data with real functionality.

---

## Current State - Implemented Endpoints

These endpoints are already working in production:

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/v1/agents` | GET | ✅ Working |
| `/api/v1/agents/:id` | GET | ✅ Working |
| `/api/v1/agents/:id/similar` | GET | ✅ Working |
| `/api/v1/agents/:id/classify` | GET | ✅ Working |
| `/api/v1/chains` | GET | ✅ Working |
| `/api/v1/stats` | GET | ✅ Working |
| `/api/v1/taxonomy` | GET | ✅ Working |
| `/api/v1/search` | POST | ✅ Working |
| `/api/v1/compose` | POST | ✅ Working |
| `/api/v1/intents` | GET | ✅ Working |
| `/api/v1/intents/:id` | GET | ✅ Working |
| `/api/v1/intents/:id/match` | POST | ✅ Working |

---

## Phase 1: Critical - Missing Core Endpoints

**Timeline**: Week 1-3 (with buffer)

These endpoints have frontend UI ready but return 404 or are mocked.

### 1.1 Leaderboard API
**Priority**: P0 - Critical
**Endpoint**: `GET /api/v1/leaderboard`
**Effort**: 3-4 days

**Description**: Returns ranked list of agents by reputation score.

**Request Parameters**:
```typescript
interface LeaderboardRequest {
  period?: 'all' | '30d' | '7d' | '24h';  // Time period filter
  chainIds?: number[];                     // Filter by chains
  mcp?: boolean;                           // MCP support filter
  a2a?: boolean;                           // A2A support filter
  x402?: boolean;                          // X.402 support filter
  limit?: number;                          // Results per page (default: 20)
  cursor?: string;                         // Pagination cursor
}
```

**Response**:
```typescript
interface LeaderboardResponse {
  success: true;
  data: LeaderboardEntry[];
  meta: {
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

interface LeaderboardEntry {
  rank: number;
  agent: {
    id: string;           // chainId:tokenId
    name: string;
    image?: string;
    chainId: number;
  };
  reputation: number;     // 0-100 scale
  feedbackCount: number;
  previousRank?: number;  // For trend calculation
  trend: 'up' | 'down' | 'stable';
}
```

**Implementation Notes**:
- Index on reputation score for fast sorting
- Cache with 5-minute TTL
- Support cursor-based pagination for infinite scroll
- Calculate trend by comparing current vs previous period rank

---

### 1.2 Global Feedbacks API
**Priority**: P0 - Critical
**Endpoint**: `GET /api/v1/feedbacks`
**Effort**: 3-4 days

**Description**: Returns all on-chain feedbacks across all agents.

**Request Parameters**:
```typescript
interface FeedbacksRequest {
  chainIds?: number[];
  scoreCategory?: 'positive' | 'neutral' | 'negative';
  limit?: number;
  cursor?: string;
}
```

**Response**:
```typescript
interface FeedbacksResponse {
  success: true;
  data: Feedback[];
  meta: {
    total: number;
    hasMore: boolean;
    nextCursor?: string;
    stats: {
      positive: number;   // score >= 70
      neutral: number;    // score 40-69
      negative: number;   // score < 40
    };
  };
}

interface Feedback {
  id: string;
  agentId: string;
  agentName: string;
  score: number;           // 0-100 scale (NOT 1-5)
  tags: string[];
  context?: string;
  submitter: string;       // Address
  timestamp: string;       // ISO8601
  chainId: number;
  txHash?: string;
}
```

**Score Categories**:
- `positive`: score >= 70
- `neutral`: score 40-69
- `negative`: score < 40

**Implementation Notes**:
- Read from on-chain events
- Index by timestamp for chronological ordering
- Cache recent feedbacks with 1-minute TTL

---

### 1.3 Trending Agents API
**Priority**: P0 - Critical
**Endpoint**: `GET /api/v1/trending`
**Effort**: 2-3 days

**Description**: Returns agents with highest reputation growth.

**Request Parameters**:
```typescript
interface TrendingRequest {
  period: '24h' | '7d' | '30d';  // Required
  limit?: number;                // Default: 10
}
```

**Response**:
```typescript
interface TrendingResponse {
  success: true;
  data: TrendingAgent[];
}

interface TrendingAgent {
  agent: {
    id: string;
    name: string;
    image?: string;
    chainId: number;
  };
  currentScore: number;
  previousScore: number;
  change: number;           // Absolute change
  changePercent: number;    // Percentage change
  trend: 'up' | 'down' | 'stable';  // Include 'stable'
}
```

**Implementation Notes**:
- Store historical reputation snapshots (daily minimum)
- Calculate deltas for trending algorithm
- Cache with 15-minute TTL
- **Data Migration**: Requires backfill of historical data or graceful handling of missing history

---

### 1.4 Real Endpoint URLs
**Priority**: P0 - Critical (upgraded from P1)
**Effort**: 1-2 days

**Description**: Return actual MCP/A2A endpoint URLs instead of just boolean flags.

**Current Response**:
```json
{ "hasMcp": true, "hasA2a": true }
```

**Enhanced Response**:
```json
{
  "hasMcp": true,
  "hasA2a": true,
  "endpoints": {
    "mcp": {
      "url": "https://agent.example.com/mcp",
      "version": "1.0.0"
    },
    "a2a": {
      "url": "https://agent.example.com/a2a",
      "version": "2.0.0"
    }
  }
}
```

**Implementation Notes**:
- Parse from on-chain metadata or agent manifest
- Validate URLs before returning
- Simple enhancement to existing endpoint

---

## Phase 2: High Priority - Evaluations & Real-time

**Timeline**: Week 4-6

### 2.1 Evaluations API
**Priority**: P1 - High (downgraded from P0)
**Effort**: 5-7 days

**Description**: Full evaluation system for agent benchmarking.

**Endpoints Required**:
```
GET  /api/v1/evaluations              - List all evaluations
GET  /api/v1/evaluations/:id          - Get evaluation details
POST /api/v1/evaluations              - Create new evaluation
GET  /api/v1/agents/:id/evaluations   - Agent's evaluations
```

**Response**:
```typescript
interface EvaluationsResponse {
  success: true;
  data: Evaluation[];
  meta: {
    total: number;
    byStatus: {
      pending: number;
      running: number;
      completed: number;
      failed: number;
    };
  };
}

interface Evaluation {
  id: string;
  agentId: string;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  score?: number;          // 0-100
  benchmarks?: BenchmarkResult[];
  createdAt: string;
  completedAt?: string;
  error?: string;          // If failed
}
```

**Implementation Notes**:
- Async job processing for evaluation runs
- Store results in D1 database
- Timeout handling for long-running evaluations

---

### 2.2 Streaming Search (SSE)
**Priority**: P1 - High
**Endpoint**: `GET /api/v1/search/stream`
**Effort**: 3-4 days

**Description**: Server-Sent Events for real-time search results.

**Request**: Query parameters same as POST /api/v1/search

**SSE Events**:
```typescript
// Progress event
event: progress
data: { "processed": 50, "total": 100, "percentage": 50 }

// Result event (sent as results are found)
event: result
data: { "agent": {...}, "score": 0.95, "rank": 1 }

// Metadata event
event: metadata
data: { "hydeQuery": "expanded query text", "totalFound": 25 }

// Complete event
event: complete
data: { "totalResults": 25, "duration": 1234 }

// Error event
event: error
data: { "code": "TIMEOUT", "message": "Search timeout" }
```

**Implementation Notes**:
- Use Cloudflare Workers SSE support
- Timeout after 30 seconds
- Send heartbeat every 5 seconds
- Support graceful client disconnection

---

### 2.3 Real-time Events (SSE)
**Priority**: P1 - High
**Endpoint**: `GET /api/v1/events`
**Effort**: 4-5 days

**Description**: Real-time notifications for platform events.

**Query Parameters**:
```typescript
interface EventSubscription {
  types?: string[];      // Event types to subscribe
  agentIds?: string[];   // Filter by agent IDs
  chainIds?: number[];   // Filter by chains
}
```

**SSE Events**:
```typescript
// New agent registered
event: agent:new
data: { "agentId": "11155111:123", "name": "...", "chainId": 11155111, "timestamp": "..." }

// Agent updated
event: agent:update
data: { "agentId": "...", "field": "reputation", "oldValue": 80, "newValue": 85, "timestamp": "..." }

// New feedback
event: feedback:new
data: { "agentId": "...", "score": 85, "submitter": "0x...", "timestamp": "..." }

// Evaluation completed
event: evaluation:complete
data: { "evaluationId": "...", "agentId": "...", "score": 92, "timestamp": "..." }

// Heartbeat (keep-alive)
event: heartbeat
data: { "timestamp": "..." }
```

**Implementation Notes**:
- Filter events by subscription parameters
- Use Durable Objects for connection management
- Max connection duration: 5 minutes (client should reconnect)
- Send heartbeat every 15 seconds

---

## Phase 3: Medium Priority - Enhanced Features

**Timeline**: Week 7-12

### 3.1 Agent Health Monitoring
**Priority**: P2 - Medium
**Endpoint**: `GET /api/v1/agents/:id/health`
**Effort**: 4-5 days

**Description**: Detailed health status and uptime metrics.

**Response**:
```typescript
interface AgentHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  uptime: {
    percentage: number;      // Last 30 days
    lastCheck: string;       // ISO8601
    lastSuccess: string;
    lastFailure?: string;
  };
  endpoints: {
    mcp?: EndpointHealth;
    a2a?: EndpointHealth;
  };
  history: HealthCheck[];    // Last 24 hours
}

interface EndpointHealth {
  url: string;
  status: 'up' | 'down' | 'slow';
  responseTime: number;      // ms
  lastChecked: string;
}
```

**Implementation Notes**:
- Cron job to check endpoints every 5 minutes
- Store health history in D1
- Alert threshold: 3 consecutive failures

---

### 3.2 Reputation History
**Priority**: P2 - Medium
**Endpoint**: `GET /api/v1/agents/:id/reputation/history`
**Effort**: 2-3 days

**Description**: Historical reputation data for charting.

**Request Parameters**:
```typescript
interface ReputationHistoryRequest {
  period: '7d' | '30d' | '90d' | '1y';
  granularity?: 'hour' | 'day' | 'week';
}
```

**Response**:
```typescript
interface ReputationHistoryResponse {
  agentId: string;
  current: number;
  history: {
    timestamp: string;
    score: number;
    feedbackCount: number;
  }[];
}
```

---

### 3.3 Webhook Notifications
**Priority**: P2 - Medium
**Effort**: 4-5 days

**Endpoints**:
```
POST   /api/v1/webhooks              - Register webhook
GET    /api/v1/webhooks              - List webhooks
DELETE /api/v1/webhooks/:id          - Delete webhook
POST   /api/v1/webhooks/:id/test     - Test webhook
```

**Webhook Payload**:
```typescript
interface WebhookPayload {
  id: string;
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
  signature: string;         // HMAC signature for verification
}
```

**Events**:
- `agent.registered`
- `agent.updated`
- `feedback.received`
- `evaluation.completed`
- `reputation.changed`

**Implementation Notes**:
- HMAC signature verification (SHA-256)
- Retry policy: 3 attempts with exponential backoff
- Dead letter queue for failed deliveries
- Timeout: 30 seconds per delivery attempt

---

### 3.4 Batch Operations
**Priority**: P2 - Medium
**Endpoint**: `GET /api/v1/agents/batch`
**Effort**: 1-2 days

**Description**: Fetch multiple agents in a single request.

**Request**:
```typescript
GET /api/v1/agents/batch?ids=11155111:1,11155111:2,84532:1
```

**Response**:
```typescript
interface BatchResponse {
  success: true;
  data: Agent[];
  meta: {
    requested: number;
    found: number;
    missing: string[];   // IDs not found
  };
}
```

**Limits**:
- Max 50 IDs per request

---

## Phase 4: Low Priority - Nice to Have

**Timeline**: Week 13+

### 4.1 Agent Verification System
**Priority**: P3 - Low (downgraded from P2)
**Effort**: 7-10 days

**Description**: Verify agent owner identity.

**Verification Methods**:
1. DNS TXT record verification
2. ENS reverse lookup
3. Social proof (Twitter, GitHub)

**Response**:
```typescript
interface VerificationResponse {
  verified: boolean;
  method?: 'dns' | 'ens' | 'social';
  verifiedAt?: string;
  badge: 'none' | 'basic' | 'verified' | 'official';
}
```

**Implementation Notes**:
- Requires external service integrations
- Complex verification flow
- Consider third-party verification service

---

### 4.2 API Key Management
**Priority**: P3 - Low
**Effort**: 3-4 days

**Endpoints**:
```
POST   /api/v1/keys                  - Create API key
GET    /api/v1/keys                  - List keys
DELETE /api/v1/keys/:id              - Revoke key
GET    /api/v1/keys/:id/usage        - Usage stats
```

**Features**:
- Rate limiting per key (configurable)
- Usage quotas
- Key rotation
- Scoped permissions (read-only vs read-write)

---

### 4.3 Analytics Endpoints
**Priority**: P3 - Low
**Effort**: 2-3 days

**Endpoint**: `GET /api/v1/analytics`

**Metrics**:
- Daily active agents
- Search volume
- Popular filters
- Chain distribution trends
- Protocol adoption rates

---

## Technical Specifications

### Error Response Standardization

All error responses follow this format:

```typescript
interface StandardError {
  success: false;
  error: string;            // Human-readable message
  code: string;             // Machine-readable code (e.g., LEADERBOARD_001)
  requestId: string;        // For debugging
  timestamp: string;        // ISO8601
  details?: Record<string, unknown>;  // Additional context
}
```

**Error Code Format**: `{DOMAIN}_{NUMBER}`
- `AUTH_001` - Authentication errors
- `LEADERBOARD_001` - Leaderboard errors
- `SEARCH_001` - Search errors
- etc.

---

### Rate Limiting

**Default Limits**:
- Unauthenticated: 60 requests/minute per IP
- Authenticated: 100 requests/minute per API key
- SSE connections: 5 concurrent per IP

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
X-RateLimit-Retry-After: 30
```

---

### CORS Configuration

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
};
```

---

### API Versioning Strategy

- Current version: `v1`
- Version in URL path: `/api/v1/...`
- Deprecation policy: 6 months notice before removal
- Migration guide provided for breaking changes
- `Sunset` header for deprecated endpoints

---

### Infrastructure

| Component | Technology | Notes |
|-----------|------------|-------|
| Runtime | Cloudflare Workers | Edge computing |
| Database | D1 (SQLite) | Structured data |
| Cache | KV | High-read data |
| SSE | Workers SSE | Real-time |
| Cron | Cron Triggers | Scheduled jobs |
| Queue | Queues | Async processing |

---

### Performance Targets

| Metric | Target |
|--------|--------|
| P50 latency | < 100ms |
| P95 latency | < 200ms |
| P99 latency | < 500ms |
| SSE first event | < 100ms |
| Cache hit ratio | > 80% |
| Uptime | 99.9% |

---

### Security Checklist

- [ ] Input validation with Zod schemas
- [ ] Rate limiting per IP and API key
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Webhook signature verification
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)

---

## Data Migration Plan

### Historical Reputation Data

For trending calculations, historical snapshots are required:

1. **Initial Backfill**:
   - Query on-chain events for historical feedbacks
   - Calculate reputation at daily intervals
   - Store in D1 `reputation_history` table

2. **Ongoing Collection**:
   - Cron job daily at 00:00 UTC
   - Snapshot current reputation for all active agents
   - Prune data older than 1 year

3. **Graceful Degradation**:
   - If history unavailable, show "No trend data"
   - Don't fail the entire response

---

## Implementation Timeline (Revised)

```
Phase 1 (Critical):         Week 1-3
├── Leaderboard API         (3-4 days)
├── Feedbacks API           (3-4 days)
├── Trending API            (2-3 days)
└── Real Endpoint URLs      (1-2 days)

Phase 2 (High):             Week 4-6
├── Evaluations API         (5-7 days)
├── Streaming Search        (3-4 days)
└── Real-time Events        (4-5 days)

Phase 3 (Medium):           Week 7-12
├── Health Monitoring       (4-5 days)
├── Reputation History      (2-3 days)
├── Webhooks               (4-5 days)
└── Batch Operations        (1-2 days)

Phase 4 (Low):              Week 13+
├── Verification System     (7-10 days)
├── API Key Management      (3-4 days)
└── Analytics               (2-3 days)

Total: ~14-16 weeks
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| API Uptime | 99.9% |
| Error Rate | < 0.1% |
| P95 Latency | < 200ms |
| Mock Endpoints Replaced | 100% |
| Frontend Unblocked | All features |

---

*Document Status: FINAL*
*Last Review: 2026-01-06*
