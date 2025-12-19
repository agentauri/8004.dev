# CLAUDE.md - Agent Explorer Project Guidelines

## Project Overview

**Agent Explorer** is a web-based discovery platform for autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard. The platform enables users to search, filter, and explore agents across multiple blockchain networks.

### Core Principles

1. **Backend API Data Access**: All blockchain data MUST be accessed through the 8004 backend API (`api.8004.dev`). Never interact directly with smart contracts or RPC endpoints.
2. **Read-Only Operations**: This is a discovery platform with no write operations. No wallet connections, no transactions.
3. **Usability First**: Prioritize user experience in all design and implementation decisions.
4. **High Test Coverage**: All code must have ~97% test coverage. Maintain comprehensive testing across all layers.
5. **Atomic Design**: Components follow Atomic Design methodology (Atoms → Molecules → Organisms → Templates → Pages).
6. **Storybook Documentation**: Every component must have Storybook stories with full documentation.

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x |
| Runtime | Node.js | 18+ |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Backend | 8004 API | api.8004.dev |
| Testing | Vitest + Testing Library | latest |
| Linting | Biome | latest |
| Documentation | Storybook | 10.x |

---

## Language Requirements

**IMPORTANT**: All content in this repository MUST be in English:

- Code (variable names, function names, class names)
- Comments and documentation
- Commit messages
- File names
- Error messages
- UI text and labels
- Test descriptions
- Type definitions and interfaces

---

## Supported Chains

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum Sepolia | 11155111 | Active |
| Base Sepolia | 84532 | Active |
| Polygon Amoy | 80002 | Active |

---

## Project Structure (Atomic Design)

```
src/
├── app/                         # Next.js App Router
│   ├── api/                    # API Route Handlers
│   ├── explore/                # Search results page
│   └── agent/[agentId]/        # Agent detail page
│
├── components/
│   ├── atoms/                  # Smallest UI primitives
│   │   ├── chain-badge/
│   │   │   ├── chain-badge.tsx
│   │   │   ├── chain-badge.stories.tsx
│   │   │   └── chain-badge.test.tsx
│   │   ├── trust-score/
│   │   ├── copy-button/
│   │   └── index.ts
│   │
│   ├── molecules/              # Atom combinations
│   │   ├── search-input/
│   │   ├── chain-selector/
│   │   ├── agent-badges/
│   │   └── index.ts
│   │
│   ├── organisms/              # Feature sections
│   │   ├── header/
│   │   ├── agent-card/
│   │   ├── search-bar/
│   │   └── index.ts
│   │
│   ├── templates/              # Page layouts
│   │   ├── main-layout/
│   │   ├── explore-template/
│   │   └── index.ts
│   │
│   └── ui/                     # shadcn/ui base components
│
├── hooks/                      # TanStack Query hooks
├── lib/
│   ├── agent0/                 # SDK wrapper layer
│   ├── search/                 # Search provider abstraction
│   ├── constants/              # Chain configs, constants
│   └── utils.ts                # Utility functions
└── types/                      # TypeScript type definitions
```

---

## Atomic Design Principles

### Component Hierarchy

| Level | Definition | Characteristics |
|-------|------------|-----------------|
| **Atoms** | Smallest indivisible UI elements | No custom dependencies; pure presentational; highly reusable |
| **Molecules** | Simple groups of atoms | Combine 2-3 atoms; single responsibility; no business logic |
| **Organisms** | Complex UI sections | Feature-specific; may have local state; handle interactions |
| **Templates** | Page layouts without content | Define content areas; responsive structure |
| **Pages** | Templates with real data | Data fetching; routing; business logic |

### Lean Component Principles

1. **Single Responsibility**: Each component does one thing well
2. **Minimal Props**: Small, focused interfaces - avoid prop explosion
3. **No Business Logic**: Presentational components are pure - use containers for logic
4. **Composition Over Configuration**: Build with composable blocks, not config flags

