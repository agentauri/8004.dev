import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MainLayout } from './main-layout';

const meta = {
  title: 'Templates/MainLayout',
  component: MainLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Standard page layout template with header, main content area, and optional footer.',
      },
    },
  },
  argTypes: {
    showFooter: {
      control: 'boolean',
      description: 'Whether to show the footer',
    },
    className: {
      control: 'text',
      description: 'Additional classes for main content area',
    },
  },
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
          PAGE TITLE
        </h1>
        <p className="text-[var(--pixel-gray-400)]">Page content goes here...</p>
      </div>
    ),
  },
};

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
    children: (
      <div className="p-8">
        <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
          NO FOOTER PAGE
        </h1>
        <p className="text-[var(--pixel-gray-400)]">This page has no footer.</p>
      </div>
    ),
  },
};

export const HomePage: Story = {
  args: {
    children: (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-4xl mb-4">
          AGENT EXPLORER
        </h1>
        <p className="text-[var(--pixel-gray-400)] text-lg mb-8 max-w-lg">
          Discover AI agents registered on ERC-8004
        </p>
        <div className="w-full max-w-xl">
          <input
            type="text"
            placeholder="Search agents by name, description, or address..."
            className="w-full px-4 py-3 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)]"
          />
        </div>
      </div>
    ),
  },
};

export const ExplorePage: Story = {
  args: {
    children: (
      <div className="flex">
        <aside className="w-64 p-4 border-r border-[var(--pixel-gray-700)]">
          <h3 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-heading)] text-sm mb-4">
            FILTERS
          </h3>
          <div className="space-y-2">
            <div className="h-8 bg-[var(--pixel-gray-800)]" />
            <div className="h-8 bg-[var(--pixel-gray-800)]" />
            <div className="h-8 bg-[var(--pixel-gray-800)]" />
          </div>
        </aside>
        <main className="flex-1 p-8">
          <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-6">
            EXPLORE AGENTS
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]"
              >
                <div className="h-4 bg-[var(--pixel-gray-700)] w-3/4 mb-2" />
                <div className="h-3 bg-[var(--pixel-gray-700)] w-1/2" />
              </div>
            ))}
          </div>
        </main>
      </div>
    ),
  },
};

export const AgentDetailPage: Story = {
  args: {
    children: (
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[var(--pixel-gray-700)]" />
            <div>
              <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl">
                AI ASSISTANT PRO
              </h1>
              <p className="text-[var(--pixel-gray-500)] font-mono text-sm">0x1234...5678</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <section className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
            <h2 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-heading)] text-sm mb-3">
              ENDPOINTS
            </h2>
            <div className="space-y-2">
              <div className="h-8 bg-[var(--pixel-gray-700)]" />
              <div className="h-8 bg-[var(--pixel-gray-700)]" />
            </div>
          </section>
          <section className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
            <h2 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-heading)] text-sm mb-3">
              REPUTATION
            </h2>
            <div className="h-24 bg-[var(--pixel-gray-700)]" />
          </section>
        </div>
      </div>
    ),
  },
};
