import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentBadges } from './agent-badges';

describe('AgentBadges', () => {
  describe('rendering', () => {
    it('renders with minimal props', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      expect(screen.getByTestId('agent-badges')).toBeInTheDocument();
    });

    it('renders chain badge', () => {
      render(<AgentBadges chainId={84532} isActive={true} />);
      expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
      expect(screen.getByTestId('chain-badge')).toHaveAttribute('data-chain', '84532');
    });

    it('applies custom className', () => {
      render(<AgentBadges chainId={11155111} isActive={true} className="custom-class" />);
      expect(screen.getByTestId('agent-badges')).toHaveClass('custom-class');
    });
  });

  describe('active status', () => {
    it('shows ACTIVE badge when isActive is true', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const activeBadge = badges.find((b) => b.getAttribute('data-status') === 'active');
      expect(activeBadge).toBeInTheDocument();
    });

    it('shows INACTIVE badge when isActive is false', () => {
      render(<AgentBadges chainId={11155111} isActive={false} />);
      const badges = screen.getAllByTestId('status-badge');
      const inactiveBadge = badges.find((b) => b.getAttribute('data-status') === 'inactive');
      expect(inactiveBadge).toBeInTheDocument();
    });
  });

  describe('verified status', () => {
    it('does not show verified badge by default', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const verifiedBadge = badges.find((b) => b.getAttribute('data-status') === 'verified');
      expect(verifiedBadge).toBeUndefined();
    });

    it('shows verified badge when isVerified is true', () => {
      render(<AgentBadges chainId={11155111} isActive={true} isVerified={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const verifiedBadge = badges.find((b) => b.getAttribute('data-status') === 'verified');
      expect(verifiedBadge).toBeInTheDocument();
    });
  });

  describe('trust score', () => {
    it('does not show trust score by default', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      expect(screen.queryByTestId('trust-score')).not.toBeInTheDocument();
    });

    it('shows trust score when provided', () => {
      render(<AgentBadges chainId={11155111} isActive={true} trustScore={85} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '85');
    });

    it('shows trust score of zero', () => {
      render(<AgentBadges chainId={11155111} isActive={true} trustScore={0} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '0');
    });

    it('shows reputation count with trust score', () => {
      render(
        <AgentBadges chainId={11155111} isActive={true} trustScore={85} reputationCount={23} />,
      );
      expect(screen.getByTestId('trust-score')).toHaveTextContent('(23)');
    });

    it('does not show count when reputationCount is not provided', () => {
      render(<AgentBadges chainId={11155111} isActive={true} trustScore={85} />);
      expect(screen.getByTestId('trust-score').textContent).not.toMatch(/\(\d+\)/);
    });
  });

  describe('supported trust', () => {
    it('does not show trust badge by default', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const trustBadge = badges.find((b) => b.getAttribute('data-status') === 'trust');
      expect(trustBadge).toBeUndefined();
    });

    it('shows trust badge when hasSupportedTrust is true', () => {
      render(<AgentBadges chainId={11155111} isActive={true} hasSupportedTrust={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const trustBadge = badges.find((b) => b.getAttribute('data-status') === 'trust');
      expect(trustBadge).toBeInTheDocument();
    });
  });

  describe('protocols', () => {
    it('does not show protocol badges by default', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      const badges = screen.getAllByTestId('status-badge');
      const mcpBadge = badges.find((b) => b.getAttribute('data-status') === 'mcp');
      expect(mcpBadge).toBeUndefined();
    });

    it('shows MCP badge when in protocols', () => {
      render(<AgentBadges chainId={11155111} isActive={true} protocols={['mcp']} />);
      const badges = screen.getAllByTestId('status-badge');
      const mcpBadge = badges.find((b) => b.getAttribute('data-status') === 'mcp');
      expect(mcpBadge).toBeInTheDocument();
    });

    it('shows A2A badge when in protocols', () => {
      render(<AgentBadges chainId={11155111} isActive={true} protocols={['a2a']} />);
      const badges = screen.getAllByTestId('status-badge');
      const a2aBadge = badges.find((b) => b.getAttribute('data-status') === 'a2a');
      expect(a2aBadge).toBeInTheDocument();
    });

    it('shows x402 badge when in protocols', () => {
      render(<AgentBadges chainId={11155111} isActive={true} protocols={['x402']} />);
      const badges = screen.getAllByTestId('status-badge');
      const x402Badge = badges.find((b) => b.getAttribute('data-status') === 'x402');
      expect(x402Badge).toBeInTheDocument();
    });

    it('shows multiple protocol badges', () => {
      render(<AgentBadges chainId={11155111} isActive={true} protocols={['mcp', 'a2a', 'x402']} />);
      const badges = screen.getAllByTestId('status-badge');
      const mcpBadge = badges.find((b) => b.getAttribute('data-status') === 'mcp');
      const a2aBadge = badges.find((b) => b.getAttribute('data-status') === 'a2a');
      const x402Badge = badges.find((b) => b.getAttribute('data-status') === 'x402');
      expect(mcpBadge).toBeInTheDocument();
      expect(a2aBadge).toBeInTheDocument();
      expect(x402Badge).toBeInTheDocument();
    });
  });

  describe('direction', () => {
    it('renders in row direction by default', () => {
      render(<AgentBadges chainId={11155111} isActive={true} />);
      expect(screen.getByTestId('agent-badges')).toHaveClass('flex-row');
    });

    it('renders in column direction when specified', () => {
      render(<AgentBadges chainId={11155111} isActive={true} direction="column" />);
      expect(screen.getByTestId('agent-badges')).toHaveClass('flex-col');
    });
  });

  describe('complete agent', () => {
    it('renders all badges for a fully featured agent', () => {
      render(
        <AgentBadges
          chainId={11155111}
          isActive={true}
          isVerified={true}
          trustScore={92}
          reputationCount={15}
          hasSupportedTrust={true}
          protocols={['mcp', 'a2a']}
        />,
      );

      expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toHaveTextContent('(15)');

      const badges = screen.getAllByTestId('status-badge');
      expect(badges).toHaveLength(5); // active, verified, trust, mcp, a2a
    });
  });
});
