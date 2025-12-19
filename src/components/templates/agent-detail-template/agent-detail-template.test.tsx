import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgentDetailTemplate } from './agent-detail-template';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AgentDetailTemplate', () => {
  const mockAgent = {
    id: '11155111:123',
    chainId: 11155111,
    tokenId: '123',
    name: 'Test Agent',
    description: 'A test agent description',
    active: true,
    x402support: true,
    endpoints: {
      mcp: { url: 'https://mcp.example.com', version: '1.0' },
    },
    oasf: { skills: [], domains: [] },
    supportedTrust: [],
    registration: {
      chainId: 11155111,
      tokenId: '123',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmXYZ',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-15T10:30:00Z',
    },
  };

  const mockReputation = {
    count: 100,
    averageScore: 85,
    distribution: { low: 5, medium: 25, high: 70 },
  };

  describe('rendering', () => {
    it('renders template container', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('agent-detail-template')).toBeInTheDocument();
    });

    it('renders agent header', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('agent-header')).toBeInTheDocument();
    });

    it('renders agent endpoints', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('agent-endpoints')).toBeInTheDocument();
    });

    it('renders agent registration', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('agent-registration')).toBeInTheDocument();
    });

    it('displays agent name', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });

    it('displays agent description', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByText('A test agent description')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading indicator when loading', () => {
      render(<AgentDetailTemplate isLoading={true} />);
      expect(screen.getByText('Loading agent...')).toBeInTheDocument();
    });

    it('does not show agent content when loading', () => {
      render(<AgentDetailTemplate isLoading={true} />);
      expect(screen.queryByTestId('agent-header')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('displays error message', () => {
      render(<AgentDetailTemplate error="Failed to load agent" />);
      expect(screen.getByText('Failed to load agent')).toBeInTheDocument();
    });

    it('does not show agent content when error', () => {
      render(<AgentDetailTemplate error="Error" />);
      expect(screen.queryByTestId('agent-header')).not.toBeInTheDocument();
    });
  });

  describe('not found state', () => {
    it('shows not found message when agent is undefined', () => {
      render(<AgentDetailTemplate agent={undefined} isLoading={false} />);
      expect(screen.getByText('Agent not found')).toBeInTheDocument();
    });
  });

  describe('description section', () => {
    it('shows description section when description exists', () => {
      render(<AgentDetailTemplate agent={mockAgent} />);
      expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
    });

    it('hides description section when description is empty', () => {
      render(<AgentDetailTemplate agent={{ ...mockAgent, description: '' }} />);
      expect(screen.queryByText('DESCRIPTION')).not.toBeInTheDocument();
    });
  });

  describe('trust score', () => {
    it('passes trust score from reputation to header', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      // Multiple trust-score elements now (header + reputation section)
      const trustScores = screen.getAllByTestId('trust-score');
      expect(trustScores.length).toBeGreaterThan(0);
    });

    it('shows reputation section with score when reputation is provided', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-section')).toHaveAttribute('data-state', 'loaded');
    });

    it('shows empty reputation section when reputation is missing', () => {
      render(<AgentDetailTemplate agent={mockAgent} />);
      expect(screen.getByTestId('reputation-section')).toHaveAttribute('data-state', 'empty');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('agent-detail-template')).toHaveClass('custom-class');
    });
  });
});
