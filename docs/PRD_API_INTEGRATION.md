# PRD: Frontend Integration with New API Features

**Date**: 2026-01-03
**Last Updated**: 2026-01-05
**For**: 8004.dev Frontend Team
**Backend API Docs**: https://agentauri.github.io/api.8004.dev/
**Status**: ✅ Core features implemented

---

## Executive Summary

The backend API (api.8004.dev) has introduced several new features that the frontend needs to integrate. This PRD outlines the required modifications, new sections to create, and adaptations to existing features.

---

## Current State Analysis

### Frontend Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5
- TanStack Query for data fetching
- Tailwind CSS with retro 80s pixel art theme
- Atomic Design component architecture

### Currently Implemented API Integrations
| Endpoint | Frontend Usage |
|----------|----------------|
| `GET /api/v1/agents` | Explore page listing |
| `GET /api/v1/agents/:id` | Agent detail page |
| `GET /api/v1/agents/:id/similar` | Related agents section |
| `GET/POST /api/v1/agents/:id/classify` | OASF classification |
| `POST /api/v1/search` | Semantic search |
| `GET /api/v1/chains` | Chain stats |
| `GET /api/v1/stats` | Platform stats |
| `GET /api/v1/taxonomy` | Taxonomy browser |

---

## New API Features Requiring Integration

### 1. Streaming Search (PENDING - Backend Not Ready)
**Endpoint**: `POST /api/v1/search/stream`
**Type**: Server-Sent Events (SSE)
**Status**: ⏳ Waiting for backend SSE endpoint

**What it does**: Returns search results progressively with HyDE expansion and LLM reranking.

**Frontend Requirements** (when backend is ready):
- [ ] Add SSE client support in `src/lib/api/`
- [ ] Create `useStreamingSearch()` hook with progressive result rendering
- [ ] Update `SearchResults` organism to show results as they arrive
- [ ] Add loading states for each search phase (embedding → vector search → reranking)
- [ ] Show search metadata (HyDE query, reranking scores)

---

### 2. Registry-as-Evaluator (PARTIAL - Backend 404)
**Status**: ⚠️ Frontend implemented, backend returns 404
**Endpoints**:
- `GET /api/v1/evaluate/info` - Evaluation capabilities
- `GET /api/v1/evaluate/benchmarks` - Available benchmarks
- `GET /api/v1/evaluate/:agentId` - Get evaluation
- `POST /api/v1/evaluate/:agentId` - Trigger evaluation

**What it does**: Evaluates agents against benchmarks (safety, capability, reliability, performance).

**Frontend Implementation**:
- [x] **NEW PAGE**: `/evaluate` - Evaluation dashboard (shows error state)
- [x] API route: `src/app/api/evaluate/route.ts`
- [ ] **NEW PAGE**: `/agent/[agentId]/evaluate` - Agent evaluation detail (pending backend)
- [ ] Create `EvaluationSection` organism for agent detail page (pending backend)
- [ ] Create `BenchmarkCard` molecule (pending backend)
- [ ] Create `RadarChart` atom (pending backend)

---

### 3. Team Composition ✅ IMPLEMENTED
**Status**: ✅ Fully implemented and tested
**Endpoints**:
- `POST /api/v1/compose` - Build agent team ✅

**What it does**: Given a task description, finds optimal team of agents with complementary skills.

**Frontend Implementation**:
- [x] **NEW PAGE**: `/compose` - Team builder interface
- [x] Task input form with validation
- [x] Team results display with agent roles
- [x] Fitness score visualization with defensive NaN handling
- [x] Link in header navigation
- [x] API route: `src/app/api/compose/route.ts`
- [x] Hook: `src/hooks/use-compose.ts`

**Bug fixes applied**:
- Fixed NaN fitness score display (2026-01-05)
- Added defensive defaults for empty team responses

---

### 4. Intent Templates ✅ IMPLEMENTED
**Status**: ✅ Fully implemented and tested
**Endpoints**:
- `GET /api/v1/intents` - List templates ✅
- `GET /api/v1/intents/:templateId` - Get template ✅
- `POST /api/v1/intents/:templateId/match` - Match agents to template ✅

**What it does**: Pre-built workflow templates for common multi-agent tasks.

