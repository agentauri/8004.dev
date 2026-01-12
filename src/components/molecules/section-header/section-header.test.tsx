import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './section-header';

// Mock lucide-react icon component
function MockIcon({ className }: { className?: string }) {
  return <svg data-testid="mock-icon" className={className} />;
}

describe('SectionHeader', () => {
  describe('rendering', () => {
    it('renders title in uppercase', () => {
      render(<SectionHeader title="Test Title" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Title');
      expect(heading).toHaveClass('uppercase');
    });

    it('renders with icon when provided', () => {
      render(<SectionHeader title="With Icon" icon={<MockIcon />} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('hides icon from accessibility tree', () => {
      render(<SectionHeader title="With Icon" icon={<MockIcon />} />);

      const iconWrapper = screen.getByTestId('mock-icon').parentElement;
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders action link when actionHref is provided', () => {
      render(<SectionHeader title="With Action" actionHref="/test" actionText="Browse all" />);

      const link = screen.getByRole('link', { name: 'Browse all' });
      expect(link).toHaveAttribute('href', '/test');
    });

    it('uses default action text when not provided', () => {
      render(<SectionHeader title="Default Action" actionHref="/test" />);

      expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
    });

    it('renders custom action test id', () => {
      render(
        <SectionHeader title="With TestId" actionHref="/test" actionTestId="custom-test-id" />,
      );

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('renders children when provided', () => {
      render(
        <SectionHeader title="With Children">
          <button type="button">Custom Button</button>
        </SectionHeader>,
      );

      expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
    });

    it('renders both children and action link', () => {
      render(
        <SectionHeader title="Both" actionHref="/test">
          <span data-testid="child-element">Child</span>
        </SectionHeader>,
      );

      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(<SectionHeader title="Custom Class" className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has correct font styling', () => {
      render(<SectionHeader title="Font Test" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('font-[family-name:var(--font-pixel-heading)]');
    });

    it('has responsive text sizing', () => {
      render(<SectionHeader title="Responsive" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-lg');
      expect(heading).toHaveClass('md:text-xl');
    });
  });

  describe('without optional props', () => {
    it('does not render icon container when icon is not provided', () => {
      const { container } = render(<SectionHeader title="No Icon" />);

      // Check that there's no aria-hidden element (icon wrapper)
      const ariaHiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(ariaHiddenElements).toHaveLength(0);
    });

    it('does not render link when actionHref is not provided', () => {
      render(<SectionHeader title="No Link" />);

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
