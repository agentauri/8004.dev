import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeatureCard } from './feature-card';

// Mock next/link - preserve all props including data-testid
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const ZapIcon = () => (
  <svg data-testid="zap-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

describe('FeatureCard', () => {
  describe('rendering', () => {
    it('renders the feature card', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card')).toBeInTheDocument();
    });

    it('renders the icon', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card-icon')).toBeInTheDocument();
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('renders the title', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Streaming Search"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card-title')).toHaveTextContent('Streaming Search');
    });

    it('renders the description', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Real-time results as they're found"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card-description')).toHaveTextContent(
        "Real-time results as they're found",
      );
    });

    it('links to the correct href', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/explore"
        />,
      );
      const card = screen.getByTestId('feature-card');
      expect(card).toHaveAttribute('href', '/explore');
      expect(card).toHaveAttribute('data-href', '/explore');
    });

    it('applies custom className', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('feature-card')).toHaveClass('custom-class');
    });
  });

  describe('glow colors', () => {
    it('applies blue glow color by default', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card-icon')).toHaveClass('text-[var(--pixel-blue-sky)]');
    });

    it('applies gold glow color when specified', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
          glowColor="gold"
        />,
      );
      expect(screen.getByTestId('feature-card-icon')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies green glow color when specified', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
          glowColor="green"
        />,
      );
      expect(screen.getByTestId('feature-card-icon')).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('applies red glow color when specified', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
          glowColor="red"
        />,
      );
      expect(screen.getByTestId('feature-card-icon')).toHaveClass('text-[var(--pixel-red-fire)]');
    });
  });

  describe('styling', () => {
    it('applies hover translate styles', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card')).toHaveClass('hover:translate-y-[-2px]');
    });

    it('applies base border color', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card')).toHaveClass('border-[var(--pixel-gray-700)]');
    });

    it('applies transition classes', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      expect(screen.getByTestId('feature-card')).toHaveClass('transition-all');
    });
  });

  describe('accessibility', () => {
    it('renders as a link element', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      const card = screen.getByTestId('feature-card');
      expect(card.tagName).toBe('A');
    });

    it('arrow icon has aria-hidden attribute', () => {
      render(
        <FeatureCard
          icon={<ZapIcon />}
          title="Test Feature"
          description="Test description"
          href="/test"
        />,
      );
      // The arrow svg is in the card, not the icon area
      const card = screen.getByTestId('feature-card');
      const arrowSvg = card.querySelector('svg[aria-hidden="true"]');
      expect(arrowSvg).toBeInTheDocument();
    });
  });
});
