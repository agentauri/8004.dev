import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgentCard, type AgentCardAgent } from './agent-card';

const mockAgent: AgentCardAgent = {
  id: '11155111:123',
  name: 'Test Agent',
  description: 'A test agent for unit testing',
  chainId: 11155111,
  isActive: true,
  isVerified: true,
  trustScore: 85,
  capabilities: ['mcp', 'a2a'],
};

describe('AgentCard', () => {
  describe('rendering', () => {
    it('renders agent card', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('agent-card')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<AgentCard agent={mockAgent} className="custom-class" />);
      expect(screen.getByTestId('agent-card')).toHaveClass('custom-class');
    });

    it('sets data-agent-id attribute', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('agent-card')).toHaveAttribute('data-agent-id', mockAgent.id);
    });
  });

  describe('active/inactive styling', () => {
    it('applies green border and glow for active agents', () => {
      render(<AgentCard agent={mockAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card).toHaveClass('border-[var(--pixel-green-pipe)]');
      expect(card).toHaveClass('shadow-[0_0_8px_var(--glow-green)]');
    });

    it('applies gray border and reduced opacity for inactive agents', () => {
      const inactiveAgent = { ...mockAgent, isActive: false };
      render(<AgentCard agent={inactiveAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card).toHaveClass('border-[var(--pixel-gray-700)]');
      expect(card).toHaveClass('opacity-70');
    });

    it('applies lift on hover for all cards', () => {
      render(<AgentCard agent={mockAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card).toHaveClass('hover:translate-y-[-2px]');
    });

    it('applies intensified glow on hover for active agents', () => {
      render(<AgentCard agent={mockAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card).toHaveClass('hover:shadow-[0_0_16px_var(--glow-green)]');
    });

    it('restores opacity on hover for inactive agents', () => {
      const inactiveAgent = { ...mockAgent, isActive: false };
      render(<AgentCard agent={inactiveAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card).toHaveClass('hover:opacity-100');
      expect(card).toHaveClass('hover:border-[var(--pixel-gray-600)]');
    });
  });

  describe('agent info', () => {
    it('renders agent name', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });

    it('renders full agent ID', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByText('11155111:123')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByText('A test agent for unit testing')).toBeInTheDocument();
    });

    it('renders without description', () => {
      const agentWithoutDesc = { ...mockAgent, description: undefined };
      render(<AgentCard agent={agentWithoutDesc} />);
      expect(screen.getByTestId('agent-card')).toBeInTheDocument();
      expect(screen.queryByText('A test agent for unit testing')).not.toBeInTheDocument();
    });

    it('renders copy button for agent ID', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('renders agent avatar component', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('agent-avatar')).toBeInTheDocument();
    });

    it('renders initials when no image provided', () => {
      render(<AgentCard agent={mockAgent} />);
      // AgentAvatar shows first 2 characters of name as initials
      expect(screen.getByText('TE')).toBeInTheDocument();
    });

    it('renders agent image when provided', () => {
      const agentWithImage = {
        ...mockAgent,
        image: 'https://example.com/avatar.png',
      };
      render(<AgentCard agent={agentWithImage} />);
      const img = screen.getByRole('img', { name: 'Test Agent avatar' });
      expect(img).toBeInTheDocument();
    });

    it('shows initials fallback when image fails to load', () => {
      const agentWithBrokenImage = {
        ...mockAgent,
        image: 'https://example.com/broken-image.png',
      };
      render(<AgentCard agent={agentWithBrokenImage} />);
      const img = screen.getByRole('img', { name: 'Test Agent avatar' });

      // Initially shows the image
      expect(img).toBeInTheDocument();

      // Simulate image load error
      fireEvent.error(img!);

      // After error, should show initials fallback
      expect(screen.getByText('TE')).toBeInTheDocument();
    });
  });

  describe('badges', () => {
    it('renders chain badge', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
    });

    it('renders status badge', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });

    it('renders trust score', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
    });

    it('renders without trust score', () => {
      const agentWithoutScore = { ...mockAgent, trustScore: undefined };
      render(<AgentCard agent={agentWithoutScore} />);
      expect(screen.queryByTestId('trust-score')).not.toBeInTheDocument();
    });

    it('renders reputation count with trust score', () => {
      const agentWithCount = { ...mockAgent, reputationCount: 23 };
      render(<AgentCard agent={agentWithCount} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('(23)');
    });

    it('renders trust badge when supportedTrust is provided', () => {
      const agentWithTrust = { ...mockAgent, supportedTrust: ['reputation', 'stake'] };
      render(<AgentCard agent={agentWithTrust} />);
      const badges = screen.getAllByTestId('status-badge');
      const trustBadge = badges.find((b) => b.getAttribute('data-status') === 'trust');
      expect(trustBadge).toBeInTheDocument();
    });

    it('does not render trust badge when supportedTrust is empty', () => {
      const agentNoTrust = { ...mockAgent, supportedTrust: [] };
      render(<AgentCard agent={agentNoTrust} />);
      const badges = screen.getAllByTestId('status-badge');
      const trustBadge = badges.find((b) => b.getAttribute('data-status') === 'trust');
      expect(trustBadge).toBeUndefined();
    });
  });

  describe('capabilities', () => {
    it('renders capability tags', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.getByText('MCP')).toBeInTheDocument();
      expect(screen.getByText('A2A')).toBeInTheDocument();
    });

    it('renders without capabilities', () => {
      const agentWithoutCaps = { ...mockAgent, capabilities: undefined };
      render(<AgentCard agent={agentWithoutCaps} />);
      expect(screen.queryByText('MCP')).not.toBeInTheDocument();
    });

    it('renders with empty capabilities array', () => {
      const agentWithEmptyCaps = { ...mockAgent, capabilities: [] };
      render(<AgentCard agent={agentWithEmptyCaps} />);
      expect(screen.queryByTestId('capability-tag')).not.toBeInTheDocument();
    });
  });

  describe('link behavior', () => {
    it('renders as link by default', () => {
      render(<AgentCard agent={mockAgent} />);
      const card = screen.getByTestId('agent-card');
      expect(card.tagName).toBe('A');
      expect(card).toHaveAttribute('href', `/agent/${mockAgent.id}`);
    });
  });

  describe('onClick behavior', () => {
    it('renders as button when onClick is provided', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      const card = screen.getByTestId('agent-card');
      expect(card.tagName).toBe('DIV');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      fireEvent.click(screen.getByTestId('agent-card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Enter key', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('agent-card'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('agent-card'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('agent-card'), { key: 'Tab' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('has tabIndex when onClick is provided', () => {
      const onClick = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} />);
      expect(screen.getByTestId('agent-card')).toHaveAttribute('tabIndex', '0');
    });
  });
});
