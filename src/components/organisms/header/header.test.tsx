import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  describe('rendering', () => {
    it('renders header element', () => {
      render(<Header />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Header className="custom-class" />);
      expect(screen.getByTestId('header')).toHaveClass('custom-class');
    });
  });

  describe('logo', () => {
    it('renders logo link', () => {
      render(<Header />);
      const logo = screen.getByTestId('header-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });

    it('renders logo text', () => {
      render(<Header />);
      expect(screen.getByText('8004')).toBeInTheDocument();
      expect(screen.getByText('.dev')).toBeInTheDocument();
    });

    it('renders logo icon', () => {
      render(<Header />);
      const logo = screen.getByTestId('header-logo');
      expect(logo.querySelector('.lucide-cpu')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders navigation container', () => {
      render(<Header />);
      expect(screen.getByTestId('header-nav')).toBeInTheDocument();
    });

    it('renders explore link', () => {
      render(<Header />);
      const exploreLink = screen.getByTestId('nav-explore');
      expect(exploreLink).toBeInTheDocument();
      expect(exploreLink).toHaveAttribute('href', '/explore');
      expect(exploreLink).toHaveTextContent('Explore');
    });

    it('renders Connect MCP button', () => {
      render(<Header />);
      const mcpButton = screen.getByTestId('nav-connect-mcp');
      expect(mcpButton).toBeInTheDocument();
      expect(mcpButton).toHaveTextContent('Connect MCP');
    });

    it('opens MCP modal when Connect MCP button is clicked', () => {
      render(<Header />);

      expect(screen.queryByTestId('mcp-modal')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('nav-connect-mcp'));

      expect(screen.getByTestId('mcp-modal')).toBeInTheDocument();
    });

    it('closes MCP modal when close button is clicked', () => {
      render(<Header />);

      fireEvent.click(screen.getByTestId('nav-connect-mcp'));
      expect(screen.getByTestId('mcp-modal')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('mcp-modal-close'));
      expect(screen.queryByTestId('mcp-modal')).not.toBeInTheDocument();
    });
  });

  describe('chain selector', () => {
    it('renders chain selector', () => {
      render(<Header />);
      expect(screen.getByTestId('chain-selector')).toBeInTheDocument();
    });

    it('uses default chain value (all chains)', () => {
      render(<Header />);
      expect(screen.getByText('ALL CHAINS')).toBeInTheDocument();
    });

    it('uses provided chain value', () => {
      render(<Header selectedChains={[11155111]} />);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('shows multiple chains when selected', () => {
      render(<Header selectedChains={[11155111, 84532]} />);
      const badges = screen.getAllByTestId('chain-badge');
      expect(badges).toHaveLength(2);
    });

    it('calls onChainsChange when chain is selected', () => {
      const onChainsChange = vi.fn();
      render(<Header onChainsChange={onChainsChange} />);

      fireEvent.click(screen.getByTestId('chain-selector-trigger'));
      fireEvent.click(screen.getByTestId('chain-option-11155111'));

      expect(onChainsChange).toHaveBeenCalledWith([11155111]);
    });

    it('disables chain selector when chainSelectorDisabled is true', () => {
      render(<Header chainSelectorDisabled />);
      expect(screen.getByTestId('chain-selector-trigger')).toBeDisabled();
    });
  });
});
