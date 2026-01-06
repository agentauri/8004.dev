import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { WatchedAgent } from '@/hooks/use-watchlist';
import { WatchlistItem, WatchlistPanel } from './watchlist-panel';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const createMockAgent = (id: string, overrides: Partial<WatchedAgent> = {}): WatchedAgent => ({
  agentId: id,
  name: `Agent ${id}`,
  chainId: 11155111,
  description: `Description for ${id}`,
  watchedAt: Date.now() - 1000000,
  ...overrides,
});

describe('WatchlistItem', () => {
  const defaultProps = {
    agent: createMockAgent('11155111:1'),
    onRemove: vi.fn(),
  };

  it('renders agent name with link', () => {
    render(<WatchlistItem {...defaultProps} />);

    const link = screen.getByTestId('watchlist-item-link-11155111:1');
    expect(link).toHaveTextContent('Agent 11155111:1');
    expect(link).toHaveAttribute('href', '/agent/11155111:1');
  });

  it('renders chain badge', () => {
    render(<WatchlistItem {...defaultProps} />);

    expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<WatchlistItem {...defaultProps} />);

    expect(screen.getByText('Description for 11155111:1')).toBeInTheDocument();
  });

  it('renders reputation score when provided', () => {
    const agent = createMockAgent('11155111:1', { lastReputationScore: 85 });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.getByTestId('watchlist-item-score-11155111:1')).toHaveTextContent('Score: 85');
  });

  it('renders active status', () => {
    const agent = createMockAgent('11155111:1', { lastActiveStatus: true });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.getByTestId('watchlist-item-status-11155111:1')).toHaveTextContent('Active');
  });

  it('renders inactive status', () => {
    const agent = createMockAgent('11155111:1', { lastActiveStatus: false });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.getByTestId('watchlist-item-status-11155111:1')).toHaveTextContent('Inactive');
  });

  it('shows CHANGED badge for recently changed agents', () => {
    const agent = createMockAgent('11155111:1', { lastChangeAt: Date.now() - 1000 });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.getByTestId('watchlist-item-changed-11155111:1')).toHaveTextContent('CHANGED');
  });

  it('does not show CHANGED badge for old changes', () => {
    const agent = createMockAgent('11155111:1', {
      lastChangeAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.queryByTestId('watchlist-item-changed-11155111:1')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<WatchlistItem {...defaultProps} onRemove={onRemove} />);

    fireEvent.click(screen.getByTestId('watchlist-item-remove-11155111:1'));

    expect(onRemove).toHaveBeenCalledWith('11155111:1');
  });

  it('renders existing notes', () => {
    const agent = createMockAgent('11155111:1', { notes: 'Important agent' });
    render(<WatchlistItem {...defaultProps} agent={agent} />);

    expect(screen.getByTestId('watchlist-item-notes-11155111:1')).toHaveTextContent(
      'Important agent',
    );
  });

  it('shows add note button when no notes and onUpdateNotes provided', () => {
    render(<WatchlistItem {...defaultProps} onUpdateNotes={vi.fn()} />);

    expect(screen.getByTestId('watchlist-item-add-note-11155111:1')).toBeInTheDocument();
  });

  it('allows editing notes', () => {
    const onUpdateNotes = vi.fn();
    const agent = createMockAgent('11155111:1', { notes: 'Old note' });
    render(<WatchlistItem {...defaultProps} agent={agent} onUpdateNotes={onUpdateNotes} />);

    // Click to edit
    fireEvent.click(screen.getByTestId('watchlist-item-notes-11155111:1'));

    // Input should appear
    const input = screen.getByTestId('watchlist-item-notes-input-11155111:1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Old note');

    // Change value and save
    fireEvent.change(input, { target: { value: 'New note' } });
    fireEvent.click(screen.getByTestId('watchlist-item-notes-save-11155111:1'));

    expect(onUpdateNotes).toHaveBeenCalledWith('11155111:1', 'New note');
  });

  it('applies loading state styles', () => {
    render(<WatchlistItem {...defaultProps} isLoading />);

    expect(screen.getByTestId('watchlist-item-11155111:1')).toHaveClass('opacity-50');
  });
});

