import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Providers } from './providers';

// Test component to verify QueryClient is available
function TestComponent() {
  const queryClient = useQueryClient();
  return (
    <div data-testid="test-component">
      {queryClient ? 'QueryClient Available' : 'No QueryClient'}
    </div>
  );
}

describe('Providers', () => {
  describe('QueryClientProvider', () => {
    it('provides QueryClient to children', () => {
      render(
        <Providers>
          <TestComponent />
        </Providers>,
      );

      expect(screen.getByTestId('test-component')).toHaveTextContent('QueryClient Available');
    });

    it('renders children correctly', () => {
      render(
        <Providers>
          <div data-testid="child">Child Content</div>
        </Providers>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Providers>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </Providers>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
