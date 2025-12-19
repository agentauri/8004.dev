import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PixelExplorer } from './pixel-explorer';

describe('PixelExplorer', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<PixelExplorer />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toBeInTheDocument();
      expect(explorer).toHaveAttribute('data-size', 'md');
      expect(explorer).toHaveAttribute('data-animation', 'none');
    });

    it('renders SVG with proper accessibility', () => {
      render(<PixelExplorer />);

      const svg = screen.getByRole('img', { name: 'Pixel Explorer character' });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders small size (32x40)', () => {
      render(<PixelExplorer size="sm" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-size', 'sm');
      expect(explorer).toHaveClass('w-8', 'h-10');
    });

    it('renders medium size (64x80, default)', () => {
      render(<PixelExplorer size="md" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-size', 'md');
      expect(explorer).toHaveClass('w-16', 'h-20');
    });

    it('renders large size (128x160)', () => {
      render(<PixelExplorer size="lg" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-size', 'lg');
      expect(explorer).toHaveClass('w-32', 'h-40');
    });

    it('renders extra large size (256x320)', () => {
      render(<PixelExplorer size="xl" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-size', 'xl');
      expect(explorer).toHaveClass('w-64', 'h-80');
    });
  });

  describe('animations', () => {
    it('renders with no animation by default', () => {
      render(<PixelExplorer />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'none');
    });

    it('applies float animation', () => {
      render(<PixelExplorer animation="float" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'float');
    });

    it('applies bounce animation', () => {
      render(<PixelExplorer animation="bounce" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'bounce');
    });

    it('applies walk animation', () => {
      render(<PixelExplorer animation="walk" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'walk');
    });

    it('applies search animation', () => {
      render(<PixelExplorer animation="search" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'search');
    });

    it('applies discover animation', () => {
      render(<PixelExplorer animation="discover" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'discover');
    });

    it('renders sparkle elements for discover animation', () => {
      const { container } = render(<PixelExplorer animation="discover" />);

      expect(container.querySelector('.explorer-sparkles')).toBeInTheDocument();
      expect(container.querySelector('.sparkle-1')).toBeInTheDocument();
      expect(container.querySelector('.sparkle-2')).toBeInTheDocument();
      expect(container.querySelector('.sparkle-3')).toBeInTheDocument();
      expect(container.querySelector('.sparkle-4')).toBeInTheDocument();
    });

    it('does not render sparkles for non-discover animations', () => {
      const { container } = render(<PixelExplorer animation="bounce" />);

      expect(container.querySelector('.explorer-sparkles')).not.toBeInTheDocument();
    });

    it('combines animation with size', () => {
      render(<PixelExplorer animation="bounce" size="lg" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveAttribute('data-animation', 'bounce');
      expect(explorer).toHaveAttribute('data-size', 'lg');
      expect(explorer).toHaveClass('w-32', 'h-40');
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      render(<PixelExplorer className="custom-class" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<PixelExplorer className="my-custom-class" size="lg" />);

      const explorer = screen.getByTestId('pixel-explorer');
      expect(explorer).toHaveClass('w-32', 'h-40', 'my-custom-class');
    });
  });

  describe('SVG content', () => {
    it('renders with pixelated image rendering', () => {
      render(<PixelExplorer />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveStyle({ imageRendering: 'pixelated' });
    });

    it('has correct viewBox for 35x45 pixel art dimensions', () => {
      render(<PixelExplorer />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('viewBox', '0 0 35 45');
    });

    it('contains character wrapper group', () => {
      const { container } = render(<PixelExplorer />);

      // The new classic explorer SVG uses a single character wrapper
      expect(container.querySelector('.explorer-character')).toBeInTheDocument();
    });
  });

  describe('body part groups for animations', () => {
    it('contains hat group for search animation', () => {
      const { container } = render(<PixelExplorer animation="search" />);

      expect(container.querySelector('.explorer-hat')).toBeInTheDocument();
    });

    it('contains boots group for walk animation', () => {
      const { container } = render(<PixelExplorer animation="walk" />);

      expect(container.querySelector('.explorer-boots')).toBeInTheDocument();
    });

    it('contains face group for search animation', () => {
      const { container } = render(<PixelExplorer animation="search" />);

      expect(container.querySelector('.explorer-face')).toBeInTheDocument();
    });

    it('contains all body part groups', () => {
      const { container } = render(<PixelExplorer />);

      expect(container.querySelector('.explorer-hat')).toBeInTheDocument();
      expect(container.querySelector('.explorer-face')).toBeInTheDocument();
      expect(container.querySelector('.explorer-body')).toBeInTheDocument();
      expect(container.querySelector('.explorer-arm-left')).toBeInTheDocument();
      expect(container.querySelector('.explorer-arm-right')).toBeInTheDocument();
      expect(container.querySelector('.explorer-legs')).toBeInTheDocument();
      expect(container.querySelector('.explorer-boots')).toBeInTheDocument();
    });
  });
});
