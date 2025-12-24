import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLAUDE_CODE_COMMAND, CLAUDE_DESKTOP_CONFIG_PATHS, MCP_ENDPOINTS } from './mcp-config';
import { MCPConnectModal } from './mcp-connect-modal';

describe('MCPConnectModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', () => {
    render(<MCPConnectModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId('mcp-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('mcp-modal')).toBeInTheDocument();
    expect(screen.getByText('Connect via MCP')).toBeInTheDocument();
  });

  it('renders all tabs', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('tab-claude-code')).toBeInTheDocument();
    expect(screen.getByTestId('tab-claude-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('tab-cursor')).toBeInTheDocument();
    expect(screen.getByTestId('tab-other')).toBeInTheDocument();
  });

  it('shows Claude Code tab content by default', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('tab-content-claude-code')).toBeInTheDocument();
    expect(screen.getByText(CLAUDE_CODE_COMMAND)).toBeInTheDocument();
  });

  it('switches to Claude Desktop tab when clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-claude-desktop'));

    expect(screen.getByTestId('tab-content-claude-desktop')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-content-claude-code')).not.toBeInTheDocument();
  });

  it('switches to Cursor tab when clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-cursor'));

    expect(screen.getByTestId('tab-content-cursor')).toBeInTheDocument();
  });

  it('switches to Other tab when clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-other'));

    expect(screen.getByTestId('tab-content-other')).toBeInTheDocument();
    expect(screen.getByText(MCP_ENDPOINTS.sse)).toBeInTheDocument();
    expect(screen.getByText(MCP_ENDPOINTS.mcp)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('mcp-modal-close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('mcp-modal-backdrop'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('mcp-modal'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<MCPConnectModal isOpen={false} onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe('');
  });

  it('has proper accessibility attributes', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    const modal = screen.getByTestId('mcp-modal');
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'mcp-modal-title');
  });

  it('renders config file instructions in Claude Desktop tab', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-claude-desktop'));

    expect(screen.getByText(/known bug/)).toBeInTheDocument();
    expect(screen.getByText(/config file method/)).toBeInTheDocument();
    expect(screen.getByText(CLAUDE_DESKTOP_CONFIG_PATHS.mac)).toBeInTheDocument();
    expect(screen.getByText(/Node.js installed/)).toBeInTheDocument();
  });

  it('renders config paths in Cursor tab', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-cursor'));

    expect(screen.getByText('macOS')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
  });

  it('renders docs link in Other tab', () => {
    render(<MCPConnectModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('tab-other'));

    const docsLink = screen.getByRole('link', { name: MCP_ENDPOINTS.docs });
    expect(docsLink).toHaveAttribute('href', MCP_ENDPOINTS.docs);
    expect(docsLink).toHaveAttribute('target', '_blank');
    expect(docsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
