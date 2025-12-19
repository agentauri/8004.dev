# Contributing to Agent Explorer

Thank you for your interest in contributing to Agent Explorer! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/agent-explorer.git
   cd agent-explorer
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/8004-dev/agent-explorer.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run unit tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm storybook` | Start Storybook |

## Development Workflow

### Branch Naming

Create feature branches from `main` using the following conventions:

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `test/description` - Test additions/modifications
- `refactor/description` - Code refactoring

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(search): add semantic search filtering
fix(agent-card): resolve overflow on mobile
docs(readme): update installation instructions
test(hooks): add tests for useSearchAgents
```

## Code Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` when type is uncertain

### React Components

- Use functional components with TypeScript
- Follow Atomic Design methodology (atoms, molecules, organisms, templates)
- Each component should have:
  - `component-name.tsx` - Component implementation
  - `component-name.stories.tsx` - Storybook stories
  - `component-name.test.tsx` - Unit tests

### File Naming

- Components: `kebab-case.tsx`
- Tests: `*.test.tsx` or `*.test.ts`
- Stories: `*.stories.tsx`

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Check for issues
pnpm lint

# Fix issues automatically
pnpm lint:fix
```

## Testing Requirements

### Coverage Thresholds

All code must maintain high test coverage:

| Metric | Threshold |
|--------|-----------|
| Statements | 97% |
| Branches | 85% |
| Functions | 94% |
| Lines | 97% |

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

### Writing Tests

- Unit tests for utilities and pure functions
- Component tests using Testing Library
- Hook tests using `renderHook`
- E2E tests for critical user flows

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest from main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test
   ```

3. **Update documentation** if needed

4. **Add/update tests** for your changes

### PR Requirements

- Clear, descriptive title following commit conventions
- Description explaining what and why
- Link to related issues
- All checks passing
- Coverage maintained or improved
- Approved by at least one maintainer

### Review Process

1. Submit PR with completed checklist
2. Automated checks run (lint, tests, build)
3. Maintainer reviews code
4. Address feedback if any
5. PR is merged once approved

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, Node version, browser
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Error messages**: Console output, stack traces

### Feature Requests

For feature requests:

1. **Use case**: Describe the problem you're solving
2. **Proposed solution**: Your idea for implementation
3. **Alternatives**: Other solutions you've considered
4. **Additional context**: Mockups, examples

## Questions?

- Check existing [issues](https://github.com/8004-dev/agent-explorer/issues)
- Open a [discussion](https://github.com/8004-dev/agent-explorer/discussions)
- Review the [documentation](./docs/)

Thank you for contributing!
