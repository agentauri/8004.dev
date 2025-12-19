import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  describe('rendering', () => {
    it('renders label and value', () => {
      render(<StatCard label="Total Agents" value={2704} />);

      expect(screen.getByTestId('stat-card')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-label')).toHaveTextContent('Total Agents');
      expect(screen.getByTestId('stat-card-value')).toHaveTextContent('2,704');
    });

    it('renders subValue when provided', () => {
      render(<StatCard label="Active" value={1523} subValue="/ 2704 total" />);

      expect(screen.getByTestId('stat-card-subvalue')).toHaveTextContent('/ 2704 total');
    });

    it('does not render subValue when not provided', () => {
      render(<StatCard label="Total" value={100} />);

      expect(screen.queryByTestId('stat-card-subvalue')).not.toBeInTheDocument();
    });

    it('formats large numbers with locale', () => {
      render(<StatCard label="Large" value={1234567} />);

      expect(screen.getByTestId('stat-card-value')).toHaveTextContent('1,234,567');
    });

    it('renders zero value', () => {
      render(<StatCard label="Empty" value={0} />);

      expect(screen.getByTestId('stat-card-value')).toHaveTextContent('0');
    });
  });

  describe('color styling', () => {
    it('applies color to border when provided', () => {
      render(<StatCard label="Sepolia" value={100} color="#fc5454" />);

      const card = screen.getByTestId('stat-card');
      expect(card).toHaveStyle({ borderColor: '#fc5454' });
    });

    it('applies color to value text when provided', () => {
      render(<StatCard label="Sepolia" value={100} color="#fc5454" />);

      const value = screen.getByTestId('stat-card-value');
      expect(value).toHaveStyle({ color: '#fc5454' });
    });

    it('applies glow effect when color is provided', () => {
      render(<StatCard label="Sepolia" value={100} color="#fc5454" />);

      const card = screen.getByTestId('stat-card');
      expect(card.style.boxShadow).toContain('0 0 20px');
    });

    it('does not apply color styles when color is not provided', () => {
      render(<StatCard label="Total" value={100} />);

      const card = screen.getByTestId('stat-card');
      const value = screen.getByTestId('stat-card-value');

      expect(card).not.toHaveStyle({ borderColor: '#fc5454' });
      expect(value).not.toHaveAttribute('style');
    });
  });

  describe('loading state', () => {
    it('renders loading skeleton when isLoading is true', () => {
      render(<StatCard label="Loading" value={0} isLoading />);

      const card = screen.getByTestId('stat-card');
      expect(card).toHaveAttribute('data-loading', 'true');
      expect(card).toHaveClass('animate-pulse');
    });

    it('does not render label and value when loading', () => {
      render(<StatCard label="Loading" value={100} isLoading />);

      expect(screen.queryByTestId('stat-card-label')).not.toBeInTheDocument();
      expect(screen.queryByTestId('stat-card-value')).not.toBeInTheDocument();
    });

    it('sets data-loading to false when not loading', () => {
      render(<StatCard label="Loaded" value={100} />);

      expect(screen.getByTestId('stat-card')).toHaveAttribute('data-loading', 'false');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<StatCard label="Custom" value={100} className="custom-class" />);

      expect(screen.getByTestId('stat-card')).toHaveClass('custom-class');
    });

    it('applies custom className when loading', () => {
      render(<StatCard label="Custom" value={100} className="custom-class" isLoading />);

      expect(screen.getByTestId('stat-card')).toHaveClass('custom-class');
    });
  });

  describe('size prop', () => {
    it('renders with default size (text-2xl)', () => {
      render(<StatCard label="Default" value={100} />);

      const value = screen.getByTestId('stat-card-value');
      expect(value).toHaveClass('text-2xl');
    });

    it('renders with large size (text-3xl)', () => {
      render(<StatCard label="Large" value={100} size="large" />);

      const value = screen.getByTestId('stat-card-value');
      expect(value).toHaveClass('text-3xl');
    });

    it('renders with default size explicitly set', () => {
      render(<StatCard label="Explicit Default" value={100} size="default" />);

      const value = screen.getByTestId('stat-card-value');
      expect(value).toHaveClass('text-2xl');
    });
  });
});
