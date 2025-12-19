import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CapabilityTag } from './capability-tag';

describe('CapabilityTag', () => {
  describe('rendering', () => {
    it('renders with type', () => {
      render(<CapabilityTag type="mcp" />);
      expect(screen.getByTestId('capability-tag')).toBeInTheDocument();
      expect(screen.getByText('MCP')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CapabilityTag type="mcp" className="custom-class" />);
      expect(screen.getByTestId('capability-tag')).toHaveClass('custom-class');
    });

    it('has title attribute with description', () => {
      render(<CapabilityTag type="mcp" />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute(
        'title',
        'Model Context Protocol',
      );
    });

    it('sets data-type attribute', () => {
      render(<CapabilityTag type="a2a" />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('data-type', 'a2a');
    });
  });

  describe('capability types', () => {
    it('renders MCP type', () => {
      render(<CapabilityTag type="mcp" />);
      expect(screen.getByText('MCP')).toBeInTheDocument();
      expect(screen.getByTestId('capability-tag')).toHaveAttribute(
        'title',
        'Model Context Protocol',
      );
    });

    it('renders A2A type', () => {
      render(<CapabilityTag type="a2a" />);
      expect(screen.getByText('A2A')).toBeInTheDocument();
      expect(screen.getByTestId('capability-tag')).toHaveAttribute(
        'title',
        'Agent-to-Agent Protocol',
      );
    });

    it('renders x402 type', () => {
      render(<CapabilityTag type="x402" />);
      expect(screen.getByText('x402')).toBeInTheDocument();
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('title', 'Payment Protocol');
    });

    it('renders custom type with label', () => {
      render(<CapabilityTag type="custom" label="GraphQL" />);
      expect(screen.getByText('GraphQL')).toBeInTheDocument();
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('data-type', 'custom');
    });

    it('renders custom type with fallback label', () => {
      render(<CapabilityTag type="custom" />);
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('custom label override', () => {
    it('uses custom label when provided', () => {
      render(<CapabilityTag type="mcp" label="Custom MCP" />);
      expect(screen.getByText('Custom MCP')).toBeInTheDocument();
    });

    it('overrides type label with custom label', () => {
      render(<CapabilityTag type="a2a" label="Agent Comm" />);
      expect(screen.getByText('Agent Comm')).toBeInTheDocument();
      expect(screen.queryByText('A2A')).not.toBeInTheDocument();
    });
  });

  describe('interactive mode', () => {
    it('is not interactive by default', () => {
      render(<CapabilityTag type="mcp" />);
      const tag = screen.getByTestId('capability-tag');
      expect(tag).not.toHaveAttribute('role', 'button');
      expect(tag).not.toHaveAttribute('tabIndex');
    });

    it('is interactive when interactive prop is true', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" interactive onClick={onClick} />);
      const tag = screen.getByTestId('capability-tag');
      expect(tag).toHaveAttribute('role', 'button');
      expect(tag).toHaveAttribute('tabIndex', '0');
    });

    it('calls onClick when clicked in interactive mode', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" interactive onClick={onClick} />);
      fireEvent.click(screen.getByTestId('capability-tag'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not interactive', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" onClick={onClick} />);
      fireEvent.click(screen.getByTestId('capability-tag'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('handles Enter key in interactive mode', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" interactive onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('capability-tag'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key in interactive mode', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" interactive onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('capability-tag'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys in interactive mode', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" interactive onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('capability-tag'), { key: 'Tab' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not handle keys when not interactive', () => {
      const onClick = vi.fn();
      render(<CapabilityTag type="mcp" onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('capability-tag'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('selected state', () => {
    it('is not selected by default', () => {
      render(<CapabilityTag type="mcp" />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('data-selected', 'false');
    });

    it('shows selected state', () => {
      render(<CapabilityTag type="mcp" selected />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('data-selected', 'true');
    });

    it('has aria-pressed when interactive and selected', () => {
      render(<CapabilityTag type="mcp" interactive selected />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('aria-pressed', 'true');
    });

    it('has aria-pressed false when interactive and not selected', () => {
      render(<CapabilityTag type="mcp" interactive />);
      expect(screen.getByTestId('capability-tag')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('icons', () => {
    it('renders Cpu icon for MCP', () => {
      render(<CapabilityTag type="mcp" />);
      const container = screen.getByTestId('capability-tag');
      expect(container.querySelector('.lucide-cpu')).toBeInTheDocument();
    });

    it('renders MessageSquare icon for A2A', () => {
      render(<CapabilityTag type="a2a" />);
      const container = screen.getByTestId('capability-tag');
      expect(container.querySelector('.lucide-message-square')).toBeInTheDocument();
    });

    it('renders CreditCard icon for x402', () => {
      render(<CapabilityTag type="x402" />);
      const container = screen.getByTestId('capability-tag');
      expect(container.querySelector('.lucide-credit-card')).toBeInTheDocument();
    });

    it('renders Zap icon for custom type', () => {
      render(<CapabilityTag type="custom" label="Custom" />);
      const container = screen.getByTestId('capability-tag');
      expect(container.querySelector('.lucide-zap')).toBeInTheDocument();
    });
  });
});
