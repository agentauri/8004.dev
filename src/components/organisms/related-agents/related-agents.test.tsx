import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RelatedAgents } from './related-agents';

const mockAgents = [
  {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'Similar Agent 1',
    description: 'A similar trading agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    reputationScore: 85,
    reputationCount: 10,
  },
  {
    id: '11155111:2',
    chainId: 11155111,
    tokenId: '2',
    name: 'Similar Agent 2',
    description: 'Another similar agent',
    active: true,
    x402support: false,
    hasMcp: true,
    hasA2a: true,
    supportedTrust: [],
    reputationScore: 72,
    reputationCount: 5,
  },
  {
    id: '84532:1',
    chainId: 84532,
    tokenId: '1',
    name: 'Cross-chain Agent',
    description: 'Agent on different chain',
    active: false,
    x402support: false,
    hasMcp: false,
    hasA2a: true,
    supportedTrust: [],
    reputationScore: 60,
    reputationCount: 3,
  },
];

describe('RelatedAgents', () => {
  describe('with data', () => {
    it('renders section', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByTestId('related-agents')).toBeInTheDocument();
    });

    it('has loaded state in data attribute', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByTestId('related-agents')).toHaveAttribute('data-state', 'loaded');
    });

    it('stores count in data attribute', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByTestId('related-agents')).toHaveAttribute('data-count', '3');
    });

    it('displays section header with count', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByText('SIMILAR AGENTS')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
    });

    it('hides header when showHeader is false', () => {
      render(<RelatedAgents agents={mockAgents} showHeader={false} />);
      expect(screen.queryByText('SIMILAR AGENTS')).not.toBeInTheDocument();
    });

    it('renders agent cards', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByText('Similar Agent 1')).toBeInTheDocument();
      expect(screen.getByText('Similar Agent 2')).toBeInTheDocument();
    });

    it('respects maxAgents limit', () => {
      render(<RelatedAgents agents={mockAgents} maxAgents={2} />);
      expect(screen.getByText('Similar Agent 1')).toBeInTheDocument();
      expect(screen.getByText('Similar Agent 2')).toBeInTheDocument();
      expect(screen.queryByText('Cross-chain Agent')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading state', () => {
      render(<RelatedAgents agents={[]} isLoading />);
      expect(screen.getByTestId('related-agents')).toHaveAttribute('data-state', 'loading');
    });

    it('displays loading message', () => {
      render(<RelatedAgents agents={[]} isLoading />);
      expect(screen.getByText('Finding similar agents...')).toBeInTheDocument();
    });

    it('still shows header when loading', () => {
      render(<RelatedAgents agents={[]} isLoading />);
      expect(screen.getByText('SIMILAR AGENTS')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when no agents', () => {
      render(<RelatedAgents agents={[]} />);
      expect(screen.getByTestId('related-agents')).toHaveAttribute('data-state', 'empty');
    });

    it('displays no agents message', () => {
      render(<RelatedAgents agents={[]} />);
      expect(screen.getByText('No similar agents found')).toBeInTheDocument();
    });

    it('displays help text', () => {
      render(<RelatedAgents agents={[]} />);
      expect(
        screen.getByText('Agents with similar capabilities will appear here'),
      ).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<RelatedAgents agents={mockAgents} className="custom-class" />);
      expect(screen.getByTestId('related-agents')).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('uses section element', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByTestId('related-agents').tagName).toBe('SECTION');
    });

    it('has heading element for header', () => {
      render(<RelatedAgents agents={mockAgents} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('SIMILAR AGENTS');
    });
  });

  describe('agent conversion', () => {
    it('converts capabilities correctly', () => {
      render(<RelatedAgents agents={[mockAgents[0]]} />);
      // AgentCard with MCP and X402 capabilities
      const card = screen.getByTestId('agent-card');
      expect(card).toBeInTheDocument();
    });

    it('handles agents without capabilities', () => {
      const agentNoCaps = {
        ...mockAgents[0],
        hasMcp: false,
        hasA2a: false,
        x402support: false,
      };
      render(<RelatedAgents agents={[agentNoCaps]} />);
      expect(screen.getByTestId('agent-card')).toBeInTheDocument();
    });
  });
});
