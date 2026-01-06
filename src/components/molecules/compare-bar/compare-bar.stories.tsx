import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CompareBar } from './compare-bar';

const meta = {
  title: 'Molecules/CompareBar',
  component: CompareBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A floating bar that displays selected agents for comparison. Shows agent names as removable chips and provides navigation to the compare page. Appears at the bottom of the screen when agents are selected.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '200px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    maxAgents: {
      control: { type: 'number', min: 2, max: 10 },
      description: 'Maximum number of agents that can be selected',
    },
    minAgents: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Minimum number of agents required for comparison',
    },
  },
} satisfies Meta<typeof CompareBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with 2 agents selected (minimum for comparison)
 */
export const Default: Story = {
  args: {
    agents: [
      { id: '11155111:123', name: 'Trading Bot Alpha' },
      { id: '84532:456', name: 'Code Review Agent' },
    ],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=11155111:123,84532:456',
  },
};

/**
 * Single agent selected - compare button is disabled
 */
export const SingleAgent: Story = {
  args: {
    agents: [{ id: '11155111:123', name: 'Trading Bot Alpha' }],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare',
  },
};

/**
 * Three agents selected
 */
export const ThreeAgents: Story = {
  args: {
    agents: [
      { id: '11155111:123', name: 'Trading Bot' },
      { id: '84532:456', name: 'Code Agent' },
      { id: '80002:789', name: 'Data Analyzer' },
    ],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=11155111:123,84532:456,80002:789',
  },
};

/**
 * Maximum agents selected (4) - shows MAX indicator
 */
export const MaxAgents: Story = {
  args: {
    agents: [
      { id: '1:1', name: 'Agent Alpha' },
      { id: '2:2', name: 'Agent Beta' },
      { id: '3:3', name: 'Agent Gamma' },
      { id: '4:4', name: 'Agent Delta' },
    ],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=1:1,2:2,3:3,4:4',
  },
};

/**
 * With long agent names that get truncated
 */
export const LongNames: Story = {
  args: {
    agents: [
      { id: '1:1', name: 'Super Advanced Trading Bot with Machine Learning' },
      { id: '2:2', name: 'Comprehensive Code Review and Analysis Agent' },
    ],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=1:1,2:2',
  },
};

/**
 * Custom max agents (6 instead of default 4)
 */
export const CustomMaxAgents: Story = {
  args: {
    agents: [
      { id: '1:1', name: 'Agent 1' },
      { id: '2:2', name: 'Agent 2' },
      { id: '3:3', name: 'Agent 3' },
    ],
    maxAgents: 6,
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=1:1,2:2,3:3',
  },
};

/**
 * Custom min agents (3 instead of default 2)
 */
export const CustomMinAgents: Story = {
  args: {
    agents: [
      { id: '1:1', name: 'Agent 1' },
      { id: '2:2', name: 'Agent 2' },
    ],
    minAgents: 3,
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare?agents=1:1,2:2',
  },
};

/**
 * Empty state - bar is not rendered
 */
export const Empty: Story = {
  args: {
    agents: [],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare',
  },
  parameters: {
    docs: {
      description: {
        story: 'When no agents are selected, the CompareBar is not rendered.',
      },
    },
  },
};

/**
 * Interactive demo with add/remove functionality
 */
export const Interactive: Story = {
  args: {
    agents: [],
    onRemove: () => {},
    onClearAll: () => {},
    compareUrl: '/compare',
  },
  render: () => {
    const [agents, setAgents] = useState([
      { id: '11155111:123', name: 'Trading Bot Alpha' },
      { id: '84532:456', name: 'Code Review Agent' },
    ]);

    const availableAgents = [
      { id: '11155111:123', name: 'Trading Bot Alpha' },
      { id: '84532:456', name: 'Code Review Agent' },
      { id: '80002:789', name: 'Data Analyzer' },
      { id: '11155111:999', name: 'Security Scanner' },
      { id: '84532:111', name: 'Market Monitor' },
    ];

    const handleRemove = (id: string) => {
      setAgents(agents.filter((a) => a.id !== id));
    };

    const handleClearAll = () => {
      setAgents([]);
    };

    const handleAdd = (agent: { id: string; name: string }) => {
      if (agents.length < 4 && !agents.some((a) => a.id === agent.id)) {
        setAgents([...agents, agent]);
      }
    };

    const compareUrl =
      agents.length > 0 ? `/compare?agents=${agents.map((a) => a.id).join(',')}` : '/compare';

    return (
      <div className="min-h-[300px] p-4">
        <div className="mb-4">
          <h3 className="text-sm font-silkscreen text-[var(--pixel-white)] mb-2">
            Available Agents (click to add)
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableAgents.map((agent) => {
              const isSelected = agents.some((a) => a.id === agent.id);
              return (
                <button
                  type="button"
                  key={agent.id}
                  onClick={() => handleAdd(agent)}
                  disabled={isSelected || agents.length >= 4}
                  className={`px-3 py-1.5 text-sm border-2 transition-colors ${
                    isSelected
                      ? 'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-text)]'
                      : agents.length >= 4
                        ? 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-500)] cursor-not-allowed'
                        : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-white)]'
                  }`}
                >
                  {agent.name}
                </button>
              );
            })}
          </div>
        </div>

        <CompareBar
          agents={agents}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
          compareUrl={compareUrl}
        />
      </div>
    );
  },
};