### Component File Structure

Each component must be in its own folder with:

```
component-name/
├── component-name.tsx          # Component implementation
├── component-name.stories.tsx  # Storybook stories
└── component-name.test.tsx     # Unit tests
```

---

## Storybook Requirements

### Every Component Must Have Stories

No component is complete without Storybook documentation.

### Story Organization

Stories are organized by atomic level in the sidebar:
- `Atoms/ChainBadge`
- `Molecules/AgentBadges`
- `Organisms/AgentCard`
- `Templates/ExploreTemplate`

### Story Requirements

Each component's stories must include:
1. **Default** - Basic usage with typical props
2. **Variants** - All visual/behavioral variants
3. **Edge Cases** - Empty, loading, error states
4. **Composition** - How it's used in context
5. **Autodocs** - Automatic documentation tag

### Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

const meta = {
  title: 'Atoms/ComponentName',  // Use correct atomic level
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Clear description of what this component does.',
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // typical props
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
```

---

## Testing Requirements

### Coverage Requirement: ~97%

All code should maintain high test coverage (~97%). Target thresholds:

- **Statements**: 97%
- **Branches**: 85%
- **Functions**: 94%
- **Lines**: 97%

### Testing Strategy

```typescript
// Unit tests for utilities and pure functions
// src/lib/utils.test.ts

// Component tests with Testing Library
// src/components/agent/agent-card.test.tsx

// Hook tests with renderHook
// src/hooks/use-agents.test.ts

// API route tests
// src/app/api/agents/route.test.ts

// Integration tests for critical flows
// src/__tests__/integration/search-flow.test.tsx
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `src/__tests__/integration/*.test.ts`
- E2E tests: `src/__tests__/e2e/*.test.ts`

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '*.config.*'],
      thresholds: {
        statements: 97,
        branches: 85,
        functions: 94,
        lines: 97,
      },
    },
  },
});
```

---

## Code Style Guidelines

### TypeScript

- Use strict mode (`"strict": true`)
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` when type is uncertain

```typescript
// Good
interface Agent {
  id: string;
  name: string;
  chainId: number;
}

function getAgent(id: string): Promise<Agent | null> {
  // implementation
}

// Bad
type Agent = { id: any; name: any };
const getAgent = (id) => { /* ... */ };
```

### React Components

- Use functional components with TypeScript
- Prefer named exports
- Co-locate component tests

```typescript
// src/components/agent/agent-card.tsx
export interface AgentCardProps {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
}

export function AgentCard({ agent, onSelect }: AgentCardProps): JSX.Element {
  // implementation
}
```

### File Naming

- Components: `kebab-case.tsx` (e.g., `agent-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-address.ts`)
- Types: `kebab-case.ts` (e.g., `agent.ts`)
- Tests: `*.test.ts` or `*.test.tsx`

---

## Agent ID Format

Agent IDs follow the format: `{chainId}:{tokenId}`

```typescript
// Examples
const agentId = '11155111:123';  // Sepolia agent #123
const agentId = '84532:456';     // Base Sepolia agent #456
```

---

## API Design

### Response Format

All API responses follow this structure:

```typescript
// Success response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    hasMore?: boolean;
    nextCursor?: string;
  };
}

// Error response
interface ApiError {
  success: false;
  error: string;
  code: string;
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | Search agents with filters |
| GET | `/api/agents/[agentId]` | Get agent details |
| GET | `/api/chains` | List supported chains |
| GET | `/api/stats` | Platform statistics |

---

## Data Layer Architecture

The frontend uses the 8004 backend API for all data operations:

- **GET /api/agents** - Structured listing with filters (no text query)
- **POST /api/search** - Semantic search with natural language queries

TanStack Query handles client-side caching with a stale-while-revalidate pattern.

---

## Semantic Search Service

Agent Explorer integrates with the **Agent0 Semantic Search Service** for natural language agent discovery.

### Service Info

| Property | Value |
|----------|-------|
| Repository | https://github.com/agent0lab/search-service |
| Endpoint | `https://agent0-semantic-search.dawid-pisarczyk.workers.dev` |
| Technology | Cloudflare Workers + Venice AI + Pinecone |

