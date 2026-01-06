import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { BookmarkedAgent } from '@/hooks/use-bookmarks';
import { BookmarksDropdown } from './bookmarks-dropdown';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    className,
    role,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
    role?: string;
    'data-testid'?: string;
  }) => (
    <a href={href} onClick={onClick} className={className} role={role} data-testid={dataTestId}>
      {children}
    </a>
  ),
}));

describe('BookmarksDropdown', () => {
  const mockBookmarks: BookmarkedAgent[] = [
    {
      agentId: '11155111:123',
      name: 'Trading Bot',
      chainId: 11155111,
      description: 'An AI trading agent',
      bookmarkedAt: Date.now() - 86400000, // 1 day ago
    },
    {
      agentId: '84532:456',
      name: 'Code Assistant',
      chainId: 84532,
      bookmarkedAt: Date.now(),
    },
  ];

  const defaultProps = {
    bookmarks: mockBookmarks,
    onRemove: vi.fn(),
    onClearAll: vi.fn(),
  };

  it('renders trigger button with bookmark count', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    const trigger = screen.getByTestId('bookmarks-dropdown-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('2');
  });

  it('renders trigger button without count when empty', () => {
    render(<BookmarksDropdown {...defaultProps} bookmarks={[]} />);

    const trigger = screen.getByTestId('bookmarks-dropdown-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).not.toHaveTextContent('0');
  });

  it('opens dropdown panel when trigger is clicked', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    const trigger = screen.getByTestId('bookmarks-dropdown-trigger');
    fireEvent.click(trigger);

    expect(screen.getByTestId('bookmarks-dropdown-panel')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <BookmarksDropdown {...defaultProps} />
      </div>,
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));
    expect(screen.getByTestId('bookmarks-dropdown-panel')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.queryByTestId('bookmarks-dropdown-panel')).not.toBeInTheDocument();
  });

  it('closes dropdown when pressing Escape', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));
    expect(screen.getByTestId('bookmarks-dropdown-panel')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByTestId('bookmarks-dropdown-panel')).not.toBeInTheDocument();
  });

  it('displays bookmarked agents', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    expect(screen.getByText('Trading Bot')).toBeInTheDocument();
    expect(screen.getByText('Code Assistant')).toBeInTheDocument();
    expect(screen.getByText('An AI trading agent')).toBeInTheDocument();
  });

  it('displays empty state when no bookmarks', () => {
    render(<BookmarksDropdown {...defaultProps} bookmarks={[]} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    expect(screen.getByText('No bookmarks yet')).toBeInTheDocument();
    expect(screen.getByText('Click the bookmark icon on agents to save them')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<BookmarksDropdown {...defaultProps} onRemove={handleRemove} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    // Find and click remove button for first bookmark
    const removeButton = screen.getByLabelText('Remove Trading Bot from bookmarks');
    fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalledWith('11155111:123');
  });

  it('calls onClearAll when clear all button is clicked', () => {
    const handleClearAll = vi.fn();
    render(<BookmarksDropdown {...defaultProps} onClearAll={handleClearAll} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    // Click clear all
    fireEvent.click(screen.getByText('Clear all'));

    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });

  it('links to agent detail page', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    const agentLink = screen.getByTestId('bookmark-item-11155111:123');
    expect(agentLink).toHaveAttribute('href', '/agent/11155111:123');
  });

  it('links to bookmarks page', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    const viewAllLink = screen.getByText('View all');
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/bookmarks');
  });

  it('closes dropdown when navigating to agent', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));

    // Click on agent link
    fireEvent.click(screen.getByTestId('bookmark-item-11155111:123'));

    expect(screen.queryByTestId('bookmarks-dropdown-panel')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking close button', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId('bookmarks-dropdown-trigger'));
    expect(screen.getByTestId('bookmarks-dropdown-panel')).toBeInTheDocument();

    // Click close button
    fireEvent.click(screen.getByLabelText('Close bookmarks'));

    expect(screen.queryByTestId('bookmarks-dropdown-panel')).not.toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<BookmarksDropdown {...defaultProps} />);

    const trigger = screen.getByTestId('bookmarks-dropdown-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-label', 'Bookmarks (2)');

    // Open dropdown
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const panel = screen.getByTestId('bookmarks-dropdown-panel');
    expect(panel).toHaveAttribute('role', 'menu');
  });

  it('applies custom className', () => {
    render(<BookmarksDropdown {...defaultProps} className="custom-class" />);

    const container = screen.getByTestId('bookmarks-dropdown-trigger').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
