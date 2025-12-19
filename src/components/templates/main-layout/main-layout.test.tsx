import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  describe('rendering', () => {
    it('renders layout container', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('renders header', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('renders children in main area', () => {
      render(
        <MainLayout>
          <div data-testid="child">Child content</div>
        </MainLayout>,
      );
      const mainContent = screen.getByTestId('main-content');
      expect(mainContent).toContainElement(screen.getByTestId('child'));
    });

    it('renders footer by default', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('hides footer when showFooter is false', () => {
      render(<MainLayout showFooter={false}>Content</MainLayout>);
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });

    it('applies className to main content', () => {
      render(<MainLayout className="custom-class">Content</MainLayout>);
      expect(screen.getByTestId('main-content')).toHaveClass('custom-class');
    });
  });

  describe('chain selection', () => {
    it('uses default chain value (all chains)', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByText('ALL CHAINS')).toBeInTheDocument();
    });

    it('uses initial chains value', () => {
      render(<MainLayout initialChains={[11155111]}>Content</MainLayout>);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('calls onChainsChange when chain is selected', () => {
      const onChainsChange = vi.fn();
      render(<MainLayout onChainsChange={onChainsChange}>Content</MainLayout>);

      fireEvent.click(screen.getByTestId('chain-selector-trigger'));
      fireEvent.click(screen.getByTestId('chain-option-11155111'));

      expect(onChainsChange).toHaveBeenCalledWith([11155111]);
    });

    it('updates displayed chain when selection changes', () => {
      render(<MainLayout>Content</MainLayout>);

      expect(screen.getByText('ALL CHAINS')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('chain-selector-trigger'));
      fireEvent.click(screen.getByTestId('chain-option-84532'));

      // After selection, the trigger shows the selected chain badge
      const trigger = screen.getByTestId('chain-selector-trigger');
      expect(trigger).toHaveTextContent('BASE');
    });
  });

  describe('layout structure', () => {
    it('has min-height screen', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('main-layout')).toHaveClass('min-h-screen');
    });

    it('uses flex column layout', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('main-layout')).toHaveClass('flex', 'flex-col');
    });

    it('main content has flex-1 to fill space', () => {
      render(<MainLayout>Content</MainLayout>);
      expect(screen.getByTestId('main-content')).toHaveClass('flex-1');
    });
  });
});
