# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Health score display with status badges and warnings
- Last updated timestamp for agent data
- Repository documentation for public release (LICENSE, CONTRIBUTING, etc.)
- Missing component index.ts files for barrel exports
- Test coverage for `useSimilarAgents`, `useStats`, and `useUrlSearchParams` hooks

### Changed
- Updated package.json with complete metadata for npm

### Fixed
- Component organization improvements

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