### API Contract

#### POST /api/search

Performs semantic search using natural language queries.

**Request:**
```typescript
interface SemanticQueryRequest {
  /** Natural language search query (1-1000 characters) */
  query: string;
  /** Number of results to return (1-100, default: 5) */
  topK?: number;
  /** Minimum similarity score threshold (0-1) */
  minScore?: number;
  /** Optional filters */
  filters?: {
    capabilities?: string[];  // e.g., ['mcp', 'a2a']
    inputMode?: string;       // e.g., 'text'
    outputMode?: string;      // e.g., 'json'
  };
}
```

**Response:**
```typescript
interface SemanticSearchResponse {
  /** Original query string */
  query: string;
  /** Ranked search results */
  results: SemanticSearchResult[];
  /** Total number of results */
  total: number;
  /** ISO8601 timestamp */
  timestamp: string;
}

interface SemanticSearchResult {
  /** Result ranking (1-based) */
  rank: number;
  /** Vector database ID */
  vectorId: string;
  /** Agent ID format: "chainId:tokenId" */
  agentId: string;
  /** Blockchain network ID */
  chainId: number;
  /** Agent name */
  name: string;
  /** Agent description */
  description: string;
  /** Relevance score (0-1, higher is better) */
  score: number;
  /** Additional agent metadata */
  metadata: Record<string, unknown>;
  /** Explanations for why this result matched */
  matchReasons: string[];
}
```

#### GET /health

Returns service health status.

**Response:**
```typescript
interface HealthResponse {
  status: 'ok' | 'error';
  services: {
    venice: 'ok' | 'error';
    pinecone: 'ok' | 'error';
  };
  timestamp: string;
}
```

### Usage Example

```typescript
const searchAgents = async (query: string) => {
  const response = await fetch(
    'https://agent0-semantic-search.dawid-pisarczyk.workers.dev/api/search',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        topK: 10,
        minScore: 0.5,
        filters: {
          capabilities: ['mcp'],
        },
      }),
    }
  );
  return response.json();
};

// Example: Find agents for code review
const results = await searchAgents('AI agent that can review code and suggest improvements');
```

### Validation Limits

| Parameter | Limit |
|-----------|-------|
| Query length | 1-1000 characters |
| topK | 1-100 results |
| minScore | 0-1 |
| Request size | 10KB max |

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| Time to Interactive (TTI) | < 1.5s |
| First Contentful Paint (FCP) | < 800ms |
| Lighthouse Performance Score | > 90 |
| Bundle Size (gzipped) | < 100KB |
| Search Response Time (P95) | < 500ms |

---

## Error Handling

### Client-Side

- Use skeleton loaders during data fetching
- Implement automatic retry with exponential backoff
- Show user-friendly error messages
- Provide retry actions

### Server-Side

- Log errors with context
- Return appropriate HTTP status codes
- Never expose internal error details to clients

```typescript
// API route error handling
try {
  const result = await searchAgents(params);
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Search failed:', error);
  return NextResponse.json(
    { success: false, error: 'Search failed', code: 'SEARCH_ERROR' },
    { status: 500 }
  );
}
```

---

## Environment Variables