**Frontend Implementation**:
- [x] **NEW PAGE**: `/intents` - Intent template gallery
- [x] **NEW PAGE**: `/intents/[id]` - Template detail with matching agents
- [x] Intent card component for template preview
- [x] Workflow visualization for template steps
- [x] Agent matching functionality
- [x] Link in header navigation
- [x] API routes: `src/app/api/intents/route.ts`, `src/app/api/intents/[id]/route.ts`
- [x] Hooks: `src/hooks/use-intents.ts`

**Bug fixes applied**:
- Fixed "Match Agents" button clearing template content (2026-01-05)
- Improved cache merge strategy to preserve existing template data

---

### 5. Real-time Events (PENDING - Backend Not Ready)
**Status**: ⏳ Waiting for backend SSE endpoint
**Endpoint**: `GET /api/v1/events`
**Type**: Server-Sent Events (SSE)

**Event Types**:
- `agent_created` - New agent registered
- `agent_updated` - Agent metadata changed
- `classification_complete` - OASF classification done
- `reputation_change` - Reputation score updated
- `evaluation_complete` - Evaluation finished

**Frontend Requirements** (when backend is ready):
- [ ] Create `useEvents()` hook for SSE subscription
- [ ] Add real-time notification system
- [ ] Show "New agents" badge on explore page
- [ ] Auto-refresh agent detail on updates
- [ ] Create `EventToast` atom for notifications
- [ ] Add event indicator to header

---

## Existing Section Modifications

### 1. Explore Page (`/explore`)

**Changes Required**:
- [ ] Add streaming search toggle (standard vs streaming)
- [ ] Show HyDE expanded query in search bar
- [ ] Display reranking scores alongside relevance scores
- [ ] Add "Compose Team" button for selected agents
- [ ] Add filter for evaluated agents (`hasEvaluation=true`)
- [ ] Add evaluation score range filter

**Files to modify**:
- `src/app/explore/page.tsx`
- `src/components/organisms/search-filters/`
- `src/components/organisms/search-results/`
- `src/components/molecules/agent-badges/` - Add evaluation badge

---

### 2. Agent Detail Page (`/agent/[agentId]`)

**Changes Required**:
- [ ] Add Evaluation tab with benchmark results
- [ ] Show evaluation scores in header (if available)
- [ ] Add "Evaluate Agent" action button
- [ ] Add "Add to Team" action button
- [ ] Show real-time updates when SSE connected
- [ ] Add matching intent templates section

**Files to modify**:
- `src/app/agent/[agentId]/page.tsx`
- `src/components/templates/agent-detail-template/`
- `src/components/organisms/agent-header/` - Add evaluation badge
- `src/components/organisms/agent-overview/` - Add actions

---

### 3. Agent Card (`AgentCard` organism)

**Changes Required**:
- [ ] Add evaluation score indicator (small badge)
- [ ] Add "Add to Team" quick action
- [ ] Show streaming search relevance animation
- [ ] Add reranker score tooltip

**Files to modify**:
- `src/components/organisms/agent-card/`
- `src/components/molecules/agent-badges/`

---

### 4. Header Navigation

**Changes Required**:
- [ ] Add "Compose" link to main nav
- [ ] Add "Intents" link to main nav
- [ ] Add "Evaluate" link (under dropdown or main nav)
- [ ] Add real-time event indicator (bell icon with badge)

**Files to modify**:
- `src/components/organisms/header/`

---

### 5. Home Page (`/`)

**Changes Required**:
- [ ] Add "Compose a Team" CTA section
- [ ] Add "Browse Intent Templates" section
- [ ] Show recent evaluations or top-rated agents
- [ ] Add streaming search demo/preview

**Files to modify**:
- `src/app/page.tsx`

---

## New Types & API Client Updates

### New TypeScript Types
```typescript
// src/types/evaluation.ts
interface Evaluation {
  agentId: string;
  benchmarks: BenchmarkResult[];
  overallScore: number;
  status: 'pending' | 'complete';
  evaluatedAt: string;
}

interface BenchmarkResult {
  name: string;
  score: number;
  category: 'safety' | 'capability' | 'reliability' | 'performance';
  details: Record<string, any>;
}

// src/types/compose.ts
interface TeamComposition {
  task: string;
  team: TeamMember[];
  fitnessScore: number;
  reasoning: string;
}

interface TeamMember {
  agent: AgentSummary;
  role: string;
  contribution: string;
}

// src/types/intent.ts
interface IntentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredRoles: string[];
  steps: WorkflowStep[];
}
```

