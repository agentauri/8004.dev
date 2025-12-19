import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { TabNavigation, type TabItem } from './tab-navigation';

const meta = {
  title: 'Molecules/TabNavigation',
  component: TabNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal tab navigation component for switching between content sections. Features pixel art 80s retro styling, keyboard navigation, mobile-friendly horizontal scroll, and optional count badges.',
      },
    },
  },
  args: {
    // Default onTabChange for all stories (Storybook actions will capture the calls)
    onTabChange: () => {},
  },
  argTypes: {
    tabs: {
      description: 'Array of tab items to display',
      control: 'object',
    },
    activeTab: {
      description: 'ID of the currently active tab',
      control: 'text',
    },
    onTabChange: {
      description: 'Callback when tab is changed',
      action: 'tabChanged',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'feedbacks', label: 'Feedbacks', count: 6 },
  { id: 'validations', label: 'Validations', count: 0 },
  { id: 'metadata', label: 'Metadata' },
];

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    activeTab: 'overview',
  },
};

export const WithCounts: Story = {
  args: {
    tabs: [
      { id: 'all', label: 'All', count: 142 },
      { id: 'active', label: 'Active', count: 89 },
      { id: 'inactive', label: 'Inactive', count: 53 },
    ],
    activeTab: 'all',
  },
};

export const ActiveStatistics: Story = {
  args: {
    tabs: defaultTabs,
    activeTab: 'statistics',
  },
};

export const ActiveFeedbacks: Story = {
  args: {
    tabs: defaultTabs,
    activeTab: 'feedbacks',
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'feedbacks', label: 'Feedbacks', count: 6 },
      { id: 'validations', label: 'Validations', count: 0, disabled: true },
      { id: 'metadata', label: 'Metadata' },
    ],
    activeTab: 'overview',
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { id: 'agents', label: 'Agents', count: 1234 },
      { id: 'validators', label: 'Validators', count: 56 },
    ],
    activeTab: 'agents',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'feedbacks', label: 'Feedbacks', count: 128 },
      { id: 'validations', label: 'Validations', count: 3 },
      { id: 'metadata', label: 'Metadata' },
      { id: 'history', label: 'History' },
      { id: 'settings', label: 'Settings' },
    ],
    activeTab: 'overview',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates horizontal scrolling on mobile when there are many tabs.',
      },
    },
  },
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
  args: {
    tabs: defaultTabs,
    activeTab: 'overview',
  },
  render: function InteractiveTabNavigation(args) {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <div className="space-y-6">
        <TabNavigation {...args} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]">
          <p className="text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)]">
            Active tab: <span className="text-[var(--pixel-blue-sky)]">{activeTab}</span>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * In context of an agent detail page
 */
export const InAgentDetail: Story = {
  args: {
    tabs: defaultTabs,
    activeTab: 'overview',
  },
  render: function AgentDetailContext(args) {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    const renderContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
                Agent Overview
              </h3>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                This is the overview section showing agent details, endpoints, and registration info.
              </p>
            </div>
          );
        case 'statistics':
          return (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
                Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--pixel-gray-700)] text-center">
                  <p className="text-2xl text-[var(--pixel-blue-sky)]">85</p>
                  <p className="text-xs text-[var(--pixel-gray-400)]">Avg Score</p>
                </div>
                <div className="p-4 bg-[var(--pixel-gray-700)] text-center">
                  <p className="text-2xl text-[var(--pixel-green-pipe)]">6</p>
                  <p className="text-xs text-[var(--pixel-gray-400)]">Feedbacks</p>
                </div>
                <div className="p-4 bg-[var(--pixel-gray-700)] text-center">
                  <p className="text-2xl text-[var(--pixel-gold-coin)]">0</p>
                  <p className="text-xs text-[var(--pixel-gray-400)]">Validations</p>
                </div>
              </div>
            </div>
          );
        case 'feedbacks':
          return (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
                Feedbacks (6)
              </h3>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                Recent feedback entries for this agent.
              </p>
            </div>
          );
        case 'validations':
          return (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
                Validations
              </h3>
              <p className="text-[var(--pixel-gray-400)] text-sm">
                No validations registered for this agent.
              </p>
            </div>
          );
        case 'metadata':
          return (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
                Metadata
              </h3>
              <pre className="p-4 bg-[var(--pixel-gray-700)] text-xs text-[var(--pixel-gray-300)] overflow-auto">
                {JSON.stringify({ agentUri: 'data:application/json,...', did: 'did:example:123' }, null, 2)}
              </pre>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-[var(--pixel-black)] p-6 min-h-[400px]">
        {/* Agent header mock */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--pixel-blue-sky)] rounded flex items-center justify-center text-black font-bold">
            AI
          </div>
          <div>
            <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)]">
              Smart Assistant v2
            </h2>
            <p className="text-[var(--pixel-gray-500)] text-sm">11155111:42</p>
          </div>
        </div>

        {/* Tab navigation */}
        <TabNavigation {...args} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <div className="mt-6 p-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]">
          {renderContent()}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the tab navigation in the context of an agent detail page with mock content.',
      },
    },
  },
};
