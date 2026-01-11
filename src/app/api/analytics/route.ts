/**
 * Analytics API route
 * GET /api/analytics - Get analytics summary
 *
 * Query parameters:
 * - period: hour | day | week | month (default: day)
 */

import { backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { AnalyticsSummary, Period } from '@/types/analytics';

/**
 * Generate mock analytics data for development/testing
 */
function getMockAnalytics(period: Period): AnalyticsSummary {
  const now = new Date();
  const periodStart = new Date(now);
  const periodEnd = new Date(now);

  switch (period) {
    case 'hour':
      periodStart.setMinutes(0, 0, 0);
      periodEnd.setHours(periodEnd.getHours() + 1);
      break;
    case 'day':
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setDate(periodEnd.getDate() + 1);
      break;
    case 'week':
      periodStart.setDate(periodStart.getDate() - periodStart.getDay());
      periodEnd.setDate(periodStart.getDate() + 7);
      break;
    case 'month':
      periodStart.setDate(1);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      break;
  }

  return {
    period,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    platformStats: {
      totalAgents: 156,
      activeAgents: 89,
      totalSearches: 2450,
      totalClassifications: 142,
      totalFeedback: 312,
      chainDistribution: {
        11155111: 45,
        84532: 38,
        80002: 32,
        59141: 25,
        296: 16,
      },
      protocolAdoption: {
        mcp: 78,
        a2a: 62,
        x402: 34,
      },
    },
    popularFilters: [
      { filterName: 'mcp', filterValue: 'true', usageCount: 245 },
      { filterName: 'a2a', filterValue: 'true', usageCount: 189 },
      { filterName: 'chains', filterValue: '11155111', usageCount: 156 },
      { filterName: 'domains', filterValue: 'technology', usageCount: 134 },
      { filterName: 'skills', filterValue: 'code_generation', usageCount: 98 },
    ],
    topEndpoints: [
      {
        endpoint: '/api/v1/agents',
        method: 'GET',
        requestCount: 1245,
        avgLatencyMs: 85,
        successRate: 0.99,
      },
      {
        endpoint: '/api/v1/search',
        method: 'POST',
        requestCount: 890,
        avgLatencyMs: 120,
        successRate: 0.98,
      },
      {
        endpoint: '/api/v1/agents/:id',
        method: 'GET',
        requestCount: 654,
        avgLatencyMs: 45,
        successRate: 0.99,
      },
      {
        endpoint: '/api/v1/taxonomy',
        method: 'GET',
        requestCount: 432,
        avgLatencyMs: 35,
        successRate: 1.0,
      },
      {
        endpoint: '/api/v1/stats',
        method: 'GET',
        requestCount: 321,
        avgLatencyMs: 28,
        successRate: 1.0,
      },
    ],
    searchVolume: {
      total: 890,
      avgLatencyMs: 120,
      avgResultCount: 15.3,
    },
    chainActivity: {
      11155111: { agents: 12, searches: 245, feedback: 45 },
      84532: { agents: 8, searches: 189, feedback: 32 },
      80002: { agents: 6, searches: 156, feedback: 28 },
      59141: { agents: 5, searches: 98, feedback: 15 },
      296: { agents: 3, searches: 67, feedback: 12 },
    },
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse period parameter
    const periodParam = searchParams.get('period');
    const period: Period = ['hour', 'day', 'week', 'month'].includes(periodParam ?? '')
      ? (periodParam as Period)
      : 'day';

    let data: AnalyticsSummary;

    try {
      const response = await backendFetch<AnalyticsSummary>('/api/v1/analytics', {
        params: { period },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });
      data = response.data;
    } catch (error) {
      // Fallback to mock data if backend not available
      if (shouldUseMockData(error)) {
        console.warn('Backend /api/v1/analytics not available, using mock data');
        data = getMockAnalytics(period);
      } else {
        throw error;
      }
    }

    return successResponse(data, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch analytics', 'ANALYTICS_ERROR');
  }
}
