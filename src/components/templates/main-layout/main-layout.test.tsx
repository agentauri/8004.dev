import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import { MainLayout } from './main-layout';

// Mock useThemeContext hook
vi.mock('@/providers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/providers')>();
  return {
    ...actual,
    useThemeContext: () => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
      isLoaded: true,
    }),
  };
});

// Create wrapper with required providers
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <RealtimeEventsProvider enabled={false}>{children}</RealtimeEventsProvider>
      </QueryClientProvider>
    );
  };
}

describe('MainLayout', () => {
  describe('rendering', () => {
    it('renders layout container', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('renders header', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('renders children in main area', () => {
      render(
        <MainLayout>
          <div data-testid="child">Child content</div>
        </MainLayout>,
        { wrapper: createWrapper() },
      );
      const mainContent = screen.getByTestId('main-content');
      expect(mainContent).toContainElement(screen.getByTestId('child'));
    });

    it('renders footer by default', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('hides footer when showFooter is false', () => {
      render(<MainLayout showFooter={false}>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });

    it('applies className to main content', () => {
      render(<MainLayout className="custom-class">Content</MainLayout>, {
        wrapper: createWrapper(),
      });
      expect(screen.getByTestId('main-content')).toHaveClass('custom-class');
    });
  });

  describe('layout structure', () => {
    it('has min-height screen', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('main-layout')).toHaveClass('min-h-screen');
    });

    it('uses flex column layout', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('main-layout')).toHaveClass('flex', 'flex-col');
    });

    it('main content has flex-1 to fill space', () => {
      render(<MainLayout>Content</MainLayout>, { wrapper: createWrapper() });
      expect(screen.getByTestId('main-content')).toHaveClass('flex-1');
    });
  });
});
