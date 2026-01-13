import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BookmarkedAgent, UseBookmarksResult } from '@/hooks/use-bookmarks';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import BookmarksPage from './page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    'data-testid'?: string;
  }) => (
    <a href={href} className={className} data-testid={dataTestId}>
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

// Mock useBookmarks hook
const mockUseBookmarks = vi.fn<() => UseBookmarksResult>();

vi.mock('@/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks')>();
  return {
    ...actual,
    useBookmarks: () => mockUseBookmarks(),
    useRealtimeEvents: () => ({
      eventCount: 0,
      isConnected: false,
      recentEvents: [],
      clearEvents: vi.fn(),
    }),
  };
});

function renderBookmarksPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <RealtimeEventsProvider enabled={false}>
        <BookmarksPage />
      </RealtimeEventsProvider>
    </QueryClientProvider>,
  );
}

describe('BookmarksPage', () => {
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
      description: 'Helps with code review',
      bookmarkedAt: Date.now(),
    },
    {
      agentId: '11155111:789',
      name: 'Data Analyzer',
      chainId: 11155111,
      bookmarkedAt: Date.now() - 172800000, // 2 days ago
    },
  ];

  const defaultMockReturn: UseBookmarksResult = {
    bookmarks: mockBookmarks,
    savedSearches: [],
    isBookmarked: vi.fn(),
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    toggleBookmark: vi.fn(),
    clearBookmarks: vi.fn(),
    saveSearch: vi.fn(),
    removeSearch: vi.fn(),
    clearSavedSearches: vi.fn(),
    getBookmarksByChain: vi.fn(),
    exportBookmarks: vi.fn(() => JSON.stringify({ bookmarks: mockBookmarks })),
    importBookmarks: vi.fn(() => ({ imported: 0, errors: 0 })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarks.mockReturnValue(defaultMockReturn);
  });

  it('renders page header', () => {
    renderBookmarksPage();

    expect(screen.getByRole('heading', { name: 'Bookmarks' })).toBeInTheDocument();
    expect(screen.getByText(/Your saved agents/)).toBeInTheDocument();
  });

  it('displays bookmarked agents', () => {
    renderBookmarksPage();

    expect(screen.getByText('Trading Bot')).toBeInTheDocument();
    expect(screen.getByText('Code Assistant')).toBeInTheDocument();
    expect(screen.getByText('Data Analyzer')).toBeInTheDocument();
  });

  it('displays empty state when no bookmarks', () => {
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      bookmarks: [],
    });

    renderBookmarksPage();

    expect(screen.getByText('No bookmarks yet')).toBeInTheDocument();
    expect(screen.getByText('Explore agents')).toBeInTheDocument();
  });

  it('filters bookmarks by search query', () => {
    renderBookmarksPage();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'trading' } });

    expect(screen.getByText('Trading Bot')).toBeInTheDocument();
    expect(screen.queryByText('Code Assistant')).not.toBeInTheDocument();
    expect(screen.queryByText('Data Analyzer')).not.toBeInTheDocument();
  });

  it('filters bookmarks by chain', () => {
    renderBookmarksPage();

    const chainFilter = screen.getByTestId('chain-filter');
    fireEvent.change(chainFilter, { target: { value: '11155111' } });

    expect(screen.getByText('Trading Bot')).toBeInTheDocument();
    expect(screen.getByText('Data Analyzer')).toBeInTheDocument();
    expect(screen.queryByText('Code Assistant')).not.toBeInTheDocument();
  });

  it('sorts bookmarks by name', () => {
    renderBookmarksPage();

    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    const cards = screen.getAllByTestId(/bookmark-card-/);
    expect(cards[0]).toHaveTextContent('Code Assistant');
    expect(cards[1]).toHaveTextContent('Data Analyzer');
    expect(cards[2]).toHaveTextContent('Trading Bot');
  });

  it('calls removeBookmark when remove button is clicked', () => {
    const removeBookmark = vi.fn();
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      removeBookmark,
    });

    renderBookmarksPage();

    const removeButton = screen.getByLabelText('Remove Trading Bot from bookmarks');
    fireEvent.click(removeButton);

    expect(removeBookmark).toHaveBeenCalledWith('11155111:123');
  });

  it('calls clearBookmarks when clear all is clicked', () => {
    const clearBookmarks = vi.fn();
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      clearBookmarks,
    });

    renderBookmarksPage();

    const clearButton = screen.getByLabelText('Clear all bookmarks');
    fireEvent.click(clearButton);

    expect(clearBookmarks).toHaveBeenCalledTimes(1);
  });

  it('displays bookmark count', () => {
    renderBookmarksPage();

    expect(screen.getByText('3 bookmarks')).toBeInTheDocument();
  });

  it('displays filtered count when searching', () => {
    renderBookmarksPage();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'trading' } });

    expect(screen.getByText('1 of 3 bookmarks')).toBeInTheDocument();
  });

  it('displays no matching bookmarks message', () => {
    renderBookmarksPage();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No matching bookmarks')).toBeInTheDocument();
  });

  it('exports bookmarks as JSON', () => {
    const exportBookmarks = vi.fn(() => JSON.stringify({ bookmarks: mockBookmarks }));
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      exportBookmarks,
    });

    // Mock URL.createObjectURL and revokeObjectURL
    const mockCreateObjectURL = vi.fn(() => 'blob:test');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    renderBookmarksPage();

    const exportButton = screen.getByLabelText('Export bookmarks');
    fireEvent.click(exportButton);

    expect(exportBookmarks).toHaveBeenCalledTimes(1);
    expect(mockCreateObjectURL).toHaveBeenCalled();
  });

  it('imports bookmarks from file', async () => {
    const importBookmarks = vi.fn(() => ({ imported: 2, errors: 0 }));
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      importBookmarks,
    });

    renderBookmarksPage();

    // Create a mock file with text() method
    const mockFile = {
      text: vi.fn().mockResolvedValue('{"bookmarks":[]}'),
    } as unknown as File;

    const fileInput = screen.getByTestId('import-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(importBookmarks).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Successfully imported 2 items/)).toBeInTheDocument();
    });
  });

  it('displays import error', async () => {
    const importBookmarks = vi.fn(() => ({ imported: 0, errors: 1 }));
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      importBookmarks,
    });

    renderBookmarksPage();

    // Create a mock file with text() method
    const mockFile = {
      text: vi.fn().mockResolvedValue('invalid'),
    } as unknown as File;

    const fileInput = screen.getByTestId('import-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Import failed/)).toBeInTheDocument();
    });
  });

  it('disables export button when no bookmarks', () => {
    mockUseBookmarks.mockReturnValue({
      ...defaultMockReturn,
      bookmarks: [],
    });

    renderBookmarksPage();

    const exportButton = screen.getByLabelText('Export bookmarks');
    expect(exportButton).toBeDisabled();
  });

  it('links to agent detail page', () => {
    renderBookmarksPage();

    const card = screen.getByTestId('bookmark-card-11155111:123');
    expect(card).toHaveAttribute('href', '/agent/11155111:123');
  });
});
