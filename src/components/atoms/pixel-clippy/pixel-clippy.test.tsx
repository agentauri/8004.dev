import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PixelClippy } from './pixel-clippy';

describe('PixelClippy', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<PixelClippy />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toBeInTheDocument();
      expect(clippy).toHaveAttribute('data-size', 'md');
      expect(clippy).toHaveAttribute('data-mood', 'idle');
      expect(clippy).toHaveAttribute('data-animation', 'none');
    });

    it('renders SVG with aria-label', () => {
      render(<PixelClippy mood="happy" />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('aria-label', 'Clippy assistant happy mood');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<PixelClippy size="sm" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-size', 'sm');
    });

    it('renders medium size', () => {
      render(<PixelClippy size="md" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-size', 'md');
    });

    it('renders large size', () => {
      render(<PixelClippy size="lg" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-size', 'lg');
    });

    it('renders extra large size', () => {
      render(<PixelClippy size="xl" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-size', 'xl');
    });
  });

  describe('moods', () => {
    it('renders idle mood', () => {
      render(<PixelClippy mood="idle" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-mood', 'idle');
    });

    it('renders thinking mood', () => {
      render(<PixelClippy mood="thinking" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-mood', 'thinking');
    });

    it('renders happy mood', () => {
      render(<PixelClippy mood="happy" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-mood', 'happy');
    });

    it('renders surprised mood', () => {
      render(<PixelClippy mood="surprised" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-mood', 'surprised');
    });

    it('renders wink mood', () => {
      render(<PixelClippy mood="wink" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-mood', 'wink');
    });
  });

  describe('animations', () => {
    it('renders without animation', () => {
      render(<PixelClippy animation="none" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-animation', 'none');
    });

    it('renders float animation', () => {
      render(<PixelClippy animation="float" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-animation', 'float');
    });

    it('renders bounce animation', () => {
      render(<PixelClippy animation="bounce" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-animation', 'bounce');
    });

    it('renders wiggle animation', () => {
      render(<PixelClippy animation="wiggle" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-animation', 'wiggle');
    });

    it('renders wave animation', () => {
      render(<PixelClippy animation="wave" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('data-animation', 'wave');
    });
  });

  describe('message', () => {
    it('does not render message when not provided', () => {
      render(<PixelClippy />);

      expect(screen.queryByTestId('pixel-clippy-message')).not.toBeInTheDocument();
    });

    it('renders message when provided', () => {
      render(<PixelClippy message="Need help?" />);

      const message = screen.getByTestId('pixel-clippy-message');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Need help?');
    });

    it('renders different messages correctly', () => {
      const { rerender } = render(<PixelClippy message="Hello!" />);
      expect(screen.getByTestId('pixel-clippy-message')).toHaveTextContent('Hello!');

      rerender(<PixelClippy message="Goodbye!" />);
      expect(screen.getByTestId('pixel-clippy-message')).toHaveTextContent('Goodbye!');
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      fireEvent.click(clippy);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      fireEvent.keyDown(clippy, { key: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when other key is pressed', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      fireEvent.keyDown(clippy, { key: 'Space' });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('has cursor-pointer when onClick is provided', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveClass('cursor-pointer');
    });

    it('does not have cursor-pointer when onClick is not provided', () => {
      render(<PixelClippy />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).not.toHaveClass('cursor-pointer');
    });

    it('has role="button" when onClick is provided', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('role', 'button');
    });

    it('is focusable when onClick is provided', () => {
      const onClick = vi.fn();
      render(<PixelClippy onClick={onClick} />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      render(<PixelClippy className="custom-class" />);

      const clippy = screen.getByTestId('pixel-clippy');
      expect(clippy).toHaveClass('custom-class');
    });
  });

  describe('testId', () => {
    it('uses default testId', () => {
      render(<PixelClippy />);

      expect(screen.getByTestId('pixel-clippy')).toBeInTheDocument();
    });

    it('uses custom testId', () => {
      render(<PixelClippy testId="custom-clippy" />);

      expect(screen.getByTestId('custom-clippy')).toBeInTheDocument();
    });

    it('uses custom testId for message', () => {
      render(<PixelClippy testId="custom-clippy" message="Hello!" />);

      expect(screen.getByTestId('custom-clippy-message')).toBeInTheDocument();
    });
  });
});
