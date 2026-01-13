import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Evaluation, IntentTemplate } from '@/types/agent';
import { AgentDetailTemplate } from './agent-detail-template';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock the useWallet hook
vi.mock('@/hooks/use-wallet', () => ({
  useWallet: () => ({
    status: 'disconnected',
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    usdcBalance: null,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    switchToBase: vi.fn(),
    isReadyForPayment: false,
    connectors: [],
  }),
  truncateAddress: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
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

  const mockEvaluations: Evaluation[] = [
    {
      id: 'eval-1',
      agentId: '11155111:123',
      status: 'completed',
      benchmarks: [],
      scores: {
        safety: 92,
        capability: 85,
        reliability: 78,
        performance: 88,
      },
      createdAt: new Date('2024-01-10T10:00:00Z'),
      completedAt: new Date('2024-01-10T11:00:00Z'),
    },
    {
      id: 'eval-2',
      agentId: '11155111:123',
      status: 'pending',
      benchmarks: [],
      scores: {
        safety: 0,
        capability: 0,
        reliability: 0,
        performance: 0,
      },
      createdAt: new Date('2024-01-15T10:00:00Z'),
    },
  ];

  const mockIntents: IntentTemplate[] = [
    {
      id: 'code-review',
      name: 'Code Review Workflow',
      description: 'Automated code review process',
      category: 'development',
      steps: [
        {
          order: 1,
          name: 'analyze',
          description: 'Analyze code',
          requiredRole: 'analyzer',
          inputs: [],
          outputs: [],
        },
      ],
      requiredRoles: ['analyzer', 'reviewer'],
    },
    {
      id: 'data-pipeline',
      name: 'Data Pipeline',
      description: 'Data processing workflow',
      category: 'automation',
      steps: [
        {
          order: 1,
          name: 'process',
          description: 'Process data',
          requiredRole: 'processor',
          inputs: [],
          outputs: [],
        },
      ],
      requiredRoles: ['processor', 'validator'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location.hash to ensure clean state
    window.history.replaceState(null, '', window.location.pathname);
  });

  afterEach(() => {
    cleanup();
  });

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

  describe('evaluations tab', () => {
    it('renders evaluations tab in navigation', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);
      expect(screen.getByRole('tab', { name: /evaluations/i })).toBeInTheDocument();
    });

    it('shows evaluation count badge when evaluations exist', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={mockEvaluations}
        />,
      );
      // Count badge shows only completed evaluations (1 in our mock)
      const evaluationsTab = screen.getByRole('tab', { name: /evaluations/i });
      expect(evaluationsTab).toHaveTextContent('1');
    });

    it('switches to evaluations tab when clicked', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={mockEvaluations}
        />,
      );

      const evaluationsTab = screen.getByRole('tab', { name: /evaluations/i });
      fireEvent.click(evaluationsTab);

      expect(screen.getByTestId('evaluations-tab-content')).toBeInTheDocument();
    });

    it('shows evaluations grid when evaluations exist', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={mockEvaluations}
          initialTab="evaluations"
        />,
      );

      expect(screen.getByTestId('evaluations-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('evaluation-card').length).toBe(2);
    });

    it('shows empty state when no evaluations exist', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={[]}
          initialTab="evaluations"
        />,
      );

      expect(screen.getByTestId('evaluations-empty-state')).toBeInTheDocument();
      expect(screen.getByText('No evaluations yet')).toBeInTheDocument();
    });

    it('shows loading state when evaluations are loading', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluationsLoading={true}
          initialTab="evaluations"
        />,
      );

      expect(screen.getByText('Loading evaluations...')).toBeInTheDocument();
    });

    it('navigates to create evaluation page when new evaluation button clicked', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={mockEvaluations}
          initialTab="evaluations"
        />,
      );

      const newEvalButton = screen.getByTestId('new-evaluation-button');
      fireEvent.click(newEvalButton);

      expect(mockPush).toHaveBeenCalledWith('/agent/11155111:123/evaluate');
    });

    it('navigates to create evaluation from empty state', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={[]}
          initialTab="evaluations"
        />,
      );

      const createButton = screen.getByTestId('create-first-evaluation-button');
      fireEvent.click(createButton);

      expect(mockPush).toHaveBeenCalledWith('/agent/11155111:123/evaluate');
    });
  });

  describe('evaluation scores in header', () => {
    it('shows evaluation scores when completed evaluation exists', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={mockEvaluations}
        />,
      );

      expect(screen.getByTestId('header-evaluation-scores')).toBeInTheDocument();
      expect(screen.getByText('Latest Evaluation Scores')).toBeInTheDocument();
    });

    it('does not show evaluation scores when no completed evaluations', () => {
      const pendingOnlyEvaluations: Evaluation[] = [
        {
          id: 'eval-pending',
          agentId: '11155111:123',
          status: 'pending',
          benchmarks: [],
          scores: { safety: 0, capability: 0, reliability: 0, performance: 0 },
          createdAt: new Date(),
        },
      ];

      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          evaluations={pendingOnlyEvaluations}
        />,
      );

      expect(screen.queryByTestId('header-evaluation-scores')).not.toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders action buttons', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);

      expect(screen.getByTestId('agent-action-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('view-evaluations-button')).toBeInTheDocument();
      expect(screen.getByTestId('add-to-team-button')).toBeInTheDocument();
    });

    it('view evaluations button links to evaluations tab', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);

      const viewEvalsButton = screen.getByTestId('view-evaluations-button');
      expect(viewEvalsButton).toHaveAttribute('href', '/agent/11155111:123#evaluations');
    });

    it('add to team button links to compose page', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);

      const addToTeamButton = screen.getByTestId('add-to-team-button');
      expect(addToTeamButton).toHaveAttribute('href', '/compose?agents=11155111:123');
    });
  });

  describe('matching workflows section', () => {
    it('shows matching workflows when intents exist', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={mockIntents}
          initialTab="overview"
        />,
      );

      expect(screen.getByTestId('matching-workflows-section')).toBeInTheDocument();
      expect(screen.getByText('Matching Workflows')).toBeInTheDocument();
      expect(
        screen.getByText('Intent templates this agent can participate in'),
      ).toBeInTheDocument();
    });

    it('renders intent cards for matching workflows', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={mockIntents}
          initialTab="overview"
        />,
      );

      expect(screen.getAllByTestId('intent-card').length).toBe(2);
      expect(screen.getByText('Code Review Workflow')).toBeInTheDocument();
      expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
    });

    it('navigates to intent page when intent card clicked', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={mockIntents}
          initialTab="overview"
        />,
      );

      const intentCards = screen.getAllByTestId('intent-card');
      fireEvent.click(intentCards[0]);

      expect(mockPush).toHaveBeenCalledWith('/intents/code-review?agent=11155111%3A123');
    });

    it('shows view all link when more than 4 intents', () => {
      const manyIntents: IntentTemplate[] = Array.from({ length: 6 }, (_, i) => ({
        id: `intent-${i}`,
        name: `Intent ${i}`,
        description: `Description ${i}`,
        category: 'automation',
        steps: [],
        requiredRoles: ['role1'],
      }));

      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={manyIntents}
          initialTab="overview"
        />,
      );

      expect(screen.getByTestId('view-all-workflows-link')).toBeInTheDocument();
      expect(screen.getByText('View all 6 matching workflows')).toBeInTheDocument();
    });

    it('only shows 4 intent cards when more exist', () => {
      const manyIntents: IntentTemplate[] = Array.from({ length: 6 }, (_, i) => ({
        id: `intent-${i}`,
        name: `Intent ${i}`,
        description: `Description ${i}`,
        category: 'automation',
        steps: [],
        requiredRoles: ['role1'],
      }));

      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={manyIntents}
          initialTab="overview"
        />,
      );

      expect(screen.getAllByTestId('intent-card').length).toBe(4);
    });

    it('does not show matching workflows when no intents', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={[]}
          initialTab="overview"
        />,
      );

      expect(screen.queryByTestId('matching-workflows-section')).not.toBeInTheDocument();
    });

    it('does not show matching workflows while loading', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          matchingIntents={mockIntents}
          intentsLoading={true}
          initialTab="overview"
        />,
      );

      expect(screen.queryByTestId('matching-workflows-section')).not.toBeInTheDocument();
    });
  });

  describe('tab navigation', () => {
    it('shows all tabs including evaluations', () => {
      render(<AgentDetailTemplate agent={mockAgent} reputation={mockReputation} />);

      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /evaluations/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /statistics/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /feedbacks/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /validations/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /metadata/i })).toBeInTheDocument();
    });

    it('starts on overview tab by default', () => {
      render(
        <AgentDetailTemplate agent={mockAgent} reputation={mockReputation} initialTab="overview" />,
      );

      expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
    });

    it('can set initial tab to evaluations', () => {
      render(
        <AgentDetailTemplate
          agent={mockAgent}
          reputation={mockReputation}
          initialTab="evaluations"
        />,
      );

      expect(screen.getByTestId('tabpanel-evaluations')).toBeInTheDocument();
    });
  });
});
