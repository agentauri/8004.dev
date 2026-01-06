import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

// Mock the providers module
const mockSetTheme = vi.fn();
const mockToggleTheme = vi.fn();
let mockTheme = 'dark';
let mockResolvedTheme: 'dark' | 'light' = 'dark';
let mockIsLoaded = true;

vi.mock('@/providers', () => ({
  useThemeContext: () => ({
    theme: mockTheme,
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
    toggleTheme: mockToggleTheme,
    isLoaded: mockIsLoaded,
  }),
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'dark';
    mockResolvedTheme = 'dark';
    mockIsLoaded = true;
  });

  describe('rendering', () => {
    it('renders toggle button by default', () => {
      render(<ThemeToggle />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders skeleton when not loaded', () => {
      mockIsLoaded = false;
      render(<ThemeToggle />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
    });

    it('renders options when showOptions is true', () => {
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle-options')).toBeInTheDocument();
      expect(screen.getByTestId('theme-option-light')).toBeInTheDocument();
      expect(screen.getByTestId('theme-option-dark')).toBeInTheDocument();
      expect(screen.getByTestId('theme-option-system')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ThemeToggle className="custom-class" />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle')).toHaveClass('custom-class');
    });

    it('applies custom className to options mode', () => {
      render(<ThemeToggle showOptions className="custom-class" />, {
        wrapper: TestWrapper,
      });

      expect(screen.getByTestId('theme-toggle-options')).toHaveClass('custom-class');
    });
  });

  describe('simple toggle mode', () => {
    it('shows moon icon when theme is dark', () => {
      mockResolvedTheme = 'dark';
      render(<ThemeToggle />, { wrapper: TestWrapper });

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
    });

    it('shows sun icon when theme is light', () => {
      mockResolvedTheme = 'light';
      render(<ThemeToggle />, { wrapper: TestWrapper });

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    it('calls toggleTheme when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />, { wrapper: TestWrapper });

      await user.click(screen.getByTestId('theme-toggle'));

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('calls onThemeChange callback when toggled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      mockResolvedTheme = 'dark';

      render(<ThemeToggle onThemeChange={handleChange} />, {
        wrapper: TestWrapper,
      });

      await user.click(screen.getByTestId('theme-toggle'));

      expect(handleChange).toHaveBeenCalledWith('light');
    });

    it('calls onThemeChange with dark when toggling from light', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      mockResolvedTheme = 'light';

      render(<ThemeToggle onThemeChange={handleChange} />, {
        wrapper: TestWrapper,
      });

      await user.click(screen.getByTestId('theme-toggle'));

      expect(handleChange).toHaveBeenCalledWith('dark');
    });
  });

  describe('options mode', () => {
    it('marks current theme as checked', () => {
      mockTheme = 'dark';
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-option-dark')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('theme-option-light')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('theme-option-system')).toHaveAttribute('aria-checked', 'false');
    });

    it('highlights selected theme button', () => {
      mockTheme = 'light';
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      const lightButton = screen.getByTestId('theme-option-light');
      expect(lightButton).toHaveClass('bg-[var(--primary)]');
    });

    it('calls setTheme when option is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      await user.click(screen.getByTestId('theme-option-light'));

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('calls setTheme with system when system option clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      await user.click(screen.getByTestId('theme-option-system'));

      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('calls onThemeChange callback when option selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ThemeToggle showOptions onThemeChange={handleChange} />, {
        wrapper: TestWrapper,
      });

      await user.click(screen.getByTestId('theme-option-light'));

      expect(handleChange).toHaveBeenCalledWith('light');
    });

    it('has proper aria-labels for each option', () => {
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-option-light')).toHaveAttribute('aria-label', 'Light theme');
      expect(screen.getByTestId('theme-option-dark')).toHaveAttribute('aria-label', 'Dark theme');
      expect(screen.getByTestId('theme-option-system')).toHaveAttribute(
        'aria-label',
        'System theme',
      );
    });

    it('has radiogroup role on container', () => {
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle-options')).toHaveAttribute('role', 'radiogroup');
    });

    it('has radio role on each option', () => {
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-option-light')).toHaveAttribute('role', 'radio');
      expect(screen.getByTestId('theme-option-dark')).toHaveAttribute('role', 'radio');
      expect(screen.getByTestId('theme-option-system')).toHaveAttribute('role', 'radio');
    });
  });

  describe('accessibility', () => {
    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />, { wrapper: TestWrapper });

      const button = screen.getByTestId('theme-toggle');
      button.focus();

      await user.keyboard('{Enter}');

      expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('options are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      const lightOption = screen.getByTestId('theme-option-light');
      lightOption.focus();

      await user.keyboard('{Enter}');

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('has screen reader text for icon-only buttons', () => {
      render(<ThemeToggle showOptions />, { wrapper: TestWrapper });

      // Each option should have sr-only text
      expect(screen.getByText('Light')).toHaveClass('sr-only');
      expect(screen.getByText('Dark')).toHaveClass('sr-only');
      expect(screen.getByText('System')).toHaveClass('sr-only');
    });

    it('skeleton is hidden from screen readers', () => {
      mockIsLoaded = false;
      render(<ThemeToggle />, { wrapper: TestWrapper });

      expect(screen.getByTestId('theme-toggle-skeleton')).toHaveAttribute('aria-hidden', 'true');
    });

    it('announces theme changes with aria-live', () => {
      mockResolvedTheme = 'dark';
      render(<ThemeToggle />, { wrapper: TestWrapper });

      const announcement = screen.getByTestId('theme-announcement');
      expect(announcement).toHaveAttribute('role', 'status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent('Dark theme active');
    });

    it('updates announcement when theme changes', () => {
      mockResolvedTheme = 'light';
      render(<ThemeToggle />, { wrapper: TestWrapper });

      const announcement = screen.getByTestId('theme-announcement');
      expect(announcement).toHaveTextContent('Light theme active');
    });
  });
});
