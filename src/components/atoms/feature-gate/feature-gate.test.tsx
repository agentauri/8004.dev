import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureGate } from './feature-gate';

describe('FeatureGate', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage.store[key];
    }),
  };

  beforeEach(() => {
    mockLocalStorage.store = {};
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('renders children when feature is enabled', () => {
    // keyboardShortcuts is enabled by default
    render(
      <FeatureGate flag="keyboardShortcuts">
        <span data-testid="feature-content">Feature Content</span>
      </FeatureGate>,
    );

    expect(screen.getByTestId('feature-content')).toBeInTheDocument();
    expect(screen.getByText('Feature Content')).toBeVisible();
  });

  it('renders nothing when feature is disabled and no fallback', () => {
    // agentComparison is disabled by default
    const { container } = render(
      <FeatureGate flag="agentComparison">
        <span data-testid="feature-content">Feature Content</span>
      </FeatureGate>,
    );

    expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('renders fallback when feature is disabled', () => {
    render(
      <FeatureGate
        flag="agentComparison"
        fallback={<span data-testid="fallback">Coming Soon</span>}
      >
        <span data-testid="feature-content">Feature Content</span>
      </FeatureGate>,
    );

    expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeVisible();
  });

  it('respects localStorage overrides', () => {
    // Enable a normally disabled feature
    mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
      agentComparison: true,
    });

    render(
      <FeatureGate flag="agentComparison">
        <span data-testid="feature-content">Feature Content</span>
      </FeatureGate>,
    );

    expect(screen.getByTestId('feature-content')).toBeInTheDocument();
  });

  it('renders complex children correctly', () => {
    render(
      <FeatureGate flag="keyboardShortcuts">
        <div data-testid="parent">
          <span data-testid="child-1">Child 1</span>
          <span data-testid="child-2">Child 2</span>
        </div>
      </FeatureGate>,
    );

    expect(screen.getByTestId('parent')).toBeInTheDocument();
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders complex fallback correctly', () => {
    render(
      <FeatureGate
        flag="agentComparison"
        fallback={
          <div data-testid="fallback-parent">
            <span>This feature is</span>
            <span>coming soon</span>
          </div>
        }
      >
        <span>Hidden Content</span>
      </FeatureGate>,
    );

    expect(screen.getByTestId('fallback-parent')).toBeInTheDocument();
    expect(screen.getByText('coming soon')).toBeVisible();
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('handles null fallback explicitly', () => {
    const { container } = render(
      <FeatureGate flag="agentComparison" fallback={null}>
        <span>Hidden Content</span>
      </FeatureGate>,
    );

    expect(container.firstChild).toBeNull();
  });
});
