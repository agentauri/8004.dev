# Frontend Roadmap - 8004.dev Agent Explorer

**Version**: 1.0
**Last Updated**: 2026-01-06
**Status**: Final

---

## Executive Summary

This roadmap outlines all frontend development work for the 8004.dev Agent Explorer. The core platform is complete with 97% test coverage. This document covers enhancements, new features, and items waiting on backend API availability.

---

## Current State

| Metric | Value |
|--------|-------|
| Test Coverage | 97% (3035 tests) |
| Lighthouse Score | > 90 |
| Pages Implemented | 11 |
| Components | 50+ |
| Accessibility | WCAG 2.1 AA |

### Implemented Features
- Agent search with semantic search
- Advanced filtering (chain, protocol, reputation, OASF)
- Agent detail pages with full metadata
- Leaderboard (mock data)
- Global feedbacks (mock data)
- Trending agents (mock data)
- Team composer
- Intent templates
- Evaluations (UI ready, BE 404)
- Taxonomy browser

---

## Phase 1: Backend Integration (Blocked)

**Timeline**: When backend ready (~2.5 days)

These features have UI ready but are waiting on backend API endpoints.

### 1.1 Remove Mock Data - Leaderboard
**Priority**: P0 - Critical
**Blocked By**: `GET /api/v1/leaderboard`
**Effort**: 0.5 days

**Files to Update**:
- `src/app/api/leaderboard/route.ts` - Remove mock generation
- `src/types/leaderboard.ts` - Add `previousRank` field for trend

**Tasks**:
- [ ] Remove mock data generation from API route
- [ ] Add `previousRank?: number` to `LeaderboardEntry` type
- [ ] Update error handling for real API errors
- [ ] Add retry logic for transient failures
- [ ] Update E2E tests with real data expectations

---

### 1.2 Remove Mock Data - Feedbacks
**Priority**: P0 - Critical
**Blocked By**: `GET /api/v1/feedbacks`
**Effort**: 0.5 days

**Files to Update**:
- `src/app/api/feedbacks/route.ts` - Remove mock generation

**Tasks**:
- [ ] Remove mock data generation
- [ ] Integrate real feedback stats from API
- [ ] Update infinite scroll with real cursor
- [ ] Verify score scale consistency (0-100)

---

### 1.3 Remove Mock Data - Trending
**Priority**: P0 - Critical
**Blocked By**: `GET /api/v1/trending`
**Effort**: 0.5 days

**Files to Update**:
- `src/app/api/trending/route.ts` - Remove mock generation

**Tasks**:
- [ ] Remove mock data generation
- [ ] Update trend indicators with real deltas
- [ ] Handle missing historical data gracefully
- [ ] Support `stable` trend value (not just up/down)

---

### 1.4 Evaluations - Full Integration
**Priority**: P0 - Critical
**Blocked By**: `GET /api/v1/evaluations`
**Effort**: 1 day

**Tasks**:
- [ ] Update API routes when backend ready
- [ ] Test evaluation creation flow
- [ ] Verify status polling works correctly
- [ ] Add evaluation detail page improvements

---

## Phase 2: Real-time Features (Backend Dependent)

**Timeline**: When backend SSE ready (~6 days)

### 2.1 Streaming Search Enhancement
**Priority**: P1 - High
**Blocked By**: Backend SSE improvements
**Effort**: 2 days

**Current State**: Basic streaming works with fallback

**Enhancements**:
- Display HyDE expanded query in UI
- Add estimated time remaining
- Show "searching in X sources" indicator
- Animate results as they stream in
- Add "stop search" button

**Files to Update**:
- `src/components/organisms/search-results/`
- `src/components/organisms/search-bar/`
- `src/hooks/use-streaming-search.ts`

**Tasks**:
- [ ] Add HyDE query display component
- [ ] Create progress indicator with ETA
- [ ] Add cancel/stop button functionality
- [ ] Implement smooth result animations
- [ ] Update streaming hook for metadata

---

### 2.2 Real-time Event Notifications
**Priority**: P1 - High
**Blocked By**: `GET /api/v1/events`
**Effort**: 3 days

**Description**: Show real-time updates for platform activity

**New Components**:
```
src/components/molecules/notification-toast/
  ├── notification-toast.tsx
  ├── notification-toast.stories.tsx
  └── notification-toast.test.tsx
src/components/atoms/activity-badge/
src/components/organisms/live-feed/
src/hooks/use-real-time-events.ts
```

**Tasks**:
- [ ] Create `useRealTimeEvents` hook with reconnection logic
- [ ] Build notification toast system
- [ ] Create activity indicator component
- [ ] Implement event filtering by type
- [ ] Add sound/vibration options (user preference)

