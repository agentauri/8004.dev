/**
 * Leaderboard types for agent ranking by reputation score
 */

import type { TrendDirection } from './agent';

/**
 * Time period options for leaderboard filtering
 */
export type LeaderboardPeriod = 'all' | '30d' | '7d' | '24h';

/**
 * Leaderboard query parameters
 */
export interface LeaderboardParams {
  /** Filter by chain IDs */
  chains?: number[];
  /** Filter by MCP support */
  mcp?: boolean;
  /** Filter by A2A support */
  a2a?: boolean;
  /** Filter by x402 support */
  x402?: boolean;
  /** Time period for ranking */
  period?: LeaderboardPeriod;
  /** Number of results per page (max 100) */
  limit?: number;
  /** Pagination cursor */
  cursor?: string;
}

/**
 * Individual leaderboard entry
 */
export interface LeaderboardEntry {
  /** Rank position (1-indexed) */
  rank: number;
  /** Agent ID (format: chainId:tokenId) */
  agentId: string;
  /** Chain ID */
  chainId: number;
  /** Token ID */
  tokenId: string;
  /** Agent name */
  name: string;
  /** Agent description (truncated) */
  description: string;
  /** Agent image URL */
  image?: string;
  /** Reputation score (0-100) */
  score: number;
  /** Number of feedback entries */
  feedbackCount: number;
  /** Reputation trend */
  trend: TrendDirection;
  /** Whether agent is currently active */
  active: boolean;
  /** Protocol support flags */
  hasMcp: boolean;
  hasA2a: boolean;
  x402Support: boolean;
  /** Registration date (ISO string) */
  registeredAt?: string;
}

/**
 * Leaderboard API response
 */
export interface LeaderboardResponse {
  /** Ranked agents */
  entries: LeaderboardEntry[];
  /** Total count of agents matching filters */
  total: number;
  /** Whether there are more results */
  hasMore: boolean;
  /** Cursor for next page */
  nextCursor?: string;
  /** Metadata about the leaderboard */
  meta: {
    /** Time period used for ranking */
    period: LeaderboardPeriod;
    /** When the data was generated */
    generatedAt: string;
  };
}

/**
 * Filter state for leaderboard UI
 */
export interface LeaderboardFiltersState {
  /** Selected chain IDs */
  chains: number[];
  /** Selected protocols */
  protocols: ('mcp' | 'a2a' | 'x402')[];
  /** Time period */
  period: LeaderboardPeriod;
}
