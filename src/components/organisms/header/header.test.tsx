import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

    it('renders pixel explorer in logo', () => {
      render(<Header />);
      expect(screen.getByTestId('pixel-explorer')).toBeInTheDocument();
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
});
