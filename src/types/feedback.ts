/**
 * Global feedback types for cross-agent feedback display
 */

/**
 * Score category derived from numeric score
 * - positive: 70-100
 * - neutral: 40-69
 * - negative: 0-39
 */
export type FeedbackScoreCategory = 'positive' | 'neutral' | 'negative';

/**
 * Global feedback entry with agent information
 */
export interface GlobalFeedback {
  /** Unique feedback ID */
  id: string;
  /** Numeric score (0-100) */
  score: number;
  /** Feedback tags */
  tags: string[];
  /** Optional feedback context/comment */
  context?: string;
  /** Submitter wallet address */
  submitter: string;
  /** Submission timestamp (ISO string) */
  timestamp: string;
  /** Transaction hash on blockchain */
  transactionHash?: string;
  /** EAS attestation URL */
  feedbackUri?: string;
  /** Agent ID (format: chainId:tokenId) */
  agentId: string;
  /** Agent display name */
  agentName: string;
  /** Agent chain ID */
  agentChainId: number;
}

/**
 * Aggregated feedback statistics
 */
export interface FeedbackStats {
  /** Total feedback count */
  total: number;
  /** Positive feedback count (score 70-100) */
  positive: number;
  /** Neutral feedback count (score 40-69) */
  neutral: number;
  /** Negative feedback count (score 0-39) */
  negative: number;
}

/**
 * Filter parameters for global feedbacks
 */
export interface GlobalFeedbackFilters {
  /** Filter by score category */
  scoreCategory?: FeedbackScoreCategory;
  /** Filter by chain IDs */
  chains?: number[];
  /** Filter by start date (ISO string) */
  startDate?: string;
  /** Filter by end date (ISO string) */
  endDate?: string;
  /** Search by agent name or address */
  agentSearch?: string;
}

/**
 * Query parameters for global feedbacks API
 */
export interface GlobalFeedbackParams extends GlobalFeedbackFilters {
  /** Number of results per page (max 100) */
  limit?: number;
  /** Pagination cursor */
  cursor?: string;
}

/**
 * Global feedbacks API response
 */
export interface GlobalFeedbackResult {
  /** Feedback entries */
  feedbacks: GlobalFeedback[];
  /** Total count matching filters */
  total: number;
  /** Whether there are more results */
  hasMore: boolean;
  /** Cursor for next page */
  nextCursor?: string;
  /** Aggregated statistics */
  stats: FeedbackStats;
}

/**
 * Get score category from numeric score
 */
export function getScoreCategory(score: number): FeedbackScoreCategory {
  if (score >= 70) return 'positive';
  if (score >= 40) return 'neutral';
  return 'negative';
}
