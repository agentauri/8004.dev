import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Badge>Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveTextContent('Test');
    });

    it('applies custom className', () => {
      render(<Badge className="custom-class">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveClass('custom-class');
    });

    it('passes through additional props', () => {
      render(<Badge title="Test title">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('title', 'Test title');
    });
  });

  describe('variants', () => {
    it('renders default variant by default', () => {
      render(<Badge>Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'default');
    });

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders destructive variant', () => {
      render(<Badge variant="destructive">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'destructive');
    });

    it('renders outline variant', () => {
      render(<Badge variant="outline">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'outline');
    });
  });

  describe('content', () => {
    it('renders text content', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Badge>
          <span data-testid="icon">🔥</span>
          <span>Hot</span>
        </Badge>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });
  });
});