describe('WatchlistPanel', () => {
  const mockWatchlist: WatchedAgent[] = [
    createMockAgent('11155111:1'),
    createMockAgent('84532:2', { chainId: 84532 }),
    createMockAgent('11155111:3', { lastChangeAt: Date.now() - 1000 }),
  ];

  const defaultProps = {
    watchlist: mockWatchlist,
    onRemove: vi.fn(),
  };

  it('renders watchlist panel', () => {
    render(<WatchlistPanel {...defaultProps} />);

    expect(screen.getByTestId('watchlist-panel')).toBeInTheDocument();
  });

  it('displays correct count', () => {
    render(<WatchlistPanel {...defaultProps} maxAgents={50} />);

    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('3/50');
  });

  it('shows changed count badge when agents have recent changes', () => {
    render(<WatchlistPanel {...defaultProps} />);

    expect(screen.getByTestId('watchlist-changed-count')).toHaveTextContent('1 changed');
  });

  it('renders all watchlist items', () => {
    render(<WatchlistPanel {...defaultProps} />);

    expect(screen.getByTestId('watchlist-item-11155111:1')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-item-84532:2')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-item-11155111:3')).toBeInTheDocument();
  });

  it('shows empty state when no agents', () => {
    render(<WatchlistPanel {...defaultProps} watchlist={[]} />);

    expect(screen.getByTestId('watchlist-empty')).toBeInTheDocument();
    expect(screen.getByText('NO AGENTS WATCHED')).toBeInTheDocument();
  });

  it('renders clear all button when onClearAll provided', () => {
    render(<WatchlistPanel {...defaultProps} onClearAll={vi.fn()} />);

    expect(screen.getByTestId('watchlist-clear-all')).toBeInTheDocument();
  });

  it('does not render clear all button when watchlist is empty', () => {
    render(<WatchlistPanel {...defaultProps} watchlist={[]} onClearAll={vi.fn()} />);

    expect(screen.queryByTestId('watchlist-clear-all')).not.toBeInTheDocument();
  });

  it('calls onClearAll when clear button is clicked', () => {
    const onClearAll = vi.fn();
    render(<WatchlistPanel {...defaultProps} onClearAll={onClearAll} />);

    fireEvent.click(screen.getByTestId('watchlist-clear-all'));

    expect(onClearAll).toHaveBeenCalled();
  });

  it('filters by chain ID', () => {
    render(<WatchlistPanel {...defaultProps} filterChainId={11155111} />);

    expect(screen.getByTestId('watchlist-item-11155111:1')).toBeInTheDocument();
    expect(screen.queryByTestId('watchlist-item-84532:2')).not.toBeInTheDocument();
    expect(screen.getByTestId('watchlist-item-11155111:3')).toBeInTheDocument();
  });

  it('filters to show only changed agents', () => {
    render(<WatchlistPanel {...defaultProps} showOnlyChanged />);

    expect(screen.queryByTestId('watchlist-item-11155111:1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('watchlist-item-84532:2')).not.toBeInTheDocument();
    expect(screen.getByTestId('watchlist-item-11155111:3')).toBeInTheDocument();
  });

  it('shows filtered empty state when filters match nothing', () => {
    render(<WatchlistPanel {...defaultProps} filterChainId={80002} />);

    expect(screen.getByTestId('watchlist-filtered-empty')).toBeInTheDocument();
  });

  it('calls onRemove when item remove is clicked', () => {
    const onRemove = vi.fn();
    render(<WatchlistPanel {...defaultProps} onRemove={onRemove} />);

    fireEvent.click(screen.getByTestId('watchlist-item-remove-11155111:1'));

    expect(onRemove).toHaveBeenCalledWith('11155111:1');
  });

  it('passes onUpdateNotes to items', () => {
    const onUpdateNotes = vi.fn();
    render(<WatchlistPanel {...defaultProps} onUpdateNotes={onUpdateNotes} />);

    // Each item should have the add note button since none have notes
    expect(screen.getByTestId('watchlist-item-add-note-11155111:1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<WatchlistPanel {...defaultProps} className="custom-class" />);

    expect(screen.getByTestId('watchlist-panel')).toHaveClass('custom-class');
  });

  it('applies loading state to items', () => {
    render(<WatchlistPanel {...defaultProps} isLoading />);

    expect(screen.getByTestId('watchlist-item-11155111:1')).toHaveClass('opacity-50');
  });
});
