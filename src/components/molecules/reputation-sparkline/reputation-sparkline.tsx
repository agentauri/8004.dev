import type React from 'react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/** Data point for reputation trend */
export interface ReputationDataPoint {
  /** Date string (ISO format or any parseable date) */
  date: string;
  /** Reputation score (0-100) */
  score: number;
}

export interface ReputationSparklineProps {
  /** Array of reputation data points over time */
  data: ReputationDataPoint[];
  /** Width of the sparkline in pixels (default: 60) */
  width?: number;
  /** Height of the sparkline in pixels (default: 20) */
  height?: number;
  /** Whether to show trend-based coloring (default: true) */
  showTrendColor?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Colors for trend indication */
const TREND_COLORS = {
  up: 'var(--pixel-green-pipe, #00D800)',
  down: 'var(--pixel-red-fire, #FC5454)',
  stable: 'var(--pixel-blue-sky, #5C94FC)',
} as const;

/**
 * Calculate trend direction based on first and last data points
 */
function calculateTrend(data: ReputationDataPoint[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';

  const firstScore = data[0].score;
  const lastScore = data[data.length - 1].score;
  const threshold = 2; // 2% threshold to consider a change significant

  if (lastScore - firstScore > threshold) return 'up';
  if (firstScore - lastScore > threshold) return 'down';
  return 'stable';
}

/**
 * Generate SVG path data for a smooth curve through points
 */
function generatePath(data: ReputationDataPoint[], width: number, height: number): string {
  if (data.length === 0) return '';
  if (data.length === 1) {
    // Single point - draw a dot (horizontal line)
    const y = height - (data[0].score / 100) * height;
    return `M0,${y} L${width},${y}`;
  }

  const padding = 2;
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  // Find min and max scores for normalization
  const scores = data.map((d) => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1; // Avoid division by zero

  // Convert data points to coordinates
  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * effectiveWidth,
    // Invert Y axis and normalize within the score range
    y: padding + effectiveHeight - ((d.score - minScore) / scoreRange) * effectiveHeight,
  }));

  // Generate smooth path using quadratic bezier curves
  let path = `M${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Control point is midpoint with averaged Y
    const cpX = (prev.x + curr.x) / 2;
    const cpY = (prev.y + curr.y) / 2;

    // Use quadratic bezier for smooth curves
    if (i === 1) {
      path += ` Q${cpX},${prev.y} ${cpX},${cpY}`;
    }
    path += ` T${curr.x},${curr.y}`;
  }

  return path;
}

/**
 * ReputationSparkline displays a mini chart showing reputation trend over time.
 * Uses SVG for lightweight rendering without external dependencies.
 *
 * Features:
 * - Smooth curve interpolation
 * - Trend-based coloring (green for up, red for down, blue for stable)
 * - Configurable dimensions
 * - Responsive and lightweight
 *
 * @example
 * ```tsx
 * <ReputationSparkline
 *   data={[
 *     { date: '2024-01-01', score: 75 },
 *     { date: '2024-01-15', score: 80 },
 *     { date: '2024-02-01', score: 85 },
 *   ]}
 *   width={60}
 *   height={20}
 * />
 * ```
 */
export function ReputationSparkline({
  data,
  width = 60,
  height = 20,
  showTrendColor = true,
  className,
}: ReputationSparklineProps): React.JSX.Element | null {
  const pathData = useMemo(() => generatePath(data, width, height), [data, width, height]);
  const trend = useMemo(() => calculateTrend(data), [data]);

  // Don't render if no data
  if (data.length === 0) {
    return null;
  }

  const strokeColor = showTrendColor ? TREND_COLORS[trend] : TREND_COLORS.stable;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      data-testid="reputation-sparkline"
      data-trend={trend}
      aria-label={`Reputation trend: ${trend}`}
      role="img"
    >
      {/* Path line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End point dot */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={
            height -
            2 -
            ((data[data.length - 1].score - Math.min(...data.map((d) => d.score))) /
              (Math.max(...data.map((d) => d.score)) - Math.min(...data.map((d) => d.score)) ||
                1)) *
              (height - 4)
          }
          r={2}
          fill={strokeColor}
          data-testid="sparkline-endpoint"
        />
      )}
    </svg>
  );
}