---

### 2.3 "New Agents" Badge
**Priority**: P1 - High
**Depends On**: Real-time Events
**Effort**: 0.5 days

**Description**: Show badge when new agents registered since last visit

**Tasks**:
- [ ] Track last visit timestamp (localStorage)
- [ ] Subscribe to `agent:new` events
- [ ] Show badge with count on Explore nav link
- [ ] Clear badge when user visits Explore
- [ ] Add pulse animation for attention

---

## Phase 3: New Features (Independent)

**Timeline**: Can start immediately (~16 days)

### 3.1 Agent Comparison View
**Priority**: P1 - High (upgraded from P2)
**Route**: `/compare`
**Effort**: 3-4 days

**Description**: Side-by-side comparison of 2-4 agents

**Features**:
- Select agents from search or bookmarks
- Compare: reputation, protocols, endpoints, OASF skills
- Highlight differences
- Share comparison URL

**New Files**:
```
src/app/compare/page.tsx
src/components/organisms/comparison-table/
  ├── comparison-table.tsx
  ├── comparison-table.stories.tsx
  └── comparison-table.test.tsx
src/components/molecules/agent-selector/
src/hooks/use-comparison.ts
```

**Tasks**:
- [ ] Create comparison page with URL state
- [ ] Build comparison table component
- [ ] Add "Compare" button to AgentCard
- [ ] Implement agent selector modal
- [ ] Add comparison to agent detail page
- [ ] Create shareable comparison URLs

---

### 3.2 Saved Searches / Bookmarks
**Priority**: P2 - Medium
**Effort**: 2-3 days

**Description**: Save favorite agents and search queries

**Features**:
- Bookmark agents (localStorage initially)
- Save search queries with filters
- Quick access from header
- Export/import bookmarks

**New Files**:
```
src/components/molecules/bookmark-button/
src/components/organisms/bookmarks-dropdown/
src/app/bookmarks/page.tsx
src/hooks/use-bookmarks.ts
src/lib/storage/bookmarks.ts
```

**Tasks**:
- [ ] Create bookmark context/store
- [ ] Add bookmark button to AgentCard
- [ ] Create bookmarks dropdown in Header
- [ ] Build saved searches management UI
- [ ] Implement localStorage persistence
- [ ] Add export/import JSON functionality

---

### 3.3 Export Agent Data
**Priority**: P2 - Medium
**Effort**: 1-2 days

**Description**: Export search results or agent details

**Export Formats**:
- CSV (spreadsheet compatible)
- JSON (developer friendly)

**New Files**:
```
src/lib/export/csv.ts
src/lib/export/json.ts
src/components/molecules/export-dialog/
```

**Tasks**:
- [ ] Create CSV export utility
- [ ] Create JSON export utility
- [ ] Add "Export" button to Explore page
- [ ] Add "Export" to agent detail page
- [ ] Handle large datasets (streaming export)
- [ ] Add format selection dialog

---

### 3.4 Agent Watchlist
**Priority**: P2 - Medium
**Effort**: 2-3 days

**Description**: Monitor specific agents for changes

**Features**:
- Add agents to watchlist
- Configure alert thresholds
- Dashboard view of watched agents
- Integration with real-time events (when available)

**New Files**:
```
src/app/watchlist/page.tsx
src/components/organisms/watchlist-table/
src/hooks/use-watchlist.ts
src/lib/storage/watchlist.ts
```

**Tasks**:
- [ ] Create watchlist context/store
- [ ] Build watchlist management page
- [ ] Add "Watch" button to agent cards
- [ ] Show watched agents on home page
- [ ] Add threshold configuration UI

---

### 3.5 Reputation History Chart
**Priority**: P2 - Medium
**Depends On**: Backend `/api/v1/agents/:id/reputation/history`
**Effort**: 2 days

**Description**: Visual chart of reputation over time

**Dependencies to Install**:
```bash
pnpm add recharts
```

**New Files**:
```
src/components/organisms/reputation-chart/
  ├── reputation-chart.tsx
  ├── reputation-chart.stories.tsx
  └── reputation-chart.test.tsx
src/hooks/use-reputation-history.ts
```

**Tasks**:
- [ ] Install recharts library
- [ ] Create ReputationChart component
- [ ] Add to agent detail page
- [ ] Implement time range controls (7d/30d/90d/1y)
- [ ] Add loading skeleton
- [ ] Show feedback events as markers

---

### 3.6 Agent Health Dashboard
**Priority**: P2 - Medium
**Depends On**: Backend `/api/v1/agents/:id/health`
**Effort**: 2-3 days

**Description**: Detailed health status on agent detail page

