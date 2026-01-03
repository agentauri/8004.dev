import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Header } from './header';

// Mock the useRealtimeEvents hook for Storybook
const _mockRealtimeEvents = {
  eventCount: 0,
  isConnected: true,
  recentEvents: [],
  clearEvents: () => {},
};

const _mockRealtimeEventsWithEvents = {
  eventCount: 5,
  isConnected: true,
  recentEvents: [
    {
      type: 'agent.created' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      data: {
        agentId: '11155111:1',
        chainId: 11155111,
        name: 'Code Review Assistant',
      },
    },
    {
      type: 'agent.updated' as const,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      data: {
        agentId: '84532:2',
        chainId: 84532,
        field: 'description',
        oldValue: 'Old',
        newValue: 'New',
      },
    },
    {
      type: 'reputation.changed' as const,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      data: {
        agentId: '80002:3',
        chainId: 80002,
        previousScore: 75,
        newScore: 82,
      },
    },
  ],
  clearEvents: () => {},
};

const meta = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main navigation header with logo, navigation links, event indicator, mobile menu, and MCP connect button. Supports real-time event notifications and responsive design.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InPageContext: Story = {
  render: function InPageContextStory() {
    return (
      <div className="min-h-screen bg-[var(--pixel-gray-dark)]">
        <Header />
        <main className="p-8">
          <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
            AGENT EXPLORER
          </h1>
          <p className="text-[var(--pixel-gray-400)]">Page content goes here...</p>
        </main>
      </div>
    );
  },
};

export const WithEvents: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Header with active events. The event badge shows the count and clicking it opens the event panel.',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Header on mobile devices shows a hamburger menu and the event badge. Navigation links are in the slide-out menu.',
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Header on tablet-sized screens.',
      },
    },
  },
};

export const AllNavigationStates: Story = {
  render: function AllNavigationStatesStory() {
    return (
      <div className="space-y-8 bg-[var(--pixel-gray-dark)] p-4">
        <div>
          <p className="text-[var(--pixel-gray-400)] text-xs mb-2 font-mono">
            Connected, No Events
          </p>
          <Header />
        </div>
        <div>
          <p className="text-[var(--pixel-gray-400)] text-xs mb-2 font-mono">
            Connected, With Events (shown in panel when clicked)
          </p>
          <Header />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows header in different event states.',
      },
    },
  },
};

export const FullPageLayout: Story = {
  render: function FullPageLayoutStory() {
    return (
      <div className="min-h-screen bg-[var(--pixel-black)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6">
              <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-lg mb-2 uppercase">
                Explore
              </h2>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                Discover and search for AI agents across multiple chains.
              </p>
            </div>
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6">
              <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-lg mb-2 uppercase">
                Evaluate
              </h2>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                Run evaluations and benchmarks on agents.
              </p>
            </div>
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6">
              <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-lg mb-2 uppercase">
                Compose
              </h2>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                Build multi-agent teams for complex tasks.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the header as part of a full page layout.',
      },
    },
  },
};
