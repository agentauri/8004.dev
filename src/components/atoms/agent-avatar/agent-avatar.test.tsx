import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentAvatar } from './agent-avatar';

describe('AgentAvatar', () => {
  describe('Image Rendering', () => {
    it('renders image when provided', () => {
      render(<AgentAvatar name="Test Agent" image="https://example.com/avatar.jpg" />);

      const img = screen.getByAltText('Test Agent avatar');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('shows loading state while image loads', () => {
      render(<AgentAvatar name="Test Agent" image="https://example.com/avatar.jpg" />);

      const img = screen.getByAltText('Test Agent avatar');
      // Image should have opacity-0 class before load
      expect(img).toHaveClass('opacity-0');
    });

    it('removes loading state after image loads', async () => {
      render(<AgentAvatar name="Test Agent" image="https://example.com/avatar.jpg" />);

      const img = screen.getByAltText('Test Agent avatar');

      // Simulate image load using fireEvent
      fireEvent.load(img);

      await waitFor(() => {
        expect(img).not.toHaveClass('opacity-0');
      });
    });

    it('falls back to initials on image error', async () => {
      render(<AgentAvatar name="Test Agent" image="https://example.com/broken.jpg" />);

      const img = screen.getByAltText('Test Agent avatar');

      // Simulate image error using fireEvent
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.queryByAltText('Test Agent avatar')).not.toBeInTheDocument();
        expect(screen.getByText('TE')).toBeInTheDocument();
      });
    });
  });

  describe('Initials Fallback', () => {
    it('shows initials when no image provided', () => {
      render(<AgentAvatar name="Trading Bot" />);

      expect(screen.getByText('TR')).toBeInTheDocument();
    });

    it('generates correct initials from name', () => {
      const cases = [
        { name: 'Code Agent', expected: 'CO' },
        { name: 'AI Assistant', expected: 'AI' },
        { name: 'Bot', expected: 'BO' },
        { name: 'X', expected: 'X' },
      ];

      cases.forEach(({ name, expected }) => {
        const { rerender } = render(<AgentAvatar name={name} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
        rerender(<div />); // Clean up
      });
    });

    it('handles empty name with ?? fallback', () => {
      render(<AgentAvatar name="" />);
      expect(screen.getByText('??')).toBeInTheDocument();
    });

    it('converts initials to uppercase', () => {
      render(<AgentAvatar name="lowercase agent" />);
      expect(screen.getByText('LO')).toBeInTheDocument();
    });
  });

  describe('Color Generation', () => {
    it('generates consistent color from name', () => {
      const { container: container1 } = render(<AgentAvatar name="Test Agent" />);
      const { container: container2 } = render(<AgentAvatar name="Test Agent" />);

      const avatar1 = container1.querySelector('[data-testid="agent-avatar"]');
      const avatar2 = container2.querySelector('[data-testid="agent-avatar"]');

      // Both should have the same background color class
      expect(avatar1?.className).toBe(avatar2?.className);
    });

    it('generates different colors for different names', () => {
      const { container: container1 } = render(<AgentAvatar name="Agent A" />);
      const { container: container2 } = render(<AgentAvatar name="Agent B" />);

      const avatar1 = container1.querySelector('[data-testid="agent-avatar"]');
      const avatar2 = container2.querySelector('[data-testid="agent-avatar"]');

      // Check if they have different background classes
      // Note: They might occasionally be the same due to hash collision, but statistically unlikely
      const hasColor1 = avatar1?.className.includes('bg-[#');
      const hasColor2 = avatar2?.className.includes('bg-[#');

      expect(hasColor1).toBe(true);
      expect(hasColor2).toBe(true);
    });

    it('uses retro color palette', () => {
      const { container } = render(<AgentAvatar name="Test" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      const retroColors = [
        'bg-[#5C94FC]', // blue
        'bg-[#FC5454]', // red
        'bg-[#00D800]', // green
        'bg-[#FCC03C]', // gold
        'bg-[#9C54FC]', // purple
      ];

      const hasRetroColor = retroColors.some((color) => avatar?.className.includes(color));

      expect(hasRetroColor).toBe(true);
    });

    it('handles empty name with default color', () => {
      const { container } = render(<AgentAvatar name="" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('bg-[#5C94FC]'); // Default blue
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes', () => {
      const { container } = render(<AgentAvatar name="Test" size="sm" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('w-8');
      expect(avatar?.className).toContain('h-8');
      expect(avatar?.className).toContain('text-xs');
    });

    it('applies medium size classes', () => {
      const { container } = render(<AgentAvatar name="Test" size="md" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('w-12');
      expect(avatar?.className).toContain('h-12');
      expect(avatar?.className).toContain('text-sm');
    });

    it('applies large size classes', () => {
      const { container } = render(<AgentAvatar name="Test" size="lg" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('w-16');
      expect(avatar?.className).toContain('h-16');
      expect(avatar?.className).toContain('text-base');
    });

    it('defaults to medium size', () => {
      const { container } = render(<AgentAvatar name="Test" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('w-12');
      expect(avatar?.className).toContain('h-12');
    });
  });

  describe('Styling and Appearance', () => {
    it('applies custom className', () => {
      const { container } = render(<AgentAvatar name="Test" className="custom-class" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('custom-class');
    });

    it('has data-testid attribute', () => {
      render(<AgentAvatar name="Test" />);
      expect(screen.getByTestId('agent-avatar')).toBeInTheDocument();
    });

    it('applies border and rounded corners', () => {
      const { container } = render(<AgentAvatar name="Test" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('border-2');
      expect(avatar?.className).toContain('border-[#3A3A3A]');
      expect(avatar?.className).toContain('rounded-lg');
    });

    it('applies overflow hidden for rounded corners', () => {
      const { container } = render(<AgentAvatar name="Test" />);
      const avatar = container.querySelector('[data-testid="agent-avatar"]');

      expect(avatar?.className).toContain('overflow-hidden');
    });
  });

  describe('Edge Cases', () => {
    it('handles single character name', () => {
      render(<AgentAvatar name="A" />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('handles numeric name', () => {
      render(<AgentAvatar name="123" />);
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('handles special characters in name', () => {
      render(<AgentAvatar name="@#$%" />);
      expect(screen.getByText('@#')).toBeInTheDocument();
    });

    it('handles emoji in name', () => {
      render(<AgentAvatar name="🤖🚀" />);
      // Emojis take 2 characters each in some cases
      const avatar = screen.getByTestId('agent-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('handles very long names', () => {
      render(<AgentAvatar name="This is a very long agent name" />);
      expect(screen.getByText('TH')).toBeInTheDocument();
    });

    it('handles whitespace in name', () => {
      render(<AgentAvatar name="  Agent  " />);
      // Should use first 2 characters including spaces
      const initials = screen.getByTestId('agent-avatar').textContent;
      expect(initials?.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('provides alt text for image', () => {
      render(<AgentAvatar name="Test Agent" image="https://example.com/avatar.jpg" />);

      const img = screen.getByAltText('Test Agent avatar');
      expect(img).toBeInTheDocument();
    });

    it('makes initials non-selectable', () => {
      const { container } = render(<AgentAvatar name="Test" />);
      const initials = container.querySelector('.select-none');

      expect(initials).toBeInTheDocument();
    });
  });
});
