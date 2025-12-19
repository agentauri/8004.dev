import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from './layout';

// Mock Next.js font imports
vi.mock('next/font/google', () => ({
  Press_Start_2P: () => ({
    variable: '--font-pixel-display',
  }),
  Silkscreen: () => ({
    variable: '--font-pixel-body',
  }),
  JetBrains_Mono: () => ({
    variable: '--font-mono',
  }),
}));

// Mock the Providers component
vi.mock('./providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

describe('RootLayout', () => {
  describe('metadata', () => {
    it('has correct title', () => {
      expect(metadata.title).toBe('Agent Explorer - ERC-8004 Agent Discovery');
    });

    it('has correct description', () => {
      expect(metadata.description).toContain('autonomous AI agents');
      expect(metadata.description).toContain('ERC-8004');
    });

    it('has keywords defined', () => {
      expect(metadata.keywords).toContain('ERC-8004');
      expect(metadata.keywords).toContain('AI Agents');
      expect(metadata.keywords).toContain('Blockchain');
    });

    it('has authors defined', () => {
      expect(metadata.authors).toEqual([{ name: 'Agent Explorer' }]);
    });

    it('has openGraph metadata', () => {
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Agent Explorer - ERC-8004 Agent Discovery');
      expect((metadata.openGraph as { type?: string })?.type).toBe('website');
      expect(metadata.openGraph?.locale).toBe('en_US');
    });

    it('has twitter metadata', () => {
      expect(metadata.twitter).toBeDefined();
      expect((metadata.twitter as { card?: string })?.card).toBe('summary_large_image');
      expect(metadata.twitter?.title).toBe('Agent Explorer - ERC-8004 Agent Discovery');
    });
  });

  describe('rendering', () => {
    it('renders children through Providers', () => {
      render(
        <RootLayout>
          <div data-testid="child">Test Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId('providers')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('wraps children with Providers component', () => {
      render(
        <RootLayout>
          <span>Child Content</span>
        </RootLayout>,
      );

      const providers = screen.getByTestId('providers');
      expect(providers).toContainHTML('Child Content');
    });
  });
});
