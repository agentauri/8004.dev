import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompareBar } from './compare-bar';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CompareBar', () => {
  const defaultProps = {
    agents: [
      { id: '11155111:123', name: 'Trading Bot' },
      { id: '84532:456', name: 'Code Agent' },
    ],
    onRemove: vi.fn(),
    onClearAll: vi.fn(),
    compareUrl: '/compare?agents=11155111:123,84532:456',
  };

  describe('rendering', () => {
    it('renders nothing when no agents selected', () => {
      const { container } = render(<CompareBar {...defaultProps} agents={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders bar when agents are selected', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByTestId('compare-bar')).toBeInTheDocument();
    });

    it('renders agent count', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByText('2/4')).toBeInTheDocument();
    });

    it('renders custom max agents count', () => {
      render(<CompareBar {...defaultProps} maxAgents={6} />);

      expect(screen.getByText('2/6')).toBeInTheDocument();
    });

    it('renders agent chips with names', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByText('Trading Bot')).toBeInTheDocument();
      expect(screen.getByText('Code Agent')).toBeInTheDocument();
    });

    it('renders clear button', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByTestId('compare-bar-clear')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CompareBar {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('compare-bar')).toHaveClass('custom-class');
    });
  });

  describe('compare button', () => {
    it('renders enabled compare button when min agents met', () => {
      render(<CompareBar {...defaultProps} />);

      const button = screen.getByTestId('compare-bar-compare-button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('A');
      expect(button).toHaveAttribute('href', '/compare?agents=11155111:123,84532:456');
    });

    it('renders disabled compare button when below min agents', () => {
      render(
        <CompareBar {...defaultProps} agents={[{ id: '11155111:123', name: 'Trading Bot' }]} />,
      );

      expect(screen.getByTestId('compare-bar-compare-disabled')).toBeInTheDocument();
      expect(screen.queryByTestId('compare-bar-compare-button')).not.toBeInTheDocument();
    });

    it('uses custom minAgents value', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[
            { id: '1:1', name: 'Agent 1' },
            { id: '2:2', name: 'Agent 2' },
          ]}
          minAgents={3}
        />,
      );

      expect(screen.getByTestId('compare-bar-compare-disabled')).toBeInTheDocument();
    });
  });

  describe('max selection indicator', () => {
    it('does not show MAX when below max', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.queryByText('MAX')).not.toBeInTheDocument();
    });

    it('shows MAX indicator when at max agents', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[
            { id: '1:1', name: 'Agent 1' },
            { id: '2:2', name: 'Agent 2' },
            { id: '3:3', name: 'Agent 3' },
            { id: '4:4', name: 'Agent 4' },
          ]}
        />,
      );

      expect(screen.getByText('MAX')).toBeInTheDocument();
    });

    it('respects custom maxAgents for MAX indicator', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[
            { id: '1:1', name: 'Agent 1' },
            { id: '2:2', name: 'Agent 2' },
          ]}
          maxAgents={2}
        />,
      );

      expect(screen.getByText('MAX')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onRemove when remove button clicked', () => {
      const onRemove = vi.fn();
      render(<CompareBar {...defaultProps} onRemove={onRemove} />);

      fireEvent.click(screen.getByTestId('compare-bar-remove-11155111:123'));

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith('11155111:123');
    });

    it('calls onClearAll when clear button clicked', () => {
      const onClearAll = vi.fn();
      render(<CompareBar {...defaultProps} onClearAll={onClearAll} />);

      fireEvent.click(screen.getByTestId('compare-bar-clear'));

      expect(onClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has region role with label', () => {
      render(<CompareBar {...defaultProps} />);

      const bar = screen.getByTestId('compare-bar');
      expect(bar).toHaveAttribute('role', 'region');
      expect(bar).toHaveAttribute('aria-label', 'Agent comparison bar');
    });

    it('has accessible remove button labels', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByLabelText('Remove Trading Bot from comparison')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove Code Agent from comparison')).toBeInTheDocument();
    });

    it('has accessible clear button label', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByLabelText('Clear all selected agents')).toBeInTheDocument();
    });

    it('has accessible disabled compare hint', () => {
      render(
        <CompareBar {...defaultProps} agents={[{ id: '11155111:123', name: 'Trading Bot' }]} />,
      );

      expect(screen.getByLabelText('Select at least 2 agents to compare')).toBeInTheDocument();
    });

    it('has accessible disabled compare hint with custom minAgents', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[{ id: '11155111:123', name: 'Trading Bot' }]}
          minAgents={3}
        />,
      );

      expect(screen.getByLabelText('Select at least 3 agents to compare')).toBeInTheDocument();
    });
  });

  describe('agent chip rendering', () => {
    it('renders correct test IDs for each agent', () => {
      render(<CompareBar {...defaultProps} />);

      expect(screen.getByTestId('compare-bar-agent-11155111:123')).toBeInTheDocument();
      expect(screen.getByTestId('compare-bar-agent-84532:456')).toBeInTheDocument();
    });

    it('truncates long agent names', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[{ id: '1:1', name: 'Very Long Agent Name That Should Be Truncated' }]}
        />,
      );

      const chip = screen.getByTestId('compare-bar-agent-1:1');
      const nameSpan = chip.querySelector('span');
      expect(nameSpan).toHaveClass('truncate', 'max-w-[100px]');
    });
  });

  describe('edge cases', () => {
    it('renders with single agent', () => {
      render(
        <CompareBar {...defaultProps} agents={[{ id: '11155111:123', name: 'Solo Agent' }]} />,
      );

      expect(screen.getByText('1/4')).toBeInTheDocument();
      expect(screen.getByText('Solo Agent')).toBeInTheDocument();
      expect(screen.getByTestId('compare-bar-compare-disabled')).toBeInTheDocument();
    });

    it('renders with maximum agents', () => {
      render(
        <CompareBar
          {...defaultProps}
          agents={[
            { id: '1:1', name: 'A1' },
            { id: '2:2', name: 'A2' },
            { id: '3:3', name: 'A3' },
            { id: '4:4', name: 'A4' },
          ]}
        />,
      );

      expect(screen.getByText('4/4')).toBeInTheDocument();
      expect(screen.getByText('MAX')).toBeInTheDocument();
      expect(screen.getByTestId('compare-bar-compare-button')).toBeInTheDocument();
    });
  });
});
