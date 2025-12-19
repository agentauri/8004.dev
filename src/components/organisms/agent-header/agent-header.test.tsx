import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgentHeader } from './agent-header';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AgentHeader', () => {
  const defaultProps = {
    id: '11155111:123',
    name: 'Test Agent',
    chainId: 11155111 as const,
    isActive: true,
  };

  describe('rendering', () => {
    it('renders agent header', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('agent-header')).toBeInTheDocument();
    });

    it('displays agent name', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });

    it('displays agent ID', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByText('11155111:123')).toBeInTheDocument();
    });

    it('displays chain badge', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
    });

    it('displays active status badge', () => {
      render(<AgentHeader {...defaultProps} isActive={true} />);
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });

    it('displays inactive status badge', () => {
      render(<AgentHeader {...defaultProps} isActive={false} />);
      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });

    it('displays trust score when provided', () => {
      render(<AgentHeader {...defaultProps} trustScore={85} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
    });

    it('does not display trust score when not provided', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.queryByTestId('trust-score')).not.toBeInTheDocument();
    });

    it('displays agent image when provided', () => {
      render(<AgentHeader {...defaultProps} image="https://example.com/avatar.png" />);
      const img = screen.getByRole('img', { name: 'Test Agent avatar' });
      expect(img).toBeInTheDocument();
    });

    it('displays agent avatar component', () => {
      render(<AgentHeader {...defaultProps} />);
      // AgentAvatar renders with data-testid
      expect(screen.getByTestId('agent-avatar')).toBeInTheDocument();
    });

    it('displays copy button for agent ID', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });
  });

  describe('back navigation', () => {
    it('renders back link', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('back-link')).toBeInTheDocument();
    });

    it('back link points to /explore', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('back-link')).toHaveAttribute('href', '/explore');
    });

    it('displays back to explore text', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByText('Back to Explore')).toBeInTheDocument();
    });
  });

  describe('chain variations', () => {
    it('renders with Sepolia chain', () => {
      render(<AgentHeader {...defaultProps} chainId={11155111} />);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('renders with Base Sepolia chain', () => {
      render(<AgentHeader {...defaultProps} chainId={84532} />);
      expect(screen.getByText('BASE')).toBeInTheDocument();
    });

    it('renders with Polygon Amoy chain', () => {
      render(<AgentHeader {...defaultProps} chainId={80002} />);
      expect(screen.getByText('POLYGON')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<AgentHeader {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('agent-header')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<AgentHeader {...defaultProps} className="custom-class" />);
      const header = screen.getByTestId('agent-header');
      expect(header).toHaveClass('space-y-6');
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('has heading for agent name', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Agent');
    });

    it('back link is accessible', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByRole('link', { name: /back to explore/i })).toBeInTheDocument();
    });
  });

  describe('feedback and validation counts', () => {
    it('displays feedback count when provided', () => {
      render(<AgentHeader {...defaultProps} feedbackCount={17} />);
      expect(screen.getByText('17')).toBeInTheDocument();
      expect(screen.getByTitle('17 feedbacks')).toBeInTheDocument();
    });

    it('displays validation count when provided', () => {
      render(<AgentHeader {...defaultProps} validationCount={7} />);
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByTitle('7 validations')).toBeInTheDocument();
    });

    it('displays both counts when provided', () => {
      render(<AgentHeader {...defaultProps} feedbackCount={17} validationCount={7} />);
      expect(screen.getByTitle('17 feedbacks')).toBeInTheDocument();
      expect(screen.getByTitle('7 validations')).toBeInTheDocument();
    });

    it('does not display counts when not provided', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.queryByTitle(/feedback/i)).not.toBeInTheDocument();
      expect(screen.queryByTitle(/validation/i)).not.toBeInTheDocument();
    });

    it('uses singular form for single feedback', () => {
      render(<AgentHeader {...defaultProps} feedbackCount={1} />);
      expect(screen.getByTitle('1 feedback')).toBeInTheDocument();
    });

    it('uses singular form for single validation', () => {
      render(<AgentHeader {...defaultProps} validationCount={1} />);
      expect(screen.getByTitle('1 validation')).toBeInTheDocument();
    });

    it('displays zero counts', () => {
      render(<AgentHeader {...defaultProps} feedbackCount={0} validationCount={0} />);
      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(2);
    });
  });

  describe('health score', () => {
    it('displays health badge when healthScore is provided', () => {
      render(<AgentHeader {...defaultProps} healthScore={75} />);
      expect(screen.getByTestId('health-badge')).toBeInTheDocument();
    });

    it('does not display health badge when healthScore is not provided', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.queryByTestId('health-badge')).not.toBeInTheDocument();
    });

    it('displays correct health level for good score', () => {
      render(<AgentHeader {...defaultProps} healthScore={90} />);
      expect(screen.getByText('GOOD')).toBeInTheDocument();
    });

    it('displays correct health level for fair score', () => {
      render(<AgentHeader {...defaultProps} healthScore={65} />);
      expect(screen.getByText('FAIR')).toBeInTheDocument();
    });

    it('displays correct health level for poor score', () => {
      render(<AgentHeader {...defaultProps} healthScore={30} />);
      expect(screen.getByText('POOR')).toBeInTheDocument();
    });
  });

  describe('warnings count', () => {
    it('displays warnings badge when warningsCount is greater than 0', () => {
      render(<AgentHeader {...defaultProps} warningsCount={3} />);
      expect(screen.getByTestId('warnings-badge')).toBeInTheDocument();
      expect(screen.getByText('3 WARN')).toBeInTheDocument();
    });

    it('does not display warnings badge when warningsCount is 0', () => {
      render(<AgentHeader {...defaultProps} warningsCount={0} />);
      expect(screen.queryByTestId('warnings-badge')).not.toBeInTheDocument();
    });

    it('does not display warnings badge when warningsCount is not provided', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.queryByTestId('warnings-badge')).not.toBeInTheDocument();
    });

    it('has correct title attribute for plural warnings', () => {
      render(<AgentHeader {...defaultProps} warningsCount={5} />);
      expect(screen.getByTitle('5 warnings')).toBeInTheDocument();
    });

    it('has correct title attribute for single warning', () => {
      render(<AgentHeader {...defaultProps} warningsCount={1} />);
      expect(screen.getByTitle('1 warning')).toBeInTheDocument();
    });
  });

  describe('share button', () => {
    it('renders share button', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTestId('share-button')).toBeInTheDocument();
    });

    it('has correct initial title', () => {
      render(<AgentHeader {...defaultProps} />);
      expect(screen.getByTitle('Share agent')).toBeInTheDocument();
    });

    it('copies URL to clipboard when clicked and navigator.share is not available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
        share: undefined,
      });

      render(<AgentHeader {...defaultProps} />);
      const shareButton = screen.getByTestId('share-button');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
      });
    });

    it('shows copied feedback after clicking', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
        share: undefined,
      });

      render(<AgentHeader {...defaultProps} />);
      const shareButton = screen.getByTestId('share-button');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(screen.getByTitle('Link copied!')).toBeInTheDocument();
      });
    });

    it('uses navigator.share when available', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        share: mockShare,
      });

      render(<AgentHeader {...defaultProps} />);
      const shareButton = screen.getByTestId('share-button');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Test Agent - Agent Explorer',
          text: 'Check out Test Agent on Agent Explorer',
          url: expect.any(String),
        });
      });
    });
  });
});
