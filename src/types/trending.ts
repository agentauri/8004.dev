/**
 * Trending types for agents with highest reputation growth
 */

import type { TrendDirection } from './agent';

/**
 * Time period for trending calculations
 */
export type TrendingPeriod = '24h' | '7d' | '30d';

/**
 * Trending agent with score change data
 */
export interface TrendingAgent {
  /** Agent ID (format: chainId:tokenId) */
  id: string;
  /** Chain ID where agent is registered */
  chainId: number;
  /** Token ID */
  tokenId: string;
  /** Agent display name */
  name: string;
  /** Agent image URL */
  image?: string;
  /** Current reputation score (0-100) */
  currentScore: number;
  /** Previous reputation score (before period) */
  previousScore: number;
  /** Absolute score change */
  scoreChange: number;
  /** Percentage change */
  percentageChange: number;
  /** Trend direction */
  trend: TrendDirection;
  /** Whether agent is currently active */
  isActive: boolean;
  /** Protocol support flags */
  hasMcp: boolean;
  hasA2a: boolean;
  x402Support: boolean;
}

/**
 * Query parameters for trending endpoint
 */
export interface TrendingQueryParams {
  /** Time period for trending calculation */
  period?: TrendingPeriod;
  /** Maximum number of agents to return (default: 5, max: 10) */
  limit?: number;
}

/**
 * API response for trending agents
 */
export interface TrendingAgentsResponse {
  /** List of trending agents */
  agents: TrendingAgent[];
  /** Time period used for calculation */
  period: TrendingPeriod;
  /** ISO timestamp of when data was generated */
  generatedAt: string;
  /** Next refresh timestamp */
  nextRefreshAt?: string;
}
