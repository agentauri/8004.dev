import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReputationSection } from './reputation-section';

const mockReputation = {
  count: 42,
  averageScore: 85,
  distribution: {
    low: 5,
    medium: 10,
    high: 27,
  },
};

describe('ReputationSection', () => {
  describe('with data', () => {
    it('renders section', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-section')).toBeInTheDocument();
    });

    it('has loaded state in data attribute', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-section')).toHaveAttribute('data-state', 'loaded');
    });

    it('displays section header by default', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByText('REPUTATION')).toBeInTheDocument();
    });

    it('hides header when showHeader is false', () => {
      render(<ReputationSection reputation={mockReputation} showHeader={false} />);
      expect(screen.queryByText('REPUTATION')).not.toBeInTheDocument();
    });

    it('renders ReputationDistribution component', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-distribution')).toBeInTheDocument();
    });

    it('passes correct data to ReputationDistribution', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByTestId('rating-count')).toHaveTextContent('42');
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '85');
    });
  });

  describe('empty state', () => {
    it('shows empty state when reputation is undefined', () => {
      render(<ReputationSection />);
      expect(screen.getByTestId('reputation-section')).toHaveAttribute('data-state', 'empty');
    });

    it('shows empty state when count is 0', () => {
      render(
        <ReputationSection
          reputation={{ count: 0, averageScore: 0, distribution: { low: 0, medium: 0, high: 0 } }}
        />,
      );
      expect(screen.getByTestId('reputation-section')).toHaveAttribute('data-state', 'empty');
    });

    it('displays no ratings message', () => {
      render(<ReputationSection />);
      expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    });

    it('displays call to action', () => {
      render(<ReputationSection />);
      expect(screen.getByText('Be the first to rate this agent')).toBeInTheDocument();
    });

    it('still shows header in empty state', () => {
      render(<ReputationSection />);
      expect(screen.getByText('REPUTATION')).toBeInTheDocument();
    });

    it('hides header in empty state when showHeader is false', () => {
      render(<ReputationSection showHeader={false} />);
      expect(screen.queryByText('REPUTATION')).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<ReputationSection reputation={mockReputation} className="custom-class" />);
      expect(screen.getByTestId('reputation-section')).toHaveClass('custom-class');
    });

    it('applies class names in empty state', () => {
      render(<ReputationSection className="custom-class" />);
      expect(screen.getByTestId('reputation-section')).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('uses section element', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByTestId('reputation-section').tagName).toBe('SECTION');
    });

    it('has heading element for header', () => {
      render(<ReputationSection reputation={mockReputation} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('REPUTATION');
    });
  });
});
