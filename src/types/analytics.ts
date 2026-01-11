/**
 * Analytics types for platform metrics and aggregations
 */

/**
 * Metric types available for historical data
 */
export type MetricType = 'agents' | 'search' | 'classification' | 'feedback' | 'api_usage';

/**
 * Time period for aggregation
 */
export type Period = 'hour' | 'day' | 'week' | 'month';

/**
 * Historical analytics metric data point
 */
export interface AnalyticsMetric {
  id: string;
  metricType: MetricType;
  period: Period;
  periodStart: string;
  periodEnd: string;
  chainId: number | null;
  data: Record<string, unknown>;
  createdAt: string;
}

/**
 * Filter usage statistics
 */
export interface FilterUsage {
  filterName: string;
  filterValue: string;
  usageCount: number;
}

/**
 * API endpoint usage statistics
 */
export interface ApiEndpointUsage {
  endpoint: string;
  method: string;
  requestCount: number;
  avgLatencyMs: number | null;
  successRate: number;
}

/**
 * Platform-wide statistics
 */
export interface PlatformStats {
  totalAgents: number;
  activeAgents: number;
  totalSearches: number;
  totalClassifications: number;
  totalFeedback: number;
  chainDistribution: Record<number, number>;
  protocolAdoption: {
    mcp: number;
    a2a: number;
    x402: number;
  };
}

/**
 * Search volume statistics
 */
export interface SearchVolumeStats {
  total: number;
  avgLatencyMs: number;
  avgResultCount: number;
}

/**
 * Chain activity breakdown
 */
export interface ChainActivity {
  agents: number;
  searches: number;
  feedback: number;
}

/**
 * Full analytics summary for a period
 */
export interface AnalyticsSummary {
  period: Period;
  periodStart: string;
  periodEnd: string;
  platformStats: PlatformStats;
  popularFilters: FilterUsage[];
  topEndpoints: ApiEndpointUsage[];
  searchVolume: SearchVolumeStats;
  chainActivity: Record<number, ChainActivity>;
}

/**
 * Query parameters for analytics API
 */
export interface AnalyticsParams {
  period?: Period;
  limit?: number;
}

/**
 * Query parameters for historical metrics
 */
export interface HistoricalMetricsParams {
  metricType: MetricType;
  period?: Period;
  chainId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
