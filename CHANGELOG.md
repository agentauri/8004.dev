# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Team Composition page** (`/compose`) - Build optimal agent teams for tasks
- **Intent Templates pages** (`/intents`, `/intents/[id]`) - Browse and use workflow templates
- **Evaluate page** (`/evaluate`) - Evaluation dashboard (backend in development)
- Similar Agents endpoint integration for "Related Agents" section
- MCP Connect modal with multi-client support (Claude Code, Claude Desktop, Cursor)
- Health score display with status badges and warnings
- Last updated timestamp for agent data
- New hooks: `useCompose`, `useIntents`, `useIntentMatches`
- Comprehensive SEO optimization

### Changed
- Updated test suite to 3035 tests with ~97% coverage
- Improved cache management with defensive defaults
- Enhanced API mappers with null/undefined handling

### Fixed
- Compose page NaN fitness score display
- Intent detail page content clearing on "Match Agents" click
- API response handling for empty/null data
- Cache merge strategy for intent templates

## [1.0.0] - 2024-12-01

### Added
- Initial public release
- Multi-chain agent discovery (Ethereum Sepolia, Base Sepolia, Polygon Amoy)
- Semantic search using Agent0 Search Service
- Real-time filtering by status, protocols (MCP, A2A, X402), and capabilities
- Agent detail pages with endpoints, reputation, and feedback
- OASF taxonomy browser and filtering
- 80s retro pixel art design system
- Comprehensive Storybook documentation
- ~97% test coverage
- Accessibility compliance (WCAG 2.1 AA)

### Technical Stack
- Next.js 16.x with App Router
- React 19.x
- TypeScript 5.x
- Tailwind CSS 4.x
- TanStack Query 5.x
- Vitest + Playwright for testing
- Biome for linting
- Storybook 10.x for documentation

[Unreleased]: https://github.com/8004-dev/agent-explorer/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/8004-dev/agent-explorer/releases/tag/v1.0.0
