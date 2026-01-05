import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TrendingSection } from './trending-section';

// Mock the useTrending hook
const mockRefetch = vi.fn();
vi.mock('@/hooks', () => ({
  useTrending: vi.fn(),
}));

import { useTrending } from '@/hooks';

const mockTrendingData = {
  agents: [
    {
      id: '11155111:42',
      chainId: 11155111,
      tokenId: '42',
      name: 'CodeReview Pro',
      currentScore: 92,
      previousScore: 78,
      scoreChange: 14,
      percentageChange: 17.9,
      trend: 'up' as const,
      isActive: true,
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
    },
    {
      id: '84532:15',
      chainId: 84532,
      tokenId: '15',
      name: 'Trading Assistant',
      currentScore: 87,
      previousScore: 72,
      scoreChange: 15,
      percentageChange: 20.8,
      trend: 'up' as const,
      isActive: true,
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
    },
  ],
  period: '7d' as const,
  generatedAt: new Date().toISOString(),
};

describe('TrendingSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockTrendingData,
      isLoading: false,
      error: null,
      isFetching: false,
      refetch: mockRefetch,
    });
  });

  describe('rendering', () => {
    it('renders the section with title', () => {
      render(<TrendingSection />);
      expect(screen.getByTestId('trending-section')).toBeInTheDocument();
      expect(screen.getByText('Trending Agents')).toBeInTheDocument();
    });

    it('renders period selector buttons', () => {
      render(<TrendingSection />);
      expect(screen.getByText('24H')).toBeInTheDocument();
      expect(screen.getByText('7D')).toBeInTheDocument();
      expect(screen.getByText('30D')).toBeInTheDocument();
    });

    it('renders trending agent cards', () => {
      render(<TrendingSection />);
      expect(screen.getByText('CodeReview Pro')).toBeInTheDocument();
      expect(screen.getByText('Trading Assistant')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TrendingSection className="custom-class" />);
      expect(screen.getByTestId('trending-section')).toHaveClass('custom-class');
    });

    it('renders timestamp when available', () => {
      render(<TrendingSection />);
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
    });
  });

  describe('period selection', () => {
    it('initially selects the provided period', () => {
      render(<TrendingSection initialPeriod="30d" />);
      const button30d = screen.getByText('30D');
      expect(button30d).toHaveAttribute('aria-pressed', 'true');
    });

    it('defaults to 7d when no initial period provided', () => {
      render(<TrendingSection />);
      const button7d = screen.getByText('7D');
      expect(button7d).toHaveAttribute('aria-pressed', 'true');
    });

    it('changes period when button is clicked', () => {
      render(<TrendingSection />);
      const button24h = screen.getByText('24H');
      fireEvent.click(button24h);
      expect(button24h).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('loading state', () => {
    it('renders skeletons when loading', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        isFetching: false,
        refetch: mockRefetch,
      });

      render(<TrendingSection limit={5} />);
      expect(screen.getAllByTestId('trending-card-skeleton')).toHaveLength(5);
    });

    it('shows refresh icon when fetching', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockTrendingData,
        isLoading: false,
        error: null,
        isFetching: true,
        refetch: mockRefetch,
      });

      render(<TrendingSection />);
      expect(screen.getByLabelText('Refreshing')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error message when error occurs', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        isFetching: false,
        refetch: mockRefetch,
      });

      render(<TrendingSection />);
      expect(screen.getByText('Failed to load trending agents')).toBeInTheDocument();
    });

    it('renders try again button on error', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        isFetching: false,
        refetch: mockRefetch,
      });

      render(<TrendingSection />);
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls refetch when try again is clicked', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        isFetching: false,
        refetch: mockRefetch,
      });

      render(<TrendingSection />);
      fireEvent.click(screen.getByText('Try Again'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('empty state', () => {
    it('renders empty message when no agents', () => {
      (useTrending as ReturnType<typeof vi.fn>).mockReturnValue({
        data: { agents: [], period: '7d', generatedAt: new Date().toISOString() },
        isLoading: false,
        error: null,
        isFetching: false,
        refetch: mockRefetch,
      });

      render(<TrendingSection />);
      expect(
        screen.getByText('No trending agents found for the selected period.'),
      ).toBeInTheDocument();
    });
  });

  describe('hook integration', () => {
    it('passes correct params to useTrending', () => {
      render(<TrendingSection initialPeriod="24h" limit={3} />);
      expect(useTrending).toHaveBeenCalledWith({ period: '24h', limit: 3 });
    });

    it('updates params when period changes', () => {
      render(<TrendingSection initialPeriod="7d" limit={5} />);
      expect(useTrending).toHaveBeenCalledWith({ period: '7d', limit: 5 });

      fireEvent.click(screen.getByText('30D'));
      expect(useTrending).toHaveBeenCalledWith({ period: '30d', limit: 5 });
    });
  });
});
