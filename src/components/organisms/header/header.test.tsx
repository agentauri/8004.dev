import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/explore',
}));

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

// Mock useRealtimeEvents hook
vi.mock('@/hooks', () => ({
  useRealtimeEvents: () => ({
    eventCount: 3,
    isConnected: true,
    recentEvents: [],
    clearEvents: vi.fn(),
  }),
}));

// Mock useThemeContext hook
vi.mock('@/providers', () => ({
  useThemeContext: () => ({
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
    isLoaded: true,
  }),
}));

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

  describe('desktop navigation', () => {
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

    it('renders evaluate link', () => {
      render(<Header />);
      const evaluateLink = screen.getByTestId('nav-evaluate');
      expect(evaluateLink).toBeInTheDocument();
      expect(evaluateLink).toHaveAttribute('href', '/evaluate');
      expect(evaluateLink).toHaveTextContent('Evaluate');
    });

    it('renders compose link', () => {
      render(<Header />);
      const composeLink = screen.getByTestId('nav-compose');
      expect(composeLink).toBeInTheDocument();
      expect(composeLink).toHaveAttribute('href', '/compose');
      expect(composeLink).toHaveTextContent('Compose');
    });

    it('renders intents link', () => {
      render(<Header />);
      const intentsLink = screen.getByTestId('nav-intents');
      expect(intentsLink).toBeInTheDocument();
      expect(intentsLink).toHaveAttribute('href', '/intents');
      expect(intentsLink).toHaveTextContent('Intents');
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

  describe('event badge', () => {
    it('renders event badge in desktop nav', () => {
      render(<Header />);
      expect(screen.getByTestId('event-badge-container')).toBeInTheDocument();
    });

    it('renders event badge in mobile nav', () => {
      render(<Header />);
      expect(screen.getByTestId('event-badge-container-mobile')).toBeInTheDocument();
    });

    it('shows event panel when badge is clicked', () => {
      render(<Header />);

      const badges = screen.getAllByTestId('event-badge');
      fireEvent.click(badges[0]);

      expect(screen.getByTestId('event-panel')).toBeInTheDocument();
    });

    it('closes event panel when clicking close button', () => {
      render(<Header />);

      const badges = screen.getAllByTestId('event-badge');
      fireEvent.click(badges[0]);
      expect(screen.getByTestId('event-panel')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('event-panel-close'));
      expect(screen.queryByTestId('event-panel')).not.toBeInTheDocument();
    });
  });

  describe('mobile navigation', () => {
    it('renders mobile menu button', () => {
      render(<Header />);
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });

    it('has correct aria-label when menu is closed', () => {
      render(<Header />);
      expect(screen.getByTestId('mobile-menu-button')).toHaveAttribute('aria-label', 'Open menu');
    });

    it('toggles mobile menu on button click', () => {
      render(<Header />);

      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('mobile-menu-button'));
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('mobile-menu-button'));
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('has correct aria-label when menu is open', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-menu-button'));
      expect(screen.getByTestId('mobile-menu-button')).toHaveAttribute('aria-label', 'Close menu');
    });

    it('renders all nav links in mobile menu', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-menu-button'));

      expect(screen.getByTestId('mobile-nav-explore')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-evaluate')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-compose')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-intents')).toBeInTheDocument();
    });

    it('renders MCP connect button in mobile menu', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-menu-button'));

      expect(screen.getByTestId('mobile-nav-connect-mcp')).toBeInTheDocument();
    });

    it('closes mobile menu when nav link is clicked', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-menu-button'));
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('mobile-nav-explore'));
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('opens MCP modal from mobile menu', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-menu-button'));

      fireEvent.click(screen.getByTestId('mobile-nav-connect-mcp'));

      expect(screen.getByTestId('mcp-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
  });

  describe('active link highlighting', () => {
    it('highlights active link', () => {
      render(<Header />);
      const exploreLink = screen.getByTestId('nav-explore');
      expect(exploreLink).toHaveClass('text-[var(--pixel-primary)]');
    });

    it('does not highlight inactive links', () => {
      render(<Header />);
      const evaluateLink = screen.getByTestId('nav-evaluate');
      expect(evaluateLink).not.toHaveClass('text-[var(--pixel-primary)]');
    });
  });
});