**New Files**:
```
src/components/organisms/health-dashboard/
src/components/molecules/uptime-indicator/
src/components/molecules/response-time-chart/
src/hooks/use-agent-health.ts
```

**Tasks**:
- [ ] Create health status component
- [ ] Add uptime percentage display
- [ ] Show response time metrics
- [ ] Add health history timeline
- [ ] Create health alerts section

---

## Phase 4: UX Enhancements

**Timeline**: Independent (~12 days)

### 4.1 SEO Optimization
**Priority**: P2 - Medium
**Effort**: 1-2 days

**Tasks**:
- [ ] Verify OpenGraph meta tags on all pages
- [ ] Add Twitter card support
- [ ] Generate dynamic sitemap.xml
- [ ] Add JSON-LD structured data for agents
- [ ] Optimize page titles and descriptions
- [ ] Add canonical URLs

---

### 4.2 Keyboard Shortcuts
**Priority**: P2 - Medium
**Effort**: 1 day

**Shortcuts**:
| Key | Action |
|-----|--------|
| `/` | Focus search |
| `g h` | Go to home |
| `g e` | Go to explore |
| `g l` | Go to leaderboard |
| `?` | Show shortcuts help |
| `Esc` | Close modals |

**New Files**:
```
src/hooks/use-keyboard-shortcuts.ts
src/components/molecules/shortcuts-modal/
```

**Tasks**:
- [ ] Create keyboard shortcut hook
- [ ] Add shortcut indicators to UI
- [ ] Create shortcuts help modal
- [ ] Document in accessibility section

---

### 4.3 Storybook Design System Page
**Priority**: P3 - Low
**Effort**: 1 day

**Tasks**:
- [ ] Create "Design System" section in Storybook
- [ ] Document color palette with live swatches
- [ ] Show typography scale
- [ ] Document spacing system
- [ ] Add interactive examples

---

### 4.4 Dark/Light Theme Toggle
**Priority**: P3 - Low
**Effort**: 3-4 days

**Current State**: Dark theme only (retro design)

**Tasks**:
- [ ] Define light theme color palette
- [ ] Create theme context
- [ ] Add toggle to header
- [ ] Persist preference (localStorage)
- [ ] Update all components for theme support
- [ ] Test contrast ratios (WCAG AA)

---

### 4.5 Multi-language Support (i18n)
**Priority**: P3 - Low (Deferred)
**Effort**: 7-10 days

**Note**: Deferred due to significant effort. Consider for future release.

**Languages**: English (default), Spanish, Chinese, Japanese

**Tasks**:
- [ ] Install next-intl
- [ ] Extract all strings to translation files
- [ ] Create language selector
- [ ] Add locale routing
- [ ] Commission translations

---

## Phase 5: Quality & Infrastructure

**Timeline**: Ongoing (~6 days)

### 5.1 E2E Test Coverage Expansion
**Priority**: P1 - High
**Effort**: 2-3 days

**New Test Scenarios**:
- [ ] Team composition full flow
- [ ] Intent template matching
- [ ] Evaluation creation and viewing
- [ ] Leaderboard filtering and pagination
- [ ] Feedback browsing
- [ ] Agent comparison (when built)
- [ ] Bookmark management (when built)

---

### 5.2 Error Tracking & Monitoring
**Priority**: P2 - Medium
**Effort**: 1 day

**Tasks**:
- [ ] Integrate Sentry (or similar)
- [ ] Set up error boundaries with reporting
- [ ] Track API error rates
- [ ] Add custom error context
- [ ] Configure alert thresholds

---

### 5.3 Performance Monitoring
**Priority**: P2 - Medium
**Effort**: 1 day

**Tasks**:
- [ ] Add Web Vitals tracking
- [ ] Implement performance marks for key interactions
- [ ] Set up performance budgets
- [ ] Add bundle size tracking to CI

---

### 5.4 Accessibility Audit
**Priority**: P2 - Medium
**Effort**: 1 day

**Tasks**:
- [ ] Run full axe-core audit on all pages
- [ ] Fix any WCAG AA violations
- [ ] Add screen reader testing
- [ ] Document accessibility features
- [ ] Test with keyboard-only navigation

---

### 5.5 Feature Flags System
**Priority**: P2 - Medium
**Effort**: 0.5 days

**New Files**:
```typescript
// src/lib/feature-flags.ts
export const features = {
  comparison: false,
  bookmarks: false,
  watchlist: false,
  export: false,
  streaming: true,
  realTimeEvents: false,
} as const;

export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature];
}
```

**Tasks**:
- [ ] Create feature flags configuration
- [ ] Add environment-based overrides
- [ ] Create FeatureGate component
- [ ] Document feature flag usage

---

### 5.6 Analytics Integration
**Priority**: P3 - Low
**Effort**: 1 day

