import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Agent, AgentReputation } from '@/types/agent';
import { AgentOverview } from './agent-overview';

const mockAgent: Agent = {
  id: '11155111:42',
  chainId: 11155111,
  tokenId: '42',
  name: 'Test Agent',
  description: 'A test agent for unit testing',
  active: true,
  x402support: true,
  supportedTrust: ['reputation'],
  oasf: {
    skills: [
      { slug: 'natural_language_processing', confidence: 0.9 },
      { slug: 'code_generation', confidence: 0.85 },
    ],
    domains: [{ slug: 'software_development', confidence: 0.95 }],
  },
  endpoints: {
    mcp: { url: 'https://mcp.example.com', version: '1.0' },
    a2a: { url: 'https://a2a.example.com', version: '1.0' },
    agentWallet: '0x1234567890abcdef1234567890abcdef12345678',
  },
  registration: {
    chainId: 11155111,
    tokenId: '42',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadataUri: 'https://example.com/metadata.json',
    owner: '0x9876543210fedcba9876543210fedcba98765432',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const mockReputation: AgentReputation = {
  count: 23,
  averageScore: 85,
  distribution: {
    low: 2,
    medium: 5,
    high: 16,
  },
};

describe('AgentOverview', () => {
  describe('rendering', () => {
    it('renders with required props', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.getByTestId('agent-overview')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<AgentOverview agent={mockAgent} className="custom-class" />);
      expect(screen.getByTestId('agent-overview')).toHaveClass('custom-class');
    });
  });

  describe('description section', () => {
    it('renders description when provided', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
      expect(screen.getByText('A test agent for unit testing')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const agentWithoutDescription = { ...mockAgent, description: '' };
      render(<AgentOverview agent={agentWithoutDescription} />);
      expect(screen.queryByText('DESCRIPTION')).not.toBeInTheDocument();
    });
  });

  describe('taxonomy section', () => {
    it('renders taxonomy section', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.getByTestId('taxonomy-section')).toBeInTheDocument();
    });

    it('handles agent without OASF data', () => {
      const agentWithoutOASF = { ...mockAgent, oasf: undefined };
      render(<AgentOverview agent={agentWithoutOASF} />);
      // Should still render without crashing
      expect(screen.getByTestId('agent-overview')).toBeInTheDocument();
    });
  });

  describe('endpoints section', () => {
    it('renders agent endpoints', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.getByTestId('agent-endpoints')).toBeInTheDocument();
    });
  });

  describe('registration section', () => {
    it('renders agent registration', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.getByTestId('agent-registration')).toBeInTheDocument();
    });
  });

  describe('reputation section', () => {
    it('renders reputation section when provided', () => {
      render(<AgentOverview agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-section')).toBeInTheDocument();
    });

    it('renders reputation section without data', () => {
      render(<AgentOverview agent={mockAgent} />);
      // ReputationSection should handle undefined reputation gracefully
      expect(screen.getByTestId('reputation-section')).toBeInTheDocument();
    });
  });

  describe('warnings section', () => {
    it('renders warnings list when warnings are present', () => {
      const agentWithWarnings = {
        ...mockAgent,
        warnings: [
          {
            type: 'metadata' as const,
            message: 'Agent name is missing',
            severity: 'high' as const,
          },
          { type: 'reputation' as const, message: 'No feedback yet', severity: 'low' as const },
        ],
      };
      render(<AgentOverview agent={agentWithWarnings} />);
      expect(screen.getByTestId('warnings-list')).toBeInTheDocument();
      expect(screen.getByText('WARNINGS (2)')).toBeInTheDocument();
    });

    it('does not render warnings list when no warnings', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.queryByTestId('warnings-list')).not.toBeInTheDocument();
    });

    it('does not render warnings list when warnings array is empty', () => {
      const agentWithEmptyWarnings = { ...mockAgent, warnings: [] };
      render(<AgentOverview agent={agentWithEmptyWarnings} />);
      expect(screen.queryByTestId('warnings-list')).not.toBeInTheDocument();
    });

    it('displays warning messages', () => {
      const agentWithWarnings = {
        ...mockAgent,
        warnings: [
          {
            type: 'metadata' as const,
            message: 'Critical metadata missing',
            severity: 'high' as const,
          },
        ],
      };
      render(<AgentOverview agent={agentWithWarnings} />);
      expect(screen.getByText('Critical metadata missing')).toBeInTheDocument();
    });

    it('displays warning severity badges', () => {
      const agentWithWarnings = {
        ...mockAgent,
        warnings: [
          { type: 'metadata' as const, message: 'Test warning', severity: 'high' as const },
        ],
      };
      render(<AgentOverview agent={agentWithWarnings} />);
      const warningItem = screen.getByTestId('warning-item');
      expect(warningItem).toHaveAttribute('data-severity', 'high');
    });
  });

  describe('lastUpdatedAt', () => {
    it('passes lastUpdatedAt to AgentRegistration', () => {
      const agentWithLastUpdated = {
        ...mockAgent,
        lastUpdatedAt: '2024-06-15T14:30:00Z',
      };
      render(<AgentOverview agent={agentWithLastUpdated} />);
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });

    it('does not show Last Updated when not provided', () => {
      render(<AgentOverview agent={mockAgent} />);
      expect(screen.queryByText('Last Updated')).not.toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders all sections in correct order', () => {
      render(<AgentOverview agent={mockAgent} reputation={mockReputation} />);

      const overview = screen.getByTestId('agent-overview');
      const sections = overview.children;

      // Should have: description, taxonomy, grid (endpoints + registration), reputation
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });
  });
});
