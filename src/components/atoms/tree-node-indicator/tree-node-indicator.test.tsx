import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TreeNodeIndicator } from './tree-node-indicator';

describe('TreeNodeIndicator', () => {
  describe('rendering', () => {
    it('renders with data-testid', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).toBeInTheDocument();
    });
  });

  describe('with children', () => {
    it('shows chevron when hasChildren is true', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      const indicator = screen.getByTestId('tree-node-indicator');
      expect(indicator).toHaveAttribute('data-has-children', 'true');
      expect(indicator.querySelector('svg')).toBeInTheDocument();
    });

    it('sets data-expanded to false when collapsed', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveAttribute('data-expanded', 'false');
    });

    it('sets data-expanded to true when expanded', () => {
      render(<TreeNodeIndicator isExpanded={true} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveAttribute('data-expanded', 'true');
    });

    it('applies rotation class when expanded', () => {
      render(<TreeNodeIndicator isExpanded={true} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveClass('rotate-90');
    });

    it('does not apply rotation class when collapsed', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).not.toHaveClass('rotate-90');
    });
  });

  describe('without children', () => {
    it('shows dot placeholder when hasChildren is false', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={false} />);
      const indicator = screen.getByTestId('tree-node-indicator');
      expect(indicator).toHaveAttribute('data-has-children', 'false');
      expect(indicator.querySelector('svg')).not.toBeInTheDocument();
    });

    it('shows dot element for leaf nodes', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={false} />);
      const indicator = screen.getByTestId('tree-node-indicator');
      const dot = indicator.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('size', () => {
    it('renders small size by default', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveClass('w-3');
    });

    it('renders medium size when specified', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} size="md" />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveClass('w-4');
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} className="custom-class" />);
      expect(screen.getByTestId('tree-node-indicator')).toHaveClass('custom-class');
    });

    it('has step-based transition timing', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      const indicator = screen.getByTestId('tree-node-indicator');
      expect(indicator).toHaveStyle({ transitionTimingFunction: 'steps(2)' });
    });
  });

  describe('accessibility', () => {
    it('hides chevron icon from screen readers', () => {
      render(<TreeNodeIndicator isExpanded={false} hasChildren={true} />);
      const icon = screen.getByTestId('tree-node-indicator').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
