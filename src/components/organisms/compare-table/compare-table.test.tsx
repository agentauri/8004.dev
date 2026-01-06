import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompareTable, type CompareTableAgent } from './compare-table';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockAgents: CompareTableAgent[] = [
  {
    id: '11155111:123',
    name: 'Trading Bot Alpha',
    description: 'An automated trading agent',
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 85,
    capabilities: ['mcp', 'a2a'],
    supportedTrust: ['reputation', 'stake'],
    oasfSkills: [{ slug: 'trading/automated', confidence: 0.9 }],
    oasfDomains: [{ slug: 'finance', confidence: 0.85 }],
    walletAddress: '0x1234567890123456789012345678901234567890',
    reputationCount: 42,
  },
  {
    id: '84532:456',
    name: 'Code Review Agent',
    description: 'Reviews code and suggests improvements',
    chainId: 84532,
    isActive: true,
    isVerified: false,
    trustScore: 72,
    capabilities: ['mcp'],
    oasfSkills: [{ slug: 'coding/review', confidence: 0.95 }],
  },
];

describe('CompareTable', () => {
  describe('rendering', () => {
    it('renders compare table with agents', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-table')).toBeInTheDocument();
    });

    it('renders empty state when no agents', () => {
      render(<CompareTable agents={[]} />);

      expect(screen.getByTestId('compare-table-empty')).toBeInTheDocument();
      expect(screen.getByText('No agents selected for comparison')).toBeInTheDocument();
    });

    it('renders minimum state when only one agent', () => {
      render(<CompareTable agents={[mockAgents[0]]} />);

      expect(screen.getByTestId('compare-table-minimum')).toBeInTheDocument();
      expect(screen.getByText('Select at least 2 agents to compare')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CompareTable agents={mockAgents} className="custom-class" />);

      expect(screen.getByTestId('compare-table')).toHaveClass('custom-class');
    });
  });

  describe('header', () => {
    it('renders agent avatars in header', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getAllByTestId('agent-avatar')).toHaveLength(2);
    });

    it('renders agent names in header', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByText('Trading Bot Alpha')).toBeInTheDocument();
      expect(screen.getByText('Code Review Agent')).toBeInTheDocument();
    });

    it('renders agent IDs in header', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByText('11155111:123')).toBeInTheDocument();
      expect(screen.getByText('84532:456')).toBeInTheDocument();
    });

    it('renders view links for each agent', () => {
      render(<CompareTable agents={mockAgents} />);

      const links = screen.getAllByTitle('View agent details');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/agent/11155111:123');
      expect(links[1]).toHaveAttribute('href', '/agent/84532:456');
    });
  });

  describe('remove functionality', () => {
    it('renders remove buttons when onRemoveAgent is provided', () => {
      const onRemoveAgent = vi.fn();
      render(<CompareTable agents={mockAgents} onRemoveAgent={onRemoveAgent} />);

      expect(screen.getByTestId('compare-remove-11155111:123')).toBeInTheDocument();
      expect(screen.getByTestId('compare-remove-84532:456')).toBeInTheDocument();
    });

    it('does not render remove buttons when onRemoveAgent is not provided', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.queryByTestId('compare-remove-11155111:123')).not.toBeInTheDocument();
    });

    it('calls onRemoveAgent when remove button is clicked', () => {
      const onRemoveAgent = vi.fn();
      render(<CompareTable agents={mockAgents} onRemoveAgent={onRemoveAgent} />);

      fireEvent.click(screen.getByTestId('compare-remove-11155111:123'));

      expect(onRemoveAgent).toHaveBeenCalledTimes(1);
      expect(onRemoveAgent).toHaveBeenCalledWith('11155111:123');
    });

    it('has accessible remove button labels', () => {
      const onRemoveAgent = vi.fn();
      render(<CompareTable agents={mockAgents} onRemoveAgent={onRemoveAgent} />);

      expect(screen.getByLabelText('Remove Trading Bot Alpha from comparison')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove Code Review Agent from comparison')).toBeInTheDocument();
    });
  });

  describe('comparison rows', () => {
    it('renders network row with chain badges', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-network')).toBeInTheDocument();
      expect(screen.getAllByTestId('chain-badge')).toHaveLength(2);
    });

    it('renders status row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-status')).toBeInTheDocument();
      expect(screen.getAllByText('ACTIVE')).toHaveLength(2);
    });

    it('renders verified row with indicators', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-verified')).toBeInTheDocument();
      const row = screen.getByTestId('compare-row-verified');
      expect(within(row).getByLabelText('Yes')).toBeInTheDocument();
      expect(within(row).getByLabelText('No')).toBeInTheDocument();
    });

    it('renders trust score row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-trust-score')).toBeInTheDocument();
      expect(screen.getAllByTestId('trust-score')).toHaveLength(2);
    });

    it('renders description row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-description')).toBeInTheDocument();
      expect(screen.getByText('An automated trading agent')).toBeInTheDocument();
      expect(screen.getByText('Reviews code and suggests improvements')).toBeInTheDocument();
    });

    it('renders protocols row with capability tags', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-protocols')).toBeInTheDocument();
      // Both agents have MCP, so we expect 2 MCP tags
      expect(screen.getAllByText('MCP')).toHaveLength(2);
      expect(screen.getByText('A2A')).toBeInTheDocument();
    });

    it('renders trust mechanisms row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-trust-mechanisms')).toBeInTheDocument();
      expect(screen.getByText('reputation')).toBeInTheDocument();
      expect(screen.getByText('stake')).toBeInTheDocument();
    });

    it('renders skills row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-skills')).toBeInTheDocument();
      expect(screen.getByText('automated')).toBeInTheDocument();
      expect(screen.getByText('review')).toBeInTheDocument();
    });

    it('renders domains row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-domains')).toBeInTheDocument();
      expect(screen.getByText('finance')).toBeInTheDocument();
    });

    it('renders wallet row', () => {
      render(<CompareTable agents={mockAgents} />);

      expect(screen.getByTestId('compare-row-wallet')).toBeInTheDocument();
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
    });
  });

  describe('missing data handling', () => {
    it('shows dash for missing trust score', () => {
      const agentsWithoutScore: CompareTableAgent[] = [
        { ...mockAgents[0], trustScore: undefined },
        mockAgents[1],
      ];
      render(<CompareTable agents={agentsWithoutScore} />);

      const row = screen.getByTestId('compare-row-trust-score');
      expect(within(row).getByText('—')).toBeInTheDocument();
    });

    it('shows dash for missing description', () => {
      const agentsWithoutDesc: CompareTableAgent[] = [
        { ...mockAgents[0], description: undefined },
        mockAgents[1],
      ];
      render(<CompareTable agents={agentsWithoutDesc} />);

      const row = screen.getByTestId('compare-row-description');
      expect(within(row).getByText('—')).toBeInTheDocument();
    });

    it('shows dash for missing capabilities', () => {
      const agentsWithoutCaps: CompareTableAgent[] = [
        { ...mockAgents[0], capabilities: [] },
        mockAgents[1],
      ];
      render(<CompareTable agents={agentsWithoutCaps} />);

      const row = screen.getByTestId('compare-row-protocols');
      expect(within(row).getByText('—')).toBeInTheDocument();
    });

    it('shows dash for missing wallet address', () => {
      const agentsWithoutWallet: CompareTableAgent[] = [
        { ...mockAgents[0], walletAddress: undefined },
        mockAgents[1],
      ];
      render(<CompareTable agents={agentsWithoutWallet} />);

      const row = screen.getByTestId('compare-row-wallet');
      // Both agents have no wallet address (mockAgents[1] also doesn't have one)
      expect(within(row).getAllByText('—')).toHaveLength(2);
    });
  });

  describe('multiple agents', () => {
    it('renders 3 agents correctly', () => {
      const threeAgents: CompareTableAgent[] = [
        ...mockAgents,
        {
          id: '80002:789',
          name: 'Data Agent',
          chainId: 80002,
          isActive: false,
        },
      ];
      render(<CompareTable agents={threeAgents} />);

      expect(screen.getByText('Trading Bot Alpha')).toBeInTheDocument();
      expect(screen.getByText('Code Review Agent')).toBeInTheDocument();
      expect(screen.getByText('Data Agent')).toBeInTheDocument();
    });

    it('renders 4 agents correctly', () => {
      const fourAgents: CompareTableAgent[] = [
        ...mockAgents,
        {
          id: '80002:789',
          name: 'Data Agent',
          chainId: 80002,
          isActive: false,
        },
        {
          id: '11155111:999',
          name: 'Market Agent',
          chainId: 11155111,
          isActive: true,
        },
      ];
      render(<CompareTable agents={fourAgents} />);

      expect(screen.getAllByTestId('agent-avatar')).toHaveLength(4);
    });
  });

  describe('inactive agents', () => {
    it('shows INACTIVE status for inactive agents', () => {
      const agentsWithInactive: CompareTableAgent[] = [
        mockAgents[0],
        { ...mockAgents[1], isActive: false },
      ];
      render(<CompareTable agents={agentsWithInactive} />);

      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });
  });
});
