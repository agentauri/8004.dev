import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AgentHealthScore, AgentReputation, AgentValidation } from '@/types/agent';
import { AgentStatistics } from './agent-statistics';

const mockReputation: AgentReputation = {
  count: 23,
  averageScore: 85,
  distribution: {
    low: 2,
    medium: 5,
    high: 16,
  },
};

const mockValidations: AgentValidation[] = [
  {
    type: 'tee',
    status: 'valid',
    validatorAddress: '0x1234567890abcdef1234567890abcdef12345678',
    attestationId: '0xabc123',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    type: 'stake',
    status: 'pending',
    validatorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
];

const mockHealthScore: AgentHealthScore = {
  overallScore: 50,
  checks: [
    { category: 'metadata', status: 'fail', score: 0, message: 'Critical metadata missing' },
    { category: 'endpoints', status: 'pass', score: 100, message: 'No endpoints required' },
    { category: 'reputation', status: 'warning', score: 50, message: 'No feedback received yet' },
  ],
};

describe('AgentStatistics', () => {
  describe('rendering', () => {
    it('renders with minimal props', () => {
      render(<AgentStatistics />);
      expect(screen.getByTestId('agent-statistics')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<AgentStatistics className="custom-class" />);
      expect(screen.getByTestId('agent-statistics')).toHaveClass('custom-class');
    });
  });

  describe('stats grid', () => {
    it('renders all stat cards', () => {
      render(
        <AgentStatistics
          reputation={mockReputation}
          validations={mockValidations}
          supportedTrust={['reputation', 'stake']}
        />,
      );

      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards).toHaveLength(4); // Average Score, Total Feedbacks, Validations, Trust Models
    });

    it('displays correct average score', () => {
      render(<AgentStatistics reputation={mockReputation} />);
      // Use the stat-card-value data-testid to avoid matching the ReputationDistribution
      const statCards = screen.getAllByTestId('stat-card-value');
      // First card is Average Score
      expect(statCards[0]).toHaveTextContent('85');
    });

    it('displays correct feedback count', () => {
      render(<AgentStatistics reputation={mockReputation} />);
      // Use the stat-card-value data-testid to avoid matching the ReputationDistribution
      const statCards = screen.getAllByTestId('stat-card-value');
      // Second card is Total Feedbacks
      expect(statCards[1]).toHaveTextContent('23');
    });

    it('displays correct validations count', () => {
      render(<AgentStatistics validations={mockValidations} />);
      // Only 1 is 'valid', 1 is 'pending'
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('displays correct trust models count', () => {
      render(<AgentStatistics supportedTrust={['reputation', 'stake', 'tee']} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('handles zero values', () => {
      render(<AgentStatistics />);
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('score distribution', () => {
    it('renders distribution when reputation has feedbacks', () => {
      render(<AgentStatistics reputation={mockReputation} />);
      expect(screen.getByText('Score Distribution')).toBeInTheDocument();
    });

    it('does not render distribution when no feedbacks', () => {
      render(
        <AgentStatistics
          reputation={{ count: 0, averageScore: 0, distribution: { low: 0, medium: 0, high: 0 } }}
        />,
      );
      expect(screen.queryByText('Score Distribution')).not.toBeInTheDocument();
    });

    it('does not render distribution when reputation is undefined', () => {
      render(<AgentStatistics />);
      expect(screen.queryByText('Score Distribution')).not.toBeInTheDocument();
    });
  });

  describe('supported trust models', () => {
    it('renders trust models section', () => {
      render(<AgentStatistics supportedTrust={['reputation']} />);
      expect(screen.getByText('Supported Trust Models')).toBeInTheDocument();
    });

    it('displays trust model names', () => {
      render(<AgentStatistics supportedTrust={['reputation', 'stake']} />);
      expect(screen.getByText('reputation')).toBeInTheDocument();
      expect(screen.getByText('stake')).toBeInTheDocument();
    });

    it('displays trust model descriptions', () => {
      render(<AgentStatistics supportedTrust={['reputation']} />);
      expect(
        screen.getByText('Community feedback and ratings from other agents and users'),
      ).toBeInTheDocument();
    });

    it('shows empty state when no trust models', () => {
      render(<AgentStatistics supportedTrust={[]} />);
      expect(screen.getByText('No trust models configured for this agent.')).toBeInTheDocument();
    });

    it('handles unknown trust models gracefully', () => {
      render(<AgentStatistics supportedTrust={['custom-trust']} />);
      expect(screen.getByText('custom-trust')).toBeInTheDocument();
      expect(screen.getByText('Custom trust mechanism')).toBeInTheDocument();
    });
  });

  describe('registration info', () => {
    it('renders registration date when provided', () => {
      render(<AgentStatistics registeredAt="2024-01-15T10:30:00Z" />);
      expect(screen.getByText('Registration Date')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('does not render registration date when not provided', () => {
      render(<AgentStatistics />);
      expect(screen.queryByText('Registration Date')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('renders loading state for stat cards', () => {
      render(<AgentStatistics isLoading />);
      const statCards = screen.getAllByTestId('stat-card');
      statCards.forEach((card) => {
        expect(card).toHaveAttribute('data-loading', 'true');
      });
    });
  });

  describe('health checks', () => {
    it('renders health checks section when healthScore is provided', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      expect(screen.getByTestId('health-checks-section')).toBeInTheDocument();
      expect(screen.getByText('Health Checks')).toBeInTheDocument();
    });

    it('does not render health checks section when healthScore is not provided', () => {
      render(<AgentStatistics />);
      expect(screen.queryByTestId('health-checks-section')).not.toBeInTheDocument();
    });

    it('does not render health checks section when checks array is empty', () => {
      render(<AgentStatistics healthScore={{ overallScore: 0, checks: [] }} />);
      expect(screen.queryByTestId('health-checks-section')).not.toBeInTheDocument();
    });

    it('displays overall health score', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      const healthSection = screen.getByTestId('health-checks-section');
      // The overall score is in the header
      expect(healthSection).toHaveTextContent('50/100');
    });

    it('renders all health check items', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      const checkItems = screen.getAllByTestId('health-check-item');
      expect(checkItems).toHaveLength(3);
    });

    it('displays check categories', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      expect(screen.getByText('metadata')).toBeInTheDocument();
      expect(screen.getByText('endpoints')).toBeInTheDocument();
      expect(screen.getByText('reputation')).toBeInTheDocument();
    });

    it('displays check messages', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      expect(screen.getByText('Critical metadata missing')).toBeInTheDocument();
      expect(screen.getByText('No endpoints required')).toBeInTheDocument();
      expect(screen.getByText('No feedback received yet')).toBeInTheDocument();
    });

    it('displays check scores', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      expect(screen.getByText('0/100')).toBeInTheDocument();
      expect(screen.getByText('100/100')).toBeInTheDocument();
    });

    it('has correct data attributes for check statuses', () => {
      render(<AgentStatistics healthScore={mockHealthScore} />);
      const checkItems = screen.getAllByTestId('health-check-item');

      const metadataCheck = checkItems.find((item) => item.getAttribute('data-category') === 'metadata');
      const endpointsCheck = checkItems.find((item) => item.getAttribute('data-category') === 'endpoints');
      const reputationCheck = checkItems.find((item) => item.getAttribute('data-category') === 'reputation');

      expect(metadataCheck).toHaveAttribute('data-status', 'fail');
      expect(endpointsCheck).toHaveAttribute('data-status', 'pass');
      expect(reputationCheck).toHaveAttribute('data-status', 'warning');
    });
  });
});
