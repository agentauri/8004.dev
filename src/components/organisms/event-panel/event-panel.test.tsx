import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RealtimeEvent } from '@/types/agent';
import { EventPanel } from './event-panel';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockEvents: RealtimeEvent[] = [
  {
    type: 'agent.created',
    timestamp: new Date('2024-01-01T12:00:00Z'),
    data: {
      agentId: '11155111:1',
      chainId: 11155111,
      tokenId: '1',
      name: 'Test Agent 1',
    },
  },
  {
    type: 'agent.updated',
    timestamp: new Date('2024-01-01T11:30:00Z'),
    data: {
      agentId: '84532:2',
      changedFields: ['description'],
    },
  },
  {
    type: 'evaluation.completed',
    timestamp: new Date('2024-01-01T11:00:00Z'),
    data: {
      evaluationId: 'eval-1',
      agentId: '11155111:3',
      status: 'completed',
      overallScore: 85,
    },
  },
];

describe('EventPanel', () => {
  describe('rendering', () => {
    it('renders event panel', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} className="custom-class" />);
      expect(screen.getByTestId('event-panel')).toHaveClass('custom-class');
    });

    it('has correct accessibility attributes', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} />);
      const panel = screen.getByTestId('event-panel');
      expect(panel).toHaveAttribute('role', 'dialog');
      expect(panel).toHaveAttribute('aria-label', 'Recent events');
    });
  });

  describe('empty state', () => {
    it('shows empty message when no events', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel-empty')).toBeInTheDocument();
      expect(screen.getByText('No events yet')).toBeInTheDocument();
    });

    it('does not show clear button when empty', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} />);
      expect(screen.queryByTestId('event-panel-clear')).not.toBeInTheDocument();
    });

    it('does not show footer when empty', () => {
      render(<EventPanel events={[]} onClear={vi.fn()} />);
      expect(screen.queryByTestId('event-panel-view-all')).not.toBeInTheDocument();
    });
  });

  describe('with events', () => {
    it('renders event list', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel-list')).toBeInTheDocument();
    });

    it('renders all events', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-2')).toBeInTheDocument();
    });

    it('displays event type labels', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByText('New Agent')).toBeInTheDocument();
      expect(screen.getByText('Agent Updated')).toBeInTheDocument();
      expect(screen.getByText('Evaluation')).toBeInTheDocument();
    });

    it('displays event names', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByText('Test Agent 1')).toBeInTheDocument();
    });

    it('shows clear button when has events', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel-clear')).toBeInTheDocument();
    });

    it('shows footer when has events', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel-view-all')).toBeInTheDocument();
    });
  });

  describe('event links', () => {
    it('links to agent page when agentId exists', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/agent/11155111:1');
    });

    it('view all link points to explore page', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.getByTestId('event-panel-view-all')).toHaveAttribute('href', '/explore');
    });
  });

  describe('interactions', () => {
    it('calls onClear when clear button is clicked', () => {
      const handleClear = vi.fn();
      render(<EventPanel events={mockEvents} onClear={handleClear} />);

      fireEvent.click(screen.getByTestId('event-panel-clear'));
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onClose={handleClose} />);

      fireEvent.click(screen.getByTestId('event-panel-close'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onEventClick when event is clicked', () => {
      const handleEventClick = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onEventClick={handleEventClick} />);

      fireEvent.click(screen.getByTestId('event-item-0'));
      expect(handleEventClick).toHaveBeenCalledTimes(1);
      expect(handleEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('calls onClose when clicking view all link', () => {
      const handleClose = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onClose={handleClose} />);

      fireEvent.click(screen.getByTestId('event-panel-view-all'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not show close button when onClose is not provided', () => {
      render(<EventPanel events={mockEvents} onClear={vi.fn()} />);
      expect(screen.queryByTestId('event-panel-close')).not.toBeInTheDocument();
    });
  });

  describe('keyboard interactions', () => {
    it('calls onEventClick on Enter key', () => {
      const handleEventClick = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onEventClick={handleEventClick} />);

      fireEvent.keyDown(screen.getByTestId('event-item-0'), { key: 'Enter' });
      expect(handleEventClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClose on Escape key', () => {
      const handleClose = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onClose={handleClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('click outside', () => {
    it('calls onClose when clicking outside panel', () => {
      const handleClose = vi.fn();
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <EventPanel events={mockEvents} onClear={vi.fn()} onClose={handleClose} />
        </div>,
      );

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking inside panel', () => {
      const handleClose = vi.fn();
      render(<EventPanel events={mockEvents} onClear={vi.fn()} onClose={handleClose} />);

      fireEvent.mouseDown(screen.getByTestId('event-panel'));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});
