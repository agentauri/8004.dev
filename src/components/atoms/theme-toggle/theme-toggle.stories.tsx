import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/providers';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A theme toggle component that allows users to switch between light, dark, and system themes. Supports both simple toggle mode and multi-option selection.',
      },
    },
  },
  decorators: [
    (Story: () => ReactNode) => (
      <ThemeProvider>
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    showOptions: {
      control: 'boolean',
      description: 'Show all theme options instead of simple toggle',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onThemeChange: {
      action: 'themeChanged',
      description: 'Callback when theme changes',
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toggle button that cycles between light and dark themes
 */
export const Default: Story = {
  args: {},
};

/**
 * Loading/skeleton state shown during initial hydration
 * Note: This requires mocking the context, shown for documentation purposes
 */
export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'During initial page load, the component shows a skeleton to prevent hydration mismatch. This state is brief and automatically resolves when the theme loads from localStorage.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Skeleton placeholder shown during hydration (simulated):
      </p>
      <div
        className="h-9 w-9 rounded border-2 border-[var(--border)] bg-[var(--card)]"
        aria-hidden="true"
      />
      <p className="text-sm text-[var(--muted-foreground)]">
        The actual component automatically shows this while `isLoaded` is false.
      </p>
    </div>
  ),
};

/**
 * Shows all three theme options: Light, Dark, and System
 */
export const WithOptions: Story = {
  args: {
    showOptions: true,
  },
};

/**
 * Toggle button with custom styling
 */
export const CustomClass: Story = {
  args: {
    className: 'border-[var(--pixel-gold-coin)]',
  },
};

/**
 * Options mode with callback handler
 */
export const WithCallback: Story = {
  args: {
    showOptions: true,
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
  parameters: {
    docs: {
      description: {
        story: 'Open the Actions panel to see theme change events.',
      },
    },
  },
};

/**
 * Multiple toggles demonstrating synchronization
 */
export const MultipleSynced: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        All toggles stay synchronized through the ThemeProvider context
      </p>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ThemeToggle showOptions />
        <ThemeToggle />
      </div>
    </div>
  ),
};

/**
 * Demonstrates the toggle in a header-like context
 */
export const InHeader: Story = {
  render: () => (
    <header className="flex items-center justify-between border-b-2 border-[var(--border)] bg-[var(--card)] p-4">
      <div className="font-[family-name:var(--font-pixel-body)] text-lg uppercase tracking-wider">
        Agent Explorer
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex gap-4 text-sm">
          <span className="text-[var(--muted-foreground)]">Explore</span>
          <span className="text-[var(--muted-foreground)]">Leaderboard</span>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of the theme toggle integrated into a header navigation.',
      },
    },
  },
};

/**
 * Side-by-side comparison of toggle modes
 */
export const Comparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Simple Toggle</p>
        <ThemeToggle />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Options Mode</p>
        <ThemeToggle showOptions />
      </div>
    </div>
  ),
};
