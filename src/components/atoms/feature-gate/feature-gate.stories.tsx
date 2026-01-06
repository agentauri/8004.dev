import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGate } from './feature-gate';

const meta = {
  title: 'Atoms/FeatureGate',
  component: FeatureGate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Conditionally renders children based on feature flag status. Use this to gate new features behind flags for gradual rollout.',
      },
    },
  },
} satisfies Meta<typeof FeatureGate>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Renders children when the feature flag is enabled.
 * `keyboardShortcuts` is enabled by default.
 */
export const Enabled: Story = {
  args: {
    flag: 'keyboardShortcuts',
    children: (
      <div className="p-4 bg-[var(--pixel-green-pipe)]/20 border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-white)]">
        <p className="font-[family-name:var(--font-pixel-body)]">
          This content is visible because the feature is enabled.
        </p>
      </div>
    ),
  },
};

/**
 * Renders nothing when the feature is disabled and no fallback is provided.
 * `agentComparison` is disabled by default.
 */
export const DisabledNoFallback: Story = {
  args: {
    flag: 'agentComparison',
    children: (
      <div className="p-4 bg-[var(--pixel-blue-sky)]/20 border-2 border-[var(--pixel-blue-sky)]">
        <p className="font-[family-name:var(--font-pixel-body)]">
          You should NOT see this content.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a feature is disabled and no fallback is provided, nothing is rendered. The component below should appear empty.',
      },
    },
  },
};

/**
 * Renders fallback content when the feature is disabled.
 */
export const DisabledWithFallback: Story = {
  args: {
    flag: 'agentComparison',
    children: (
      <div className="p-4 bg-[var(--pixel-blue-sky)]/20 border-2 border-[var(--pixel-blue-sky)]">
        <p className="font-[family-name:var(--font-pixel-body)]">
          You should NOT see this content.
        </p>
      </div>
    ),
    fallback: (
      <div className="p-4 bg-[var(--pixel-gold-coin)]/20 border-2 border-[var(--pixel-gold-coin)] text-[var(--pixel-white)]">
        <p className="font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider">
          Coming Soon
        </p>
        <p className="font-[family-name:var(--font-pixel-body)] text-xs text-[var(--pixel-gray-400)] mt-2">
          This feature is currently in development.
        </p>
      </div>
    ),
  },
};

/**
 * Real-world example: Gating a compare button
 */
export const RealWorldExample: Story = {
  args: {
    flag: 'keyboardShortcuts', // Using enabled flag for demo
    children: (
      <button
        type="button"
        className="px-4 py-2 bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
      >
        Press ? for shortcuts
      </button>
    ),
    fallback: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of gating a keyboard shortcuts button. The button only appears when the feature is enabled.',
      },
    },
  },
};

/**
 * Multiple features can be nested for complex feature gating.
 */
export const NestedGates: Story = {
  args: {
    flag: 'keyboardShortcuts',
    children: (
      <div className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
        <p className="font-[family-name:var(--font-pixel-body)] text-[var(--pixel-white)] mb-2">
          Level 1: Shortcuts enabled
        </p>
        <FeatureGate
          flag="advancedFilters"
          fallback={
            <p className="text-[var(--pixel-gray-400)] text-sm">Advanced filters coming soon</p>
          }
        >
          <p className="text-[var(--pixel-green-pipe)] text-sm">
            Level 2: Advanced filters also enabled!
          </p>
        </FeatureGate>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Feature gates can be nested to create complex feature dependencies. This example shows a nested feature that only appears if both parent and child features are enabled.',
      },
    },
  },
};
