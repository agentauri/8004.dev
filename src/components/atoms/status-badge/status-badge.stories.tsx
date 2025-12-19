import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StatusBadge } from './status-badge';

const meta = {
  title: 'Atoms/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a status indicator with appropriate styling and glow effects. Supports various status types including active/inactive state, protocol support (MCP, A2A), and verification status.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'inactive', 'verified', 'mcp', 'a2a', 'x402', 'trust'],
      description: 'The status type to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: 'active',
  },
};

export const Inactive: Story = {
  args: {
    status: 'inactive',
  },
};

export const Verified: Story = {
  args: {
    status: 'verified',
  },
};

export const MCP: Story = {
  args: {
    status: 'mcp',
  },
};

export const A2A: Story = {
  args: {
    status: 'a2a',
  },
};

export const X402: Story = {
  args: {
    status: 'x402',
  },
};

export const Trust: Story = {
  args: {
    status: 'trust',
  },
};

export const AllStatuses: Story = {
  args: {
    status: 'active',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="active" />
      <StatusBadge status="inactive" />
      <StatusBadge status="verified" />
      <StatusBadge status="mcp" />
      <StatusBadge status="a2a" />
      <StatusBadge status="x402" />
      <StatusBadge status="trust" />
    </div>
  ),
};

export const AgentCapabilities: Story = {
  args: {
    status: 'active',
  },
  render: () => (
    <div className="p-4 border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]">
      <p className="text-[var(--pixel-gray-400)] text-xs font-[family-name:var(--font-pixel-body)] mb-2">
        CAPABILITIES
      </p>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="active" />
        <StatusBadge status="mcp" />
        <StatusBadge status="a2a" />
        <StatusBadge status="x402" />
      </div>
    </div>
  ),
};
