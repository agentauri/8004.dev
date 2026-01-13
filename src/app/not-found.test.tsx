import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import NotFound from './not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the useWallet hook
vi.mock('@/hooks/use-wallet', () => ({
  useWallet: () => ({
    status: 'disconnected',
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    usdcBalance: null,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    switchToBase: vi.fn(),
    isReadyForPayment: false,
    connectors: [],
  }),
  truncateAddress: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
}));

function renderNotFound() {
  return render(
    <QueryClientProvider client={queryClient}>
      <RealtimeEventsProvider enabled={false}>
        <NotFound />
      </RealtimeEventsProvider>
    </QueryClientProvider>,
  );
}

describe('NotFound Page', () => {
  describe('rendering', () => {
    it('renders not found page', () => {
      renderNotFound();
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('displays 404 code', () => {
      renderNotFound();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('displays page not found title', () => {
      renderNotFound();
      expect(screen.getByText('PAGE NOT FOUND')).toBeInTheDocument();
    });

    it('displays description text', () => {
      renderNotFound();
      expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
    });

    it('displays pixel explorer', () => {
      renderNotFound();
      // There are multiple pixel explorers - one in header and one in the 404 content
      const pixelExplorers = screen.getAllByTestId('pixel-explorer');
      expect(pixelExplorers.length).toBeGreaterThanOrEqual(1);
    });

    it('displays hint text', () => {
      renderNotFound();
      expect(screen.getByText(/lost\? try searching for an agent/i)).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('renders go home link', () => {
      renderNotFound();
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders explore agents link', () => {
      renderNotFound();
      const exploreLink = screen.getByRole('link', { name: /explore agents/i });
      expect(exploreLink).toBeInTheDocument();
      expect(exploreLink).toHaveAttribute('href', '/explore');
    });
  });

  describe('styling', () => {
    it('has correct background class', () => {
      renderNotFound();
      expect(screen.getByTestId('not-found-page')).toHaveClass('bg-pixel-grid');
    });

    it('is centered on screen', () => {
      renderNotFound();
      const page = screen.getByTestId('not-found-page');
      expect(page).toHaveClass('min-h-screen');
      expect(page).toHaveClass('flex');
      expect(page).toHaveClass('items-center');
      expect(page).toHaveClass('justify-center');
    });
  });
});