### New API Routes
```
src/app/api/
├── evaluate/
│   ├── route.ts           # GET /api/v1/evaluate/benchmarks
│   └── [agentId]/
│       └── route.ts       # GET/POST /api/v1/evaluate/:agentId
├── compose/
│   └── route.ts           # POST /api/v1/compose
├── intents/
│   ├── route.ts           # GET /api/v1/intents
│   └── [templateId]/
│       ├── route.ts       # GET /api/v1/intents/:templateId
│       └── match/
│           └── route.ts   # POST /api/v1/intents/:templateId/match
├── search/
│   └── stream/
│       └── route.ts       # POST /api/v1/search/stream (SSE proxy)
└── events/
    └── route.ts           # GET /api/v1/events (SSE proxy)
```

### New Hooks
```
src/hooks/
├── use-streaming-search.ts    # SSE-based search
├── use-evaluation.ts          # Agent evaluation
├── use-benchmarks.ts          # Available benchmarks
├── use-compose.ts             # Team composition
├── use-intents.ts             # Intent templates
├── use-intent-match.ts        # Match agents to template
└── use-events.ts              # Real-time events subscription
```

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. SSE client infrastructure (`useEvents`, `useStreamingSearch`)
2. New TypeScript types
3. New API routes (proxy to backend)

### Phase 2: Core Features (Week 2)
1. Streaming Search in Explore page
2. Evaluation section on Agent Detail
3. `/evaluate` page

### Phase 3: Team Features (Week 3)
1. `/compose` page with TeamComposer
2. `/intents` gallery page
3. Intent matching flow

### Phase 4: Polish (Week 4)
1. Real-time notifications
2. Header updates
3. Home page enhancements
4. Testing & accessibility

---

## Design Considerations

### Retro Theme Extensions
- Evaluation scores: Use pixel-art progress bars
- Team composition: 8-bit style team roster
- Streaming: CRT-style loading animation
- Notifications: Pixel art toast icons

### New Components Needed
| Component | Type | Purpose |
|-----------|------|---------|
| `EvaluationRadar` | molecule | Radar chart for benchmark scores |
| `StreamingProgress` | atom | Progress indicator for SSE phases |
| `TeamRoster` | organism | Display composed team |
| `IntentCard` | molecule | Template preview card |
| `EventToast` | atom | Real-time notification |
| `BenchmarkBadge` | atom | Small benchmark score indicator |

---

## Testing Requirements

- [ ] E2E tests for new pages (/compose, /intents, /evaluate)
- [ ] SSE connection tests (mock EventSource)
- [ ] Streaming search integration tests
- [ ] Accessibility tests for new components
- [ ] Mobile responsiveness for new layouts

---

## Success Metrics

1. **Streaming Search**: <100ms to first result
2. **Evaluation**: Complete benchmark display for all agents
3. **Composition**: Team suggestion in <3 seconds
4. **Events**: Real-time updates within 1 second
5. **Test Coverage**: Maintain 97%+ coverage

---

## API Documentation Reference

Full API documentation: https://agentauri.github.io/api.8004.dev/

Key pages:
- [Streaming Search](/api/search#streaming)
- [Evaluation](/api/evaluate)
- [Composition](/api/compose)
- [Intent Templates](/api/intents)
- [Events](/api/events)

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Streaming search default? | Opt-in when backend is ready |
| Compose/Intents navigation? | ✅ Header main navigation |
| Evaluation dashboard? | ✅ Separate `/evaluate` page + per-agent tab (when backend ready) |
| Notification style? | Pixel-art toast notifications (when backend ready) |

---

## Implementation Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Streaming Search | ⏳ Pending | Backend SSE not ready |
| Evaluations | ⚠️ Partial | Frontend ready, backend 404 |
| Team Composition | ✅ Done | Fully functional |
| Intent Templates | ✅ Done | Fully functional |
| Real-time Events | ⏳ Pending | Backend SSE not ready |

*Last updated: 2026-01-05*
