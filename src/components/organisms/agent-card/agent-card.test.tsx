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

  describe('bookmark functionality', () => {
    it('does not render bookmark button when onBookmarkToggle is not provided', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.queryByTestId('bookmark-button')).not.toBeInTheDocument();
    });

    it('renders bookmark button when onBookmarkToggle is provided', () => {
      const onBookmarkToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onBookmarkToggle={onBookmarkToggle} />);
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });

    it('renders bookmark button with correct bookmarked state', () => {
      const onBookmarkToggle = vi.fn();
      render(
        <AgentCard agent={mockAgent} isBookmarked={true} onBookmarkToggle={onBookmarkToggle} />,
      );
      const button = screen.getByTestId('bookmark-button');
      expect(button).toHaveAttribute('data-bookmarked', 'true');
    });

    it('renders bookmark button with correct unbookmarked state', () => {
      const onBookmarkToggle = vi.fn();
      render(
        <AgentCard agent={mockAgent} isBookmarked={false} onBookmarkToggle={onBookmarkToggle} />,
      );
      const button = screen.getByTestId('bookmark-button');
      expect(button).toHaveAttribute('data-bookmarked', 'false');
    });

    it('defaults isBookmarked to false when not provided', () => {
      const onBookmarkToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onBookmarkToggle={onBookmarkToggle} />);
      const button = screen.getByTestId('bookmark-button');
      expect(button).toHaveAttribute('data-bookmarked', 'false');
    });

    it('calls onBookmarkToggle when bookmark button is clicked', () => {
      const onBookmarkToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onBookmarkToggle={onBookmarkToggle} />);
      fireEvent.click(screen.getByTestId('bookmark-button'));
      expect(onBookmarkToggle).toHaveBeenCalledTimes(1);
    });

    it('does not trigger card navigation when bookmark button is clicked', () => {
      const onClick = vi.fn();
      const onBookmarkToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} onBookmarkToggle={onBookmarkToggle} />);
      fireEvent.click(screen.getByTestId('bookmark-button'));
      expect(onBookmarkToggle).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('has correct aria-label for unbookmarked state', () => {
      const onBookmarkToggle = vi.fn();
      render(
        <AgentCard agent={mockAgent} isBookmarked={false} onBookmarkToggle={onBookmarkToggle} />,
      );
      const button = screen.getByTestId('bookmark-button');
      expect(button).toHaveAttribute('aria-label', 'Add Test Agent to bookmarks');
    });

    it('has correct aria-label for bookmarked state', () => {
      const onBookmarkToggle = vi.fn();
      render(
        <AgentCard agent={mockAgent} isBookmarked={true} onBookmarkToggle={onBookmarkToggle} />,
      );
      const button = screen.getByTestId('bookmark-button');
      expect(button).toHaveAttribute('aria-label', 'Remove Test Agent from bookmarks');
    });
  });

  describe('compare functionality', () => {
    it('does not render compare checkbox when onCompareToggle is not provided', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.queryByTestId('compare-checkbox')).not.toBeInTheDocument();
    });

    it('renders compare checkbox when onCompareToggle is provided', () => {
      const onCompareToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onCompareToggle={onCompareToggle} />);
      expect(screen.getByTestId('compare-checkbox')).toBeInTheDocument();
    });

    it('renders compare checkbox with correct selected state', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={true}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('data-checked', 'true');
    });

    it('renders compare checkbox with correct unselected state', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={false}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('data-checked', 'false');
    });

    it('defaults isSelectedForCompare to false when not provided', () => {
      const onCompareToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onCompareToggle={onCompareToggle} />);
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('data-checked', 'false');
    });

    it('calls onCompareToggle when compare checkbox is clicked', () => {
      const onCompareToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onCompareToggle={onCompareToggle} />);
      fireEvent.click(screen.getByTestId('compare-checkbox'));
      expect(onCompareToggle).toHaveBeenCalledTimes(1);
    });

    it('does not trigger card navigation when compare checkbox is clicked', () => {
      const onClick = vi.fn();
      const onCompareToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} onCompareToggle={onCompareToggle} />);
      fireEvent.click(screen.getByTestId('compare-checkbox'));
      expect(onCompareToggle).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('renders compare checkbox as disabled when isCompareDisabled is true and not selected', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={false}
          isCompareDisabled={true}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('renders compare checkbox as enabled when isCompareDisabled is true but already selected', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={true}
          isCompareDisabled={true}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).not.toBeDisabled();
    });

    it('has correct aria-label for unselected state', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={false}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Add Test Agent to comparison');
    });

    it('has correct aria-label for selected state', () => {
      const onCompareToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          isSelectedForCompare={true}
          onCompareToggle={onCompareToggle}
        />,
      );
      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Remove Test Agent from comparison');
    });

    it('renders both compare checkbox and bookmark button when both handlers provided', () => {
      const onCompareToggle = vi.fn();
      const onBookmarkToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          onCompareToggle={onCompareToggle}
          onBookmarkToggle={onBookmarkToggle}
        />,
      );
      expect(screen.getByTestId('compare-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });
  });

  describe('watch functionality', () => {
    it('does not render watch button when onWatchToggle is not provided', () => {
      render(<AgentCard agent={mockAgent} />);
      expect(screen.queryByTestId('watch-button')).not.toBeInTheDocument();
    });

    it('renders watch button when onWatchToggle is provided', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onWatchToggle={onWatchToggle} />);
      expect(screen.getByTestId('watch-button')).toBeInTheDocument();
    });

    it('renders watch button with correct watched state', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} isWatched={true} onWatchToggle={onWatchToggle} />);
      const button = screen.getByTestId('watch-button');
      expect(button).toHaveAttribute('data-watched', 'true');
    });

    it('renders watch button with correct unwatched state', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} isWatched={false} onWatchToggle={onWatchToggle} />);
      const button = screen.getByTestId('watch-button');
      expect(button).toHaveAttribute('data-watched', 'false');
    });

    it('defaults isWatched to false when not provided', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onWatchToggle={onWatchToggle} />);
      const button = screen.getByTestId('watch-button');
      expect(button).toHaveAttribute('data-watched', 'false');
    });

    it('calls onWatchToggle when watch button is clicked', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onWatchToggle={onWatchToggle} />);
      fireEvent.click(screen.getByTestId('watch-button'));
      expect(onWatchToggle).toHaveBeenCalledTimes(1);
    });

    it('does not trigger card navigation when watch button is clicked', () => {
      const onClick = vi.fn();
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} onClick={onClick} onWatchToggle={onWatchToggle} />);
      fireEvent.click(screen.getByTestId('watch-button'));
      expect(onWatchToggle).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('has correct aria-label for unwatched state', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} isWatched={false} onWatchToggle={onWatchToggle} />);
      const button = screen.getByTestId('watch-button');
      expect(button).toHaveAttribute('aria-label', 'Start watching Test Agent');
    });

    it('has correct aria-label for watched state', () => {
      const onWatchToggle = vi.fn();
      render(<AgentCard agent={mockAgent} isWatched={true} onWatchToggle={onWatchToggle} />);
      const button = screen.getByTestId('watch-button');
      expect(button).toHaveAttribute('aria-label', 'Stop watching Test Agent');
    });

    it('renders all action buttons when all handlers provided', () => {
      const onCompareToggle = vi.fn();
      const onBookmarkToggle = vi.fn();
      const onWatchToggle = vi.fn();
      render(
        <AgentCard
          agent={mockAgent}
          onCompareToggle={onCompareToggle}
          onBookmarkToggle={onBookmarkToggle}
          onWatchToggle={onWatchToggle}
        />,
      );
      expect(screen.getByTestId('compare-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
      expect(screen.getByTestId('watch-button')).toBeInTheDocument();
    });
  });
});
