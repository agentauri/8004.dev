import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { CapabilityTag } from './capability-tag';

const meta = {
  title: 'Molecules/CapabilityTag',
  component: CapabilityTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a capability badge with icon for agent protocols. Supports MCP, A2A, x402, and custom capabilities with optional interactive/selection states.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['mcp', 'a2a', 'x402', 'custom'],
      description: 'Type of capability',
    },
    label: {
      control: 'text',
      description: 'Custom label override',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the tag is clickable',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the tag is selected',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CapabilityTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MCP: Story = {
  args: {
    type: 'mcp',
  },
};

export const A2A: Story = {
  args: {
    type: 'a2a',
  },
};

export const X402: Story = {
  args: {
    type: 'x402',
  },
};

export const Custom: Story = {
  args: {
    type: 'custom',
    label: 'GraphQL',
  },
};

export const WithCustomLabel: Story = {
  args: {
    type: 'mcp',
    label: 'Model Context',
  },
};

export const Selected: Story = {
  args: {
    type: 'mcp',
    selected: true,
  },
};

export const Interactive: Story = {
  args: {
    type: 'a2a',
    interactive: true,
  },
};

export const InteractiveSelected: Story = {
  args: {
    type: 'mcp',
    interactive: true,
    selected: true,
  },
};

export const AllTypes: Story = {
  args: {
    type: 'mcp',
  },
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <CapabilityTag type="mcp" />
      <CapabilityTag type="a2a" />
      <CapabilityTag type="x402" />
      <CapabilityTag type="custom" label="REST" />
      <CapabilityTag type="custom" label="GraphQL" />
    </div>
  ),
};

export const InteractiveGroup: Story = {
  args: {
    type: 'mcp',
  },
  render: function InteractiveGroupStory() {
    const [selected, setSelected] = useState<string[]>(['mcp']);

    const toggleCapability = (cap: string) => {
      setSelected((prev) => (prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]));
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <CapabilityTag
            type="mcp"
            interactive
            selected={selected.includes('mcp')}
            onClick={() => toggleCapability('mcp')}
          />
          <CapabilityTag
            type="a2a"
            interactive
            selected={selected.includes('a2a')}
            onClick={() => toggleCapability('a2a')}
          />
          <CapabilityTag
            type="x402"
            interactive
            selected={selected.includes('x402')}
            onClick={() => toggleCapability('x402')}
          />
        </div>
        <p className="text-[var(--pixel-gray-400)] text-xs">
          Selected: {selected.join(', ') || 'None'}
        </p>
      </div>
    );
  },
};

export const InAgentContext: Story = {
  args: {
    type: 'mcp',
  },
  render: () => (
    <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] max-w-md">
      <h3 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-sm mb-3">
        CAPABILITIES
      </h3>
      <div className="flex gap-2 flex-wrap">
        <CapabilityTag type="mcp" />
        <CapabilityTag type="a2a" />
        <CapabilityTag type="custom" label="REST API" />
      </div>
    </div>
  ),
};

export const FilterContext: Story = {
  args: {
    type: 'mcp',
  },
  render: function FilterContextStory() {
    const [filters, setFilters] = useState<string[]>([]);

    const toggleFilter = (filter: string) => {
      setFilters((prev) =>
        prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
      );
    };

    return (
      <div className="p-4 bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-700)] max-w-sm">
        <h3 className="text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)] text-xs mb-2 uppercase">
          Filter by Protocol
        </h3>
        <div className="flex gap-2 flex-wrap">
          <CapabilityTag
            type="mcp"
            interactive
            selected={filters.includes('mcp')}
            onClick={() => toggleFilter('mcp')}
          />
          <CapabilityTag
            type="a2a"
            interactive
            selected={filters.includes('a2a')}
            onClick={() => toggleFilter('a2a')}
          />
          <CapabilityTag
            type="x402"
            interactive
            selected={filters.includes('x402')}
            onClick={() => toggleFilter('x402')}
          />
        </div>
      </div>
    );
  },
};
