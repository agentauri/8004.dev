import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './error-boundary';

const meta = {
  title: 'Atoms/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Error boundary component that catches JavaScript errors in child components and displays a fallback UI. Prevents the entire app from crashing when errors occur.',
      },
    },
  },
  args: {
    children: (
      <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
        <p className="text-[var(--pixel-white)] font-[family-name:var(--font-pixel-body)]">
          This is a normal component that will be wrapped in an error boundary.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simulated error fallback for stories (doesn't actually throw)
function SimulatedErrorFallback({ componentName }: { componentName?: string }) {
  return (
    <div
      className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-destructive)] text-center"
      data-testid="error-boundary-fallback"
    >
      <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm mb-2">
        {componentName ? `Error in ${componentName}` : 'Something went wrong'}
      </p>
      <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs">
        Test error message
      </p>
      <button
        type="button"
        className="mt-4 px-4 py-2 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export const Default: Story = {};

export const WithError: Story = {
  render: () => <SimulatedErrorFallback />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the default fallback UI when an error occurs.',
      },
    },
  },
};

export const WithComponentName: Story = {
  render: () => <SimulatedErrorFallback componentName="SearchResults" />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback UI with a component name for better debugging.',
      },
    },
  },
};

export const WithCustomFallback: Story = {
  args: {
    fallback: (
      <div className="p-8 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gold-coin)] text-center">
        <p className="text-[var(--pixel-gold-coin)] font-[family-name:var(--font-pixel-title)] text-lg mb-2">
          OOPS!
        </p>
        <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
          Custom error message with different styling
        </p>
      </div>
    ),
    children: <div>Normal content (this fallback is shown for demonstration)</div>,
  },
  render: (args) => <>{args.fallback}</>,
  parameters: {
    docs: {
      description: {
        story: 'Custom fallback UI can be provided to match the design of the wrapped component.',
      },
    },
  },
};
