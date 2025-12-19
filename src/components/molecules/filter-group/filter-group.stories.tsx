import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { FilterGroup, type FilterOption } from './filter-group';

const meta = {
  title: 'Molecules/FilterGroup',
  component: FilterGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A group of toggle-able filter options. Supports single and multi-select modes with optional counts.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label/title',
    },
    multiSelect: {
      control: 'boolean',
      description: 'Allow multiple selections',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof FilterGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusOptions: FilterOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const statusOptionsWithCounts: FilterOption[] = [
  { value: 'active', label: 'Active', count: 42 },
  { value: 'inactive', label: 'Inactive', count: 8 },
  { value: 'pending', label: 'Pending', count: 3 },
];

const protocolOptions: FilterOption[] = [
  { value: 'mcp', label: 'MCP', count: 156 },
  { value: 'a2a', label: 'A2A', count: 89 },
  { value: 'x402', label: 'x402', count: 34 },
];

export const Default: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    selected: [],
    onChange: () => {},
  },
};

export const WithSelection: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    selected: ['active'],
    onChange: () => {},
  },
};

export const WithCounts: Story = {
  args: {
    label: 'Status',
    options: statusOptionsWithCounts,
    selected: ['active'],
    onChange: () => {},
  },
};

export const MultipleSelected: Story = {
  args: {
    label: 'Status',
    options: statusOptionsWithCounts,
    selected: ['active', 'pending'],
    onChange: () => {},
  },
};

export const SingleSelect: Story = {
  args: {
    label: 'Sort By',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'reputation', label: 'Reputation' },
      { value: 'newest', label: 'Newest' },
    ],
    selected: ['relevance'],
    multiSelect: false,
    onChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    label: 'Status',
    options: statusOptionsWithCounts,
    selected: [],
    onChange: () => {},
  },
  render: function InteractiveStory() {
    const [selected, setSelected] = useState<string[]>(['active']);
    return (
      <div className="space-y-4">
        <FilterGroup
          label="Status"
          options={statusOptionsWithCounts}
          selected={selected}
          onChange={setSelected}
        />
        <p className="text-[var(--pixel-gray-400)] text-xs">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const InteractiveSingleSelect: Story = {
  args: {
    label: 'Sort By',
    options: [],
    selected: [],
    onChange: () => {},
  },
  render: function InteractiveSingleSelectStory() {
    const [selected, setSelected] = useState<string[]>(['relevance']);
    const sortOptions: FilterOption[] = [
      { value: 'relevance', label: 'Relevance' },
      { value: 'reputation', label: 'Reputation' },
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
    ];
    return (
      <div className="space-y-4">
        <FilterGroup
          label="Sort By"
          options={sortOptions}
          selected={selected}
          onChange={setSelected}
          multiSelect={false}
        />
        <p className="text-[var(--pixel-gray-400)] text-xs">
          Selected: {selected.length > 0 ? selected[0] : 'None'}
        </p>
      </div>
    );
  },
};

export const ProtocolFilters: Story = {
  args: {
    label: 'Protocols',
    options: protocolOptions,
    selected: [],
    onChange: () => {},
  },
  render: function ProtocolFiltersStory() {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <FilterGroup
        label="Protocols"
        options={protocolOptions}
        selected={selected}
        onChange={setSelected}
      />
    );
  },
};

export const InFilterPanel: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    selected: [],
    onChange: () => {},
  },
  render: function InFilterPanelStory() {
    const [statusSelected, setStatusSelected] = useState<string[]>(['active']);
    const [protocolSelected, setProtocolSelected] = useState<string[]>(['mcp']);
    const [chainSelected, setChainSelected] = useState<string[]>([]);

    const chainOptions: FilterOption[] = [
      { value: 'sepolia', label: 'Sepolia', count: 120 },
      { value: 'base', label: 'Base', count: 85 },
      { value: 'polygon', label: 'Polygon', count: 48 },
    ];

    return (
      <div className="p-4 bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-700)] max-w-xs space-y-6">
        <h3 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-sm border-b border-[var(--pixel-gray-700)] pb-2">
          FILTERS
        </h3>
        <FilterGroup
          label="Status"
          options={statusOptionsWithCounts}
          selected={statusSelected}
          onChange={setStatusSelected}
        />
        <FilterGroup
          label="Protocol"
          options={protocolOptions}
          selected={protocolSelected}
          onChange={setProtocolSelected}
        />
        <FilterGroup
          label="Chain"
          options={chainOptions}
          selected={chainSelected}
          onChange={setChainSelected}
        />
      </div>
    );
  },
};

export const EmptyCounts: Story = {
  args: {
    label: 'Status',
    options: [
      { value: 'active', label: 'Active', count: 0 },
      { value: 'inactive', label: 'Inactive', count: 0 },
    ],
    selected: [],
    onChange: () => {},
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Categories',
    options: [
      { value: 'ai', label: 'AI', count: 45 },
      { value: 'defi', label: 'DeFi', count: 32 },
      { value: 'nft', label: 'NFT', count: 28 },
      { value: 'gaming', label: 'Gaming', count: 19 },
      { value: 'social', label: 'Social', count: 15 },
      { value: 'dao', label: 'DAO', count: 12 },
      { value: 'infra', label: 'Infra', count: 8 },
    ],
    selected: ['ai', 'defi'],
    onChange: () => {},
  },
};
