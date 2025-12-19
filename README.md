# Agent Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black.svg)](https://nextjs.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen.svg)](./docs/COMPREHENSIVE_TEST_REPORT.md)

> ERC-8004 Agent Directory & Discovery Platform

A web-based discovery platform for autonomous AI agents registered on the [ERC-8004 (Trustless Agents)](https://eips.ethereum.org/EIPS/eip-8004) standard. Search, filter, and explore agents across multiple blockchain networks with a retro 80s pixel art aesthetic.

## Features

- **Multi-Chain Search** - Discover agents across Ethereum Sepolia, Base Sepolia, and Polygon Amoy
- **Real-Time Filtering** - Filter by status, protocols (MCP, A2A, X402), and capabilities
- **Agent Details** - View comprehensive agent information, endpoints, and reputation
- **80s Retro Design** - Nostalgic pixel art aesthetic with CRT glow effects
- **Accessible** - WCAG 2.1 AA compliant

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/8004-dev/agent-explorer.git
cd agent-explorer

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required - RPC URLs for each supported chain
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
POLYGON_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x |
| Language | TypeScript | 5.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Testing | Vitest + Playwright | latest |
| Linting | Biome | latest |
| Documentation | Storybook | 10.x |

## Project Structure

This project follows the **Atomic Design** methodology:

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   ├── explore/           # Search results page
│   └── agent/[agentId]/   # Agent detail page
├── components/
│   ├── atoms/             # Smallest UI primitives (Badge, Button)
│   ├── molecules/         # Atom combinations (SearchInput, ChainSelector)
│   ├── organisms/         # Complex sections (AgentCard, Header)
│   └── templates/         # Page layouts
├── hooks/                 # TanStack Query hooks
├── lib/
│   ├── api/              # Backend API helpers
│   ├── constants/        # Chain configs
│   ├── filters/          # Filter utilities
│   └── url-params/       # URL state management
└── types/                # TypeScript definitions
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:a11y        # Run accessibility tests

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix lint issues
pnpm typecheck        # TypeScript type checking

# Documentation
pnpm storybook        # Start Storybook on port 6006
pnpm build-storybook  # Build static Storybook
```

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum Sepolia | 11155111 | Active |
| Base Sepolia | 84532 | Active |
| Polygon Amoy | 80002 | Active |

## Contributing

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Run `pnpm lint:fix` before committing.

### Testing Requirements

- All code must have test coverage
- Run `pnpm test:coverage` to verify
- Coverage thresholds: 97% statements, 85% branches, 94% functions, 97% lines

### Commit Messages

Use conventional commits:

```
feat: add agent search functionality
fix: resolve pagination cursor issue
test: add unit tests for search provider
docs: update API documentation
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass: `pnpm test && pnpm typecheck`
4. Submit a PR with a clear description

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | Search agents with filters |
| GET | `/api/agents/[agentId]` | Get agent details |
| GET | `/api/chains` | List supported chains |
| GET | `/api/stats` | Platform statistics |

## Design System

Agent Explorer uses an 80s retro pixel art design inspired by NES/Sega arcade games. Key elements:

- **Fonts**: Press Start 2P, Silkscreen, JetBrains Mono
- **Colors**: CRT-inspired palette with glow effects
- **Animations**: 8-bit step-based transitions

See [RETRO_DESIGN_SYSTEM.md](./docs/RETRO_DESIGN_SYSTEM.md) for complete specifications.

## References

- [ERC-8004 Specification](https://eips.ethereum.org/EIPS/eip-8004)
- [agent0-sdk Documentation](https://sdk.ag0.xyz/)
- [OASF Documentation](https://docs.agntcy.org/oasf/open-agentic-schema-framework/)

## Acknowledgements

This project is built on top of the excellent work by the [Agent0 Lab](https://github.com/agent0lab) team. We extend our gratitude for the following open-source projects that power Agent Explorer:

- **[agent0-ts](https://github.com/agent0lab/agent0-ts)** - TypeScript SDK for interacting with ERC-8004 agents
- **[search-service](https://github.com/agent0lab/search-service)** - Semantic search service for agent discovery
- **[subgraph](https://github.com/agent0lab/subgraph)** - The Graph subgraph for indexing ERC-8004 agent data

Thank you to all contributors who make the ERC-8004 ecosystem possible!

## License

MIT
