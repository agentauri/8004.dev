'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Theme, useThemeContext } from '@/providers';

export interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Show theme options dropdown instead of simple toggle */
  showOptions?: boolean;
  /** Callback when theme changes */
  onThemeChange?: (theme: Theme) => void;
}

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/**
 * ThemeToggle - Allows users to switch between light, dark, and system themes
 *
 * @example
 * ```tsx
 * // Simple toggle (cycles through themes)
 * <ThemeToggle />
 *
 * // With options dropdown
 * <ThemeToggle showOptions />
 * ```
 */
export function ThemeToggle({ className, showOptions = false, onThemeChange }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isLoaded } = useThemeContext();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handleToggle = () => {
    toggleTheme();
    // Call onThemeChange with the new theme (opposite of resolved)
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    onThemeChange?.(newTheme);
  };

  // Render icon based on current theme
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  // Don't render until theme is loaded to avoid hydration mismatch
  if (!isLoaded) {
    return (
      <div
        className={cn(
          'h-9 w-9 rounded border-2 border-[var(--border)] bg-[var(--card)]',
          className,
        )}
        data-testid="theme-toggle-skeleton"
        aria-hidden="true"
      />
    );
  }

  if (showOptions) {
    return (
      <div
        className={cn('flex items-center gap-1', className)}
        data-testid="theme-toggle-options"
        role="radiogroup"
        aria-label="Theme selection"
      >
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={theme === value}
            aria-label={`${label} theme`}
            onClick={() => handleThemeChange(value)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded border-2 transition-all',
              'hover:border-[var(--primary)] hover:shadow-[0_0_8px_var(--glow-blue)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
              theme === value
                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]',
            )}
            data-testid={`theme-option-${value}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded border-2 transition-all',
          'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]',
          'hover:border-[var(--primary)] hover:shadow-[0_0_8px_var(--glow-blue)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
          className,
        )}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        data-testid="theme-toggle"
      >
        <CurrentIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {/* Announce theme changes to screen readers */}
      <span className="sr-only" role="status" aria-live="polite" data-testid="theme-announcement">
        {resolvedTheme === 'dark' ? 'Dark' : 'Light'} theme active
      </span>
    </>
  );
}
