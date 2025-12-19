import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentBadges } from './agent-badges';

const meta = {
  title: 'Molecules/AgentBadges',
  component: AgentBadges,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a collection of badges for an agent including blockchain network, status, verification, trust score, and supported protocols.',
      },
    },
  },
  argTypes: {
    chainId: {
      control: 'select',
      options: [11155111, 84532, 80002],
      description: 'Chain ID where the agent is registered',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the agent is currently active',
    },
    isVerified: {
      control: 'boolean',
      description: 'Whether the agent is verified',
    },
    trustScore: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Trust/reputation score (0-100)',
    },
    reputationCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of reputation feedbacks',
    },
    hasSupportedTrust: {
      control: 'boolean',
      description: 'Whether the agent has supported trust models',
    },
    protocols: {
      control: 'check',
      options: ['mcp', 'a2a', 'x402'],
      description: 'Supported protocols',
    },
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      description: 'Layout direction',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AgentBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    chainId: 11155111,
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    chainId: 84532,
    isActive: false,
  },
};

export const Verified: Story = {
  args: {
    chainId: 11155111,
    isActive: true,
    isVerified: true,
  },
};

export const WithTrustScore: Story = {
  args: {
    chainId: 80002,
    isActive: true,
    trustScore: 85,
    reputationCount: 23,
  },
};

export const WithProtocols: Story = {
  args: {
    chainId: 11155111,
    isActive: true,
    protocols: ['mcp', 'a2a'],
  },
};

export const FullFeatured: Story = {
  args: {
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 92,
    reputationCount: 42,
    hasSupportedTrust: true,
    protocols: ['mcp', 'a2a', 'x402'],
  },
};

export const ColumnLayout: Story = {
  args: {
    chainId: 11155111,
    isActive: true,
    isVerified: true,
    trustScore: 78,
    protocols: ['mcp'],
    direction: 'column',
  },
};

export const InCard: Story = {
  args: {
    chainId: 84532,
    isActive: true,
    isVerified: true,
    trustScore: 95,
    protocols: ['mcp', 'a2a'],
  },
  render: (args) => (
    <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] max-w-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[var(--pixel-blue-sky)] rounded-sm flex items-center justify-center text-black font-bold">
          AI
        </div>
        <div>
          <h3 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-sm">
            Smart Assistant
          </h3>
          <p className="text-[var(--pixel-gray-500)] text-xs">agent-0x1234...5678</p>
        </div>
      </div>
      <AgentBadges {...args} />
    </div>
  ),
};
