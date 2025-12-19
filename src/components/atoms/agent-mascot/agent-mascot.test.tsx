import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentMascot } from './agent-mascot';

describe('AgentMascot', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<AgentMascot />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toBeInTheDocument();
      expect(mascot).toHaveAttribute('data-size', 'md');
      expect(mascot).toHaveAttribute('data-animation', 'none');
    });

    it('renders SVG with proper accessibility', () => {
      render(<AgentMascot />);

      const svg = screen.getByRole('img', { name: 'Agent-0 mascot' });
      expect(svg).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<AgentMascot size="sm" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-size', 'sm');
      expect(mascot).toHaveClass('w-4', 'h-4');
    });

    it('renders medium size (default)', () => {
      render(<AgentMascot size="md" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-size', 'md');
      expect(mascot).toHaveClass('w-8', 'h-8');
    });

    it('renders large size', () => {
      render(<AgentMascot size="lg" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-size', 'lg');
      expect(mascot).toHaveClass('w-16', 'h-16');
    });

    it('renders extra large size', () => {
      render(<AgentMascot size="xl" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-size', 'xl');
      expect(mascot).toHaveClass('w-32', 'h-32');
    });
  });

  describe('animations', () => {
    it('renders with no animation by default', () => {
      render(<AgentMascot />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'none');
      expect(mascot).not.toHaveClass('animate-mascot-float');
      expect(mascot).not.toHaveClass('animate-mascot-blink');
      expect(mascot).not.toHaveClass('animate-mascot-bounce');
      expect(mascot).not.toHaveClass('animate-mascot-pulse');
      expect(mascot).not.toHaveClass('animate-mascot-walk');
      expect(mascot).not.toHaveClass('animate-mascot-wave');
    });

    it('applies float animation', () => {
      render(<AgentMascot animation="float" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'float');
    });

    it('applies blink animation', () => {
      render(<AgentMascot animation="blink" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'blink');
    });

    it('applies bounce animation', () => {
      render(<AgentMascot animation="bounce" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'bounce');
    });

    it('applies pulse animation', () => {
      render(<AgentMascot animation="pulse" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'pulse');
    });

    it('applies walk animation', () => {
      render(<AgentMascot animation="walk" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'walk');
    });

    it('applies wave animation', () => {
      render(<AgentMascot animation="wave" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'wave');
    });

    it('applies dance animation', () => {
      render(<AgentMascot animation="dance" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'dance');
    });

    it('applies glitch animation', () => {
      render(<AgentMascot animation="glitch" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'glitch');
    });

    it('applies spin animation', () => {
      render(<AgentMascot animation="spin" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'spin');
    });

    it('applies celebrate animation', () => {
      render(<AgentMascot animation="celebrate" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'celebrate');
    });

    it('renders confetti elements for celebrate animation', () => {
      const { container } = render(<AgentMascot animation="celebrate" />);

      expect(container.querySelector('.mascot-confetti')).toBeInTheDocument();
      expect(container.querySelector('.confetti-1')).toBeInTheDocument();
      expect(container.querySelector('.confetti-2')).toBeInTheDocument();
      expect(container.querySelector('.confetti-3')).toBeInTheDocument();
      expect(container.querySelector('.confetti-4')).toBeInTheDocument();
    });

    it('does not render confetti for non-celebrate animations', () => {
      const { container } = render(<AgentMascot animation="dance" />);

      expect(container.querySelector('.mascot-confetti')).not.toBeInTheDocument();
    });

    it('combines animation with size', () => {
      render(<AgentMascot animation="bounce" size="lg" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveAttribute('data-animation', 'bounce');
      expect(mascot).toHaveAttribute('data-size', 'lg');
      expect(mascot).toHaveClass('w-16', 'h-16');
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      render(<AgentMascot className="custom-class" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<AgentMascot className="my-custom-class" size="lg" />);

      const mascot = screen.getByTestId('agent-mascot');
      expect(mascot).toHaveClass('w-16', 'h-16', 'my-custom-class');
    });
  });

  describe('SVG content', () => {
    it('renders with pixelated image rendering', () => {
      render(<AgentMascot />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveStyle({ imageRendering: 'pixelated' });
    });

    it('has correct viewBox', () => {
      render(<AgentMascot />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('contains animation target groups', () => {
      const { container } = render(<AgentMascot />);

      expect(container.querySelector('.mascot-visor')).toBeInTheDocument();
      expect(container.querySelector('.mascot-badge')).toBeInTheDocument();
      expect(container.querySelector('.mascot-arm-left')).toBeInTheDocument();
      expect(container.querySelector('.mascot-arm-right')).toBeInTheDocument();
      expect(container.querySelector('.mascot-leg-left')).toBeInTheDocument();
      expect(container.querySelector('.mascot-leg-right')).toBeInTheDocument();
    });
  });
});