**Tasks**:
- [ ] Choose analytics provider (Plausible, PostHog, etc.)
- [ ] Add page view tracking
- [ ] Track key user actions (search, filter, compare)
- [ ] Set up conversion funnels
- [ ] Create analytics dashboard

---

## Technical Debt

### TD-1: Placeholder Endpoints
**File**: `src/lib/api/mappers.ts`
**Status**: Waiting on backend

**Issue**: Creates empty endpoint objects when `hasMcp`/`hasA2a` true but no URLs available.

**Resolution**: Update when backend provides real endpoint URLs.

---

### TD-2: Mock Data Files
**Files**:
- `src/app/api/leaderboard/route.ts`
- `src/app/api/feedbacks/route.ts`
- `src/app/api/trending/route.ts`

**Status**: Remove when backend ready

---

### TD-3: Type Alignment
**File**: `src/types/leaderboard.ts`

**Issue**: Missing `previousRank` field that backend will provide.

**Resolution**: Add field when backend endpoint available.

---

## Dependencies

### Libraries to Install

| Library | Purpose | Phase |
|---------|---------|-------|
| `recharts` | Reputation charts | 3.5 |
| `@sentry/nextjs` | Error tracking | 5.2 |
| `next-intl` | i18n (if implemented) | 4.5 |

### External Services

| Service | Purpose | Phase |
|---------|---------|-------|
| Sentry | Error monitoring | 5.2 |
| Plausible/PostHog | Analytics | 5.6 |

---

## Implementation Timeline (Revised)

```
Phase 1 (Backend Integration):    When BE ready
├── Remove Leaderboard mocks      (0.5 day)
├── Remove Feedbacks mocks        (0.5 day)
├── Remove Trending mocks         (0.5 day)
└── Evaluations integration       (1 day)
                                  ─────────
                                  2.5 days

Phase 2 (Real-time):              When BE SSE ready
├── Streaming Search enhance      (2 days)
├── Real-time notifications       (3 days)
└── New Agents badge              (0.5 day)
                                  ─────────
                                  5.5 days

Phase 3 (New Features):           Can start now
├── Agent Comparison (P1)         (3-4 days)
├── Bookmarks/Saved Searches      (2-3 days)
├── Export Data                   (1-2 days)
├── Watchlist                     (2-3 days)
├── Reputation Chart*             (2 days)
└── Health Dashboard*             (2-3 days)
                                  ─────────
                                  13-17 days
                                  * Needs backend

Phase 4 (UX):                     Can start now
├── SEO Optimization              (1-2 days)
├── Keyboard Shortcuts            (1 day)
├── Storybook Design Page         (1 day)
├── Theme Toggle                  (3-4 days)
└── i18n (deferred)               (7-10 days)
                                  ─────────
                                  6-8 days (excl. i18n)

Phase 5 (Quality):                Can start now
├── E2E Test Expansion            (2-3 days)
├── Error Tracking                (1 day)
├── Performance Monitoring        (1 day)
├── Accessibility Audit           (1 day)
├── Feature Flags                 (0.5 day)
└── Analytics Integration         (1 day)
                                  ─────────
                                  6-7.5 days

═══════════════════════════════════════════
Total Independent Work:           25-33 days
Total Backend-Dependent:          8 days
═══════════════════════════════════════════
```

---

## Dependencies Graph

```
Backend Ready
    │
    ├─► Phase 1: Mock Removal (2.5 days)
    │       │
    │       └─► Phase 2: Real-time Features (5.5 days)
    │               │
    │               ├─► New Agents Badge
    │               └─► Watchlist (enhanced)
    │
    ├─► Reputation History Chart
    │
    └─► Health Dashboard

Independent (can start now)
    │
    ├─► Agent Comparison (P1 - start first)
    ├─► Bookmarks/Saved Searches
    ├─► Export Data
    ├─► SEO Optimization
    ├─► Keyboard Shortcuts
    ├─► Feature Flags
    ├─► Error Tracking
    ├─► E2E Tests
    └─► Storybook Design Page
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage | 97% | Maintain > 95% |
| Lighthouse Performance | > 90 | Maintain > 90 |
| E2E Test Pass Rate | 100% | Maintain 100% |
| Accessibility | WCAG AA | Maintain WCAG AA |
| Bundle Size | < 100KB | < 120KB gzipped |
| Core Web Vitals | Pass | Pass |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Backend delays | Focus on independent features first |
| Scope creep | Use feature flags for gradual rollout |
| Performance regression | Monitor bundle size in CI |
| Accessibility issues | Run axe-core in E2E tests |

---

*Document Status: FINAL*
*Last Review: 2026-01-06*
