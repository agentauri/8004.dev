import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CompareTableAgent } from '@/components/organisms/compare-table';
import { CompareTemplate } from './compare-template';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Header and Footer to simplify tests
vi.mock('@/components/organisms', async () => {
  const actual = await vi.importActual('@/components/organisms');
  return {
    ...actual,
    Header: () => <header data-testid="header">Header</header>,
    Footer: () => <footer data-testid="footer">Footer</footer>,
  };
});

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
  },
  {
    id: '84532:456',
    name: 'Code Review Agent',
    description: 'Reviews code and suggests improvements',
    chainId: 84532,
    isActive: true,
    trustScore: 72,
    capabilities: ['mcp'],
  },
];

describe('CompareTemplate', () => {
  describe('rendering', () => {
    it('renders template with header and footer', () => {
      render(<CompareTemplate agents={mockAgents} />);

      expect(screen.getByTestId('compare-template')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders page title', () => {
      render(<CompareTemplate agents={mockAgents} />);

      expect(screen.getByText('Compare Agents')).toBeInTheDocument();
    });

    it('renders back link to explore page', () => {
      render(<CompareTemplate agents={mockAgents} />);

      const backLink = screen.getByText('Back to Explore');
      expect(backLink.closest('a')).toHaveAttribute('href', '/explore');
    });

    it('renders agent count when comparing', () => {
      render(<CompareTemplate agents={mockAgents} />);

      expect(screen.getByText('Comparing 2 agents side by side')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CompareTemplate agents={mockAgents} className="custom-class" />);

      expect(screen.getByTestId('compare-template')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('renders loading state', () => {
      render(<CompareTemplate agents={[]} isLoading={true} />);

      expect(screen.getByTestId('compare-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading agents...')).toBeInTheDocument();
    });

    it('does not render compare table when loading', () => {
      render(<CompareTemplate agents={mockAgents} isLoading={true} />);

      expect(screen.queryByTestId('compare-table')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty state when no agents', () => {
      render(<CompareTemplate agents={[]} />);

      expect(screen.getByTestId('compare-empty')).toBeInTheDocument();
      expect(screen.getByText('No agents selected')).toBeInTheDocument();
    });

    it('renders browse agents link in empty state', () => {
      render(<CompareTemplate agents={[]} />);

      const browseLink = screen.getByText('Browse Agents');
      expect(browseLink.closest('a')).toHaveAttribute('href', '/explore');
    });
  });

  describe('minimum state', () => {
    it('renders minimum state when only one agent', () => {
      render(<CompareTemplate agents={[mockAgents[0]]} />);

      expect(screen.getByTestId('compare-minimum')).toBeInTheDocument();
      expect(screen.getByText('Select one more agent')).toBeInTheDocument();
    });

    it('renders add more link in minimum state', () => {
      render(<CompareTemplate agents={[mockAgents[0]]} />);

      const addMoreLink = screen.getByText('Add More Agents');
      expect(addMoreLink.closest('a')).toHaveAttribute('href', '/explore');
    });
  });

  describe('comparison table', () => {
    it('renders compare table when 2+ agents', () => {
      render(<CompareTemplate agents={mockAgents} />);

      expect(screen.getByTestId('compare-table')).toBeInTheDocument();
    });

    it('renders compare table with 3 agents', () => {
      const threeAgents = [
        ...mockAgents,
        {
          id: '80002:789',
          name: 'Data Agent',
          chainId: 80002 as const,
          isActive: true,
        },
      ];
      render(<CompareTemplate agents={threeAgents} />);

      expect(screen.getByTestId('compare-table')).toBeInTheDocument();
      expect(screen.getByText('Comparing 3 agents side by side')).toBeInTheDocument();
    });

    it('renders compare table with 4 agents', () => {
      const fourAgents = [
        ...mockAgents,
        {
          id: '80002:789',
          name: 'Data Agent',
          chainId: 80002 as const,
          isActive: true,
        },
        {
          id: '11155111:999',
          name: 'Security Agent',
          chainId: 11155111 as const,
          isActive: false,
        },
      ];
      render(<CompareTemplate agents={fourAgents} />);

      expect(screen.getByTestId('compare-table')).toBeInTheDocument();
      expect(screen.getByText('Comparing 4 agents side by side')).toBeInTheDocument();
    });
  });

  describe('remove functionality', () => {
    it('calls onRemoveAgent when remove button is clicked', () => {
      const onRemoveAgent = vi.fn();
      render(<CompareTemplate agents={mockAgents} onRemoveAgent={onRemoveAgent} />);

      fireEvent.click(screen.getByTestId('compare-remove-11155111:123'));

      expect(onRemoveAgent).toHaveBeenCalledTimes(1);
      expect(onRemoveAgent).toHaveBeenCalledWith('11155111:123');
    });
  });
});
