import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type ReputationDataPoint, ReputationSparkline } from './reputation-sparkline';

describe('ReputationSparkline', () => {
  const upwardData: ReputationDataPoint[] = [
    { date: '2024-01-01', score: 60 },
    { date: '2024-01-15', score: 70 },
    { date: '2024-02-01', score: 80 },
  ];

  const downwardData: ReputationDataPoint[] = [
    { date: '2024-01-01', score: 90 },
    { date: '2024-01-15', score: 80 },
    { date: '2024-02-01', score: 70 },
  ];

  const stableData: ReputationDataPoint[] = [
    { date: '2024-01-01', score: 75 },
    { date: '2024-01-15', score: 76 },
    { date: '2024-02-01', score: 75 },
  ];

  it('renders with data', () => {
    render(<ReputationSparkline data={upwardData} />);

    expect(screen.getByTestId('reputation-sparkline')).toBeInTheDocument();
  });

  it('returns null for empty data', () => {
    const { container } = render(<ReputationSparkline data={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders SVG with correct dimensions', () => {
    render(<ReputationSparkline data={upwardData} width={100} height={30} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '30');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 30');
  });

  it('uses default dimensions when not specified', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('width', '60');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders path element for data', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('d');
    expect(path?.getAttribute('d')).not.toBe('');
  });

  it('renders endpoint dot', () => {
    render(<ReputationSparkline data={upwardData} />);

    expect(screen.getByTestId('sparkline-endpoint')).toBeInTheDocument();
  });

  it('identifies upward trend correctly', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'up');
  });

  it('identifies downward trend correctly', () => {
    render(<ReputationSparkline data={downwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'down');
  });

  it('identifies stable trend correctly', () => {
    render(<ReputationSparkline data={stableData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'stable');
  });

  it('uses green stroke for upward trend', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'var(--pixel-green-pipe, #00D800)');
  });

  it('uses red stroke for downward trend', () => {
    render(<ReputationSparkline data={downwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'var(--pixel-red-fire, #FC5454)');
  });

  it('uses blue stroke for stable trend', () => {
    render(<ReputationSparkline data={stableData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'var(--pixel-blue-sky, #5C94FC)');
  });

  it('uses blue stroke when showTrendColor is false', () => {
    render(<ReputationSparkline data={upwardData} showTrendColor={false} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    // Should always be blue when showTrendColor is false
    expect(path).toHaveAttribute('stroke', 'var(--pixel-blue-sky, #5C94FC)');
  });

  it('applies custom className', () => {
    render(<ReputationSparkline data={upwardData} className="custom-class" />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Reputation trend: up');
  });

  it('handles single data point', () => {
    const singlePoint: ReputationDataPoint[] = [{ date: '2024-01-01', score: 75 }];
    render(<ReputationSparkline data={singlePoint} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    expect(path).toBeInTheDocument();
    // Single point should create a horizontal line
    expect(path?.getAttribute('d')).toContain('M0');
    expect(path?.getAttribute('d')).toContain('L');
  });

  it('handles two data points', () => {
    const twoPoints: ReputationDataPoint[] = [
      { date: '2024-01-01', score: 60 },
      { date: '2024-02-01', score: 80 },
    ];
    render(<ReputationSparkline data={twoPoints} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-trend', 'up');
  });

  it('handles identical scores (flat line)', () => {
    const flatData: ReputationDataPoint[] = [
      { date: '2024-01-01', score: 75 },
      { date: '2024-01-15', score: 75 },
      { date: '2024-02-01', score: 75 },
    ];
    render(<ReputationSparkline data={flatData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'stable');
  });

  it('handles volatile data within threshold', () => {
    const volatileData: ReputationDataPoint[] = [
      { date: '2024-01-01', score: 75 },
      { date: '2024-01-15', score: 90 },
      { date: '2024-02-01', score: 50 },
      { date: '2024-02-15', score: 76 }, // Net change ~1%, within threshold
    ];
    render(<ReputationSparkline data={volatileData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    // 76 - 75 = 1, which is within ±2 threshold
    expect(svg).toHaveAttribute('data-trend', 'stable');
  });

  it('correctly calculates trend with small positive change', () => {
    const smallUpData: ReputationDataPoint[] = [
      { date: '2024-01-01', score: 75 },
      { date: '2024-02-01', score: 78 }, // +3, above threshold
    ];
    render(<ReputationSparkline data={smallUpData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'up');
  });

  it('correctly calculates trend with small negative change', () => {
    const smallDownData: ReputationDataPoint[] = [
      { date: '2024-01-01', score: 78 },
      { date: '2024-02-01', score: 75 }, // -3, above threshold
    ];
    render(<ReputationSparkline data={smallDownData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    expect(svg).toHaveAttribute('data-trend', 'down');
  });

  it('renders path with proper stroke properties', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');

    expect(path).toHaveAttribute('fill', 'none');
    expect(path).toHaveAttribute('stroke-width', '1.5');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('endpoint dot has correct fill color matching path', () => {
    render(<ReputationSparkline data={upwardData} />);

    const svg = screen.getByTestId('reputation-sparkline');
    const path = svg.querySelector('path');
    const endpoint = screen.getByTestId('sparkline-endpoint');

    expect(endpoint).toHaveAttribute('fill', path?.getAttribute('stroke'));
  });
});
