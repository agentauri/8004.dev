# 8004.dev Frontend - TODO

**Last Updated**: 2025-12-16

This document tracks all remaining work for the 8004.dev Agent Explorer frontend.

---

## Status Overview

| Area | Status | Notes |
|------|--------|-------|
| Core Features | Done | Search, filters, agent details all working |
| Backend Integration | Done | All API endpoints integrated |
| Performance Optimization | Done | useCallback, useMemo, cache strategy implemented |
| Testing | Done | 1740 tests passing, ~97% coverage |
| Design System | Done | Retro pixel art theme fully implemented |
| Documentation | In Progress | Consolidating and updating |

---

## Completed Recently (2025-12-11)

### Performance Optimizations

1. **Query Key Bug Fix**
   - Fixed `useRelatedAgents` query key to include `limit` and `crossChain` parameters
   - Updated `query-keys.ts` signature

2. **React Memoization**
   - Added `useCallback` to 9 handlers in `SearchFilters`
   - Added `useMemo` for `statusOptionsWithCounts` and `hasActiveFilters`
   - Added `useCallback` to `SortSelector` and `FilterGroup`
   - Fixed `deletePreset` callback dependency in `useFilterPresets`

3. **API Optimization**
   - Reduced over-fetching in `useRelatedAgents` by passing `limit` to API
   - Added `chainIds` parameter for non-crossChain queries

4. **URL Params Optimization**
   - Refactored `useUrlSearchParams` callbacks to use functional updates
   - Memoized `offset` calculation

5. **Cache Strategy**
   - Implemented stale-while-revalidate pattern
   - Updated global defaults: `staleTime: 30s`, `gcTime: 5min`
   - Enabled `refetchOnWindowFocus` and `refetchOnMount`

6. **Style Optimization**
   - Pre-computed `CHAIN_SELECTED_STYLES` to avoid inline object creation

### Bug Fixes

1. **CopyButton in AgentCard**
   - Fixed click propagation issue where CopyButton clicks opened parent Link
   - Added `stopPropagation()` and `preventDefault()`

---

## Remaining Work

### High Priority

#### 1. Storybook Design System Showcase (Optional)
- [ ] Create a dedicated "Design System" page in Storybook
- [ ] Document color palette usage with live examples
- [ ] Add component composition examples

#### 2. E2E Test Coverage
- [ ] Add Playwright tests for critical user flows:
  - Search and filter agents
  - View agent details
  - Copy button functionality
  - Pagination

### Medium Priority

#### 3. Accessibility Audit
- [ ] Run axe DevTools on all pages
- [ ] Verify keyboard navigation works throughout
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Ensure all WCAG 2.1 AA requirements met

#### 4. Performance Monitoring
- [ ] Set up Core Web Vitals monitoring
- [ ] Add performance budgets to CI
- [ ] Profile React DevTools for unnecessary re-renders

#### 5. Error Boundary Improvements
- [ ] Add granular error boundaries per feature area
- [ ] Create user-friendly error states with retry actions
- [ ] Add error tracking/reporting integration

### Low Priority

#### 6. Feature Enhancements
- [ ] Agent comparison view (side-by-side)
- [ ] Saved searches / bookmarks
- [ ] Export agent data (CSV/JSON)
- [ ] Share agent links with preview metadata

#### 7. Developer Experience
- [ ] Add component scaffolding script
- [ ] Improve Storybook loading performance
- [ ] Add visual regression testing (Chromatic)

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
| `CLAUDE.md` | Current | Keep - main project guidelines |
| `README.md` | Current | Keep - project overview |
| `docs/RETRO_DESIGN_SYSTEM.md` | Current | Keep - comprehensive design system |
| `docs/AG0_SEMANTIC_SEARCH_STANDARD.md` | Current | Keep - API standard reference |
| `docs/COMPREHENSIVE_TEST_REPORT.md` | Current | Keep - filter testing with 3 runs for flaky detection |
| `docs/8004_BACKEND_SPEC.md` | Outdated | Removed - backend is live |
| `docs/BACKEND_API_REQUIREMENTS.md` | Outdated | Removed - requirements implemented |
| `docs/OASF_CLASSIFICATION_SERVICE_SPEC.md` | Archive | Removed - backend service is live |
| `docs/FILTER_TESTING_REPORT.md` | Superseded | Removed - replaced by COMPREHENSIVE_TEST_REPORT.md |
| `docs/TODO.md` | Current | This document |

---

## Backend API Integration

The frontend is fully integrated with the 8004 backend at `https://api.8004.dev`.

### Endpoints Used

| Frontend Route | Backend Endpoint | Status |
|----------------|------------------|--------|
| `/api/agents` | `GET /api/v1/agents` | Working |
| `/api/agents/[id]` | `GET /api/v1/agents/{id}` | Working |
| `/api/agents/[id]/classify` | `GET /api/v1/agents/{id}/classify` | Working |
| `/api/chains` | `GET /api/v1/chains` | Working |
| `/api/stats` | `GET /api/v1/stats` | Working |
| `/api/taxonomy` | `GET /api/v1/taxonomy` | Working |

### Filter Support

All filters are now supported by the backend:
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
| Time to Interactive (TTI) | < 1.5s | TBD |
| First Contentful Paint (FCP) | < 800ms | TBD |
| Lighthouse Performance | > 90 | TBD |
| Bundle Size (gzipped) | < 100KB | TBD |
| Test Coverage | > 95% | ~97% |

---

## Contact

- **Repository**: 8004.dev frontend
- **Backend**: api.8004.dev (Cloudflare Workers)
- **Issues**: GitHub Issues

---

*This document should be updated as work progresses.*
