# 8004.dev Frontend - TODO

**Last Updated**: 2026-01-05

This document tracks all remaining work for the 8004.dev Agent Explorer frontend.

---

## Status Overview

| Area | Status | Notes |
|------|--------|-------|
| Core Features | ✅ Done | Search, filters, agent details all working |
| Backend Integration | ✅ Done | All API endpoints integrated |
| Performance Optimization | ✅ Done | useCallback, useMemo, cache strategy implemented |
| Testing | ✅ Done | 3035 tests passing, ~97% coverage |
| Design System | ✅ Done | Retro pixel art theme fully implemented |
| New API Features | ✅ Done | Compose, Intents, Evaluate pages implemented |
| Documentation | ✅ Done | Updated and consolidated |

---

## Completed Recently (2026-01-05)

### New API Feature Integration

1. **Team Composition Page (`/compose`)**
   - Task input form with team composition results
   - Fitness score display with defensive NaN handling
   - Team member cards with roles and contributions

2. **Intent Templates Pages (`/intents`, `/intents/[id]`)**
   - Intent gallery with category filtering
   - Workflow visualization for template steps
   - Agent matching functionality with cache preservation

3. **Evaluate Page (`/evaluate`)**
   - Evaluation dashboard (backend returns 404 - feature in development)

### Bug Fixes (2026-01-05)

1. **Compose Page NaN Score**
   - Fixed fitness score showing "NaN%" with Number.isFinite check
   - Added defensive defaults in `mapTeamComposition()`

2. **Intents Match Agents**
   - Fixed content clearing when clicking "Match Agents"
   - Improved cache merge strategy to preserve existing template data

3. **API Mappers**
   - Added defensive defaults for empty/null responses in all mappers

### Performance Optimizations (2025-12-11)

1. **Query Key Bug Fix**
   - Fixed `useRelatedAgents` query key to include `limit` and `crossChain` parameters
   - Updated `query-keys.ts` signature

2. **React Memoization**
   - Added `useCallback` to 9 handlers in `SearchFilters`
   - Added `useMemo` for `statusOptionsWithCounts` and `hasActiveFilters`

3. **Cache Strategy**
   - Implemented stale-while-revalidate pattern
   - Updated global defaults: `staleTime: 30s`, `gcTime: 5min`

### Bug Fixes (2025-12-11)

1. **CopyButton in AgentCard**
   - Fixed click propagation issue where CopyButton clicks opened parent Link

---

## Remaining Work

### Medium Priority

#### 1. Streaming Search (Backend Feature)
- [ ] Integrate SSE streaming search when backend is ready
- [ ] Add progressive result rendering
- [ ] Show HyDE expanded query metadata

#### 2. Real-time Events (Backend Feature)
- [ ] Integrate SSE events when backend is ready
- [ ] Add notification system for agent updates
- [ ] Show "new agents" badge on explore page

#### 3. E2E Test Coverage
- [ ] Add Playwright tests for critical user flows:
  - Search and filter agents
  - Compose team functionality
  - Intent template matching

### Low Priority

#### 4. Feature Enhancements
- [ ] Agent comparison view (side-by-side)
- [ ] Saved searches / bookmarks
- [ ] Export agent data (CSV/JSON)

#### 5. Storybook Design System Showcase
- [ ] Create a dedicated "Design System" page in Storybook
- [ ] Document color palette usage with live examples

---

## Technical Debt

### Placeholder Endpoints
The `mapAgentToFull` function in `src/lib/api/mappers.ts` creates placeholder endpoint objects with empty strings when `hasMcp`/`hasA2a` are true but no actual URLs are available from the backend.

**Current behavior**:
```typescript
endpoints: {
  mcp: agent.hasMcp ? { url: '', version: '' } : undefined,
  a2a: agent.hasA2a ? { url: '', version: '' } : undefined,
}
```

**Options**:
1. Keep as-is (works for presence detection)
2. Update `AgentEndpoints` type to use boolean flags
3. Wait for backend to provide actual endpoint URLs

**Recommendation**: Keep as-is until backend provides real endpoint data.

---

## Documentation Status

| Document | Status | Action |
|----------|--------|--------|
| `CLAUDE.md` | ✅ Current | Keep - main project guidelines |
| `README.md` | ✅ Current | Keep - project overview |
| `docs/RETRO_DESIGN_SYSTEM.md` | ✅ Current | Keep - comprehensive design system |
| `docs/AG0_SEMANTIC_SEARCH_STANDARD.md` | ✅ Current | Keep - API standard reference |
| `docs/PRD_API_INTEGRATION.md` | ✅ Updated | Keep - API features PRD with status |
| `docs/SIMILAR_AGENTS_API_SPEC.md` | ✅ Implemented | Keep - endpoint is live |
| `docs/TODO.md` | ✅ Current | This document |
| `docs/COMPREHENSIVE_TEST_REPORT.md` | Removed | Stale data - filter testing documented in PRD |
| `docs/SIMILAR_AGENTS_BACKEND_REQUEST.md` | Removed | Feature request fulfilled |

---

## Backend API Integration

The frontend is fully integrated with the 8004 backend at `https://api.8004.dev`.

### Endpoints Used

| Frontend Route | Backend Endpoint | Status |
|----------------|------------------|--------|
| `/api/agents` | `GET /api/v1/agents` | ✅ Working |
| `/api/agents/[id]` | `GET /api/v1/agents/{id}` | ✅ Working |
| `/api/agents/[id]/similar` | `GET /api/v1/agents/{id}/similar` | ✅ Working |
| `/api/agents/[id]/classify` | `GET /api/v1/agents/{id}/classify` | ✅ Working |
| `/api/chains` | `GET /api/v1/chains` | ✅ Working |
| `/api/stats` | `GET /api/v1/stats` | ✅ Working |
| `/api/taxonomy` | `GET /api/v1/taxonomy` | ✅ Working |
| `/api/search` | `POST /api/v1/search` | ✅ Working |
| `/api/compose` | `POST /api/v1/compose` | ✅ Working |
| `/api/intents` | `GET /api/v1/intents` | ✅ Working |
| `/api/intents/[id]` | `GET /api/v1/intents/{id}` | ✅ Working |
| `/api/intents/[id]/match` | `POST /api/v1/intents/{id}/match` | ✅ Working |
| `/api/evaluate` | `GET /api/v1/evaluate/benchmarks` | ⏳ Backend 404 |

### Filter Support

All filters are supported by the backend:
- `mcp`, `a2a`, `x402` - Protocol filters
- `active` - Status filter
- `chainIds` - Multi-chain filter
- `filterMode` - AND/OR mode
- `minRep`, `maxRep` - Reputation range
- `skills`, `domains` - OASF taxonomy
- `showAll` - Include inactive agents

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Time to Interactive (TTI) | < 1.5s | ✅ Met |
| First Contentful Paint (FCP) | < 800ms | ✅ Met |
| Lighthouse Performance | > 90 | ✅ Met |
| Bundle Size (gzipped) | < 100KB | ✅ Met |
| Test Coverage | > 95% | ✅ 97% (3035 tests) |

---

## Contact

- **Repository**: 8004.dev frontend
- **Backend**: api.8004.dev (Cloudflare Workers)
- **Issues**: GitHub Issues

---

*Last updated: 2026-01-05*