```bash
# Required
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
POLYGON_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Git Commit Guidelines

Use conventional commits:

```
feat: add agent search functionality
fix: resolve pagination cursor issue
test: add unit tests for search provider
docs: update API documentation
refactor: simplify chain selector logic
style: format code with biome
chore: update dependencies
```

---

## Design System: 80s Retro Pixel Art

Agent Explorer uses a **nostalgic 80s arcade aesthetic** inspired by NES/Sega pixel art games while maintaining enterprise-grade usability.

### Design Pillars
1. **Instantly Recognizable**: Bold retro aesthetic for visual distinction
2. **Highly Functional**: Pixel art as enhancement, not hindrance to UX
3. **Accessibility First**: WCAG 2.1 AA compliant
4. **80/20 Rule**: 80% usability, 20% retro flair

### Color Palette

```css
/* Primary Colors (NES/Sega Inspired) */
--pixel-blue-sky: #5C94FC;     /* Primary action - Mario sky blue */
--pixel-red-fire: #FC5454;     /* Error/danger */
--pixel-green-pipe: #00D800;   /* Success */
--pixel-gold-coin: #FCC03C;    /* Highlight/premium */

/* Dark Theme Base */
--pixel-black: #000000;        /* Pure black background */
--pixel-gray-dark: #1A1A1A;    /* Card backgrounds */
--pixel-gray-800: #2A2A2A;     /* Elevated surfaces */
--pixel-gray-700: #3A3A3A;     /* Borders */
--pixel-white: #FFFFFF;        /* Primary text */

/* Chain Colors */
--chain-sepolia: #FC5454;      /* Ethereum red */
--chain-base: #5C94FC;         /* Base blue */
--chain-polygon: #9C54FC;      /* Polygon purple */
```

### Typography

| Use | Font | Purpose |
|-----|------|---------|
| Display | Press Start 2P | Page titles, hero text |
| Headings | Silkscreen | Card titles, badges, labels |
| Body | JetBrains Mono | Descriptions, addresses |
| UI | Inter | Form inputs, long text |

### Animation Principles
- Use `steps()` timing for authentic 8-bit feel
- Keep duration under 300ms
- Use transform and opacity only for performance
- Respect `prefers-reduced-motion`

### Component Styling Rules
- **Buttons**: 2px solid borders, colored box-shadow for depth
- **Cards**: Dark backgrounds with pixel corners on hover
- **Badges**: Uppercase pixel font, chain-specific glow colors
- **Inputs**: JetBrains Mono for readability, blue glow on focus

### CRT Glow Effects
```css
.glow-blue { box-shadow: 0 0 20px rgba(92, 148, 252, 0.5); }
.glow-green { box-shadow: 0 0 20px rgba(0, 216, 0, 0.5); }
.glow-gold { box-shadow: 0 0 20px rgba(252, 192, 60, 0.5); }
```

For complete design specifications, see: [Retro Design System](./docs/RETRO_DESIGN_SYSTEM.md)

---

## Storybook Configuration

Storybook is configured to use `@storybook/react-webpack5` (not `@storybook/nextjs`) to avoid compatibility issues with Next.js 15.5+.

### Key Configuration

- **Framework**: `@storybook/react-webpack5` with Babel compiler
- **Babel**: Configured with `@babel/preset-react` (automatic runtime) and `@babel/preset-typescript`
- **Next.js Mocks**: Components like `next/link` are mocked in `.storybook/mocks/`

### Running Storybook

```bash
pnpm storybook      # Start Storybook dev server on port 6006
pnpm build-storybook # Build static Storybook
```

### Adding Next.js Component Mocks

When using Next.js components in Storybook, add mocks in `.storybook/mocks/` and configure aliases in `.storybook/main.ts`:

```typescript
webpackFinal: async (config) => {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      'next/link': path.resolve(__dirname, './mocks/next-link.tsx'),
    };
  }
  return config;
},
```

---

## References

- [ERC-8004 Specification](https://eips.ethereum.org/EIPS/eip-8004)
- [8004 Backend API](https://api.8004.dev)
- [OASF Documentation](https://docs.agntcy.org/oasf/open-agentic-schema-framework/)
- [AG0 Semantic Search Standard](./docs/AG0_SEMANTIC_SEARCH_STANDARD.md)
- [Retro Design System](./docs/RETRO_DESIGN_SYSTEM.md)
