import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TreeNodeIndicator } from './tree-node-indicator';

const meta = {
  title: 'Atoms/TreeNodeIndicator',
  component: TreeNodeIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TreeNodeIndicator displays an expand/collapse chevron for tree structures. Shows a dot for leaf nodes without children.',
      },
    },
  },
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'Whether the node is currently expanded',
    },
    hasChildren: {
      control: 'boolean',
      description: 'Whether the node has child nodes',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
  },
} satisfies Meta<typeof TreeNodeIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    isExpanded: false,
    hasChildren: true,
  },
};

export const Expanded: Story = {
  args: {
    isExpanded: true,
    hasChildren: true,
  },
};

export const LeafNode: Story = {
  args: {
    isExpanded: false,
    hasChildren: false,
  },
};

export const MediumSize: Story = {
  args: {
    isExpanded: false,
    hasChildren: true,
    size: 'md',
  },
};

export const AllStates: Story = {
  args: {
    isExpanded: false,
    hasChildren: true,
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TreeNodeIndicator isExpanded={false} hasChildren={true} />
          <span className="text-[var(--pixel-gray-400)] text-xs">Collapsed with children</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TreeNodeIndicator isExpanded={true} hasChildren={true} />
          <span className="text-[var(--pixel-gray-400)] text-xs">Expanded with children</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TreeNodeIndicator isExpanded={false} hasChildren={false} />
          <span className="text-[var(--pixel-gray-400)] text-xs">Leaf node (no children)</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TreeNodeIndicator isExpanded={false} hasChildren={true} size="md" />
          <span className="text-[var(--pixel-gray-400)] text-xs">Medium size</span>
        </div>
      </div>
    </div>
  ),
};

export const TreeExample: Story = {
  args: {
    isExpanded: true,
    hasChildren: true,
  },
  render: () => (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <TreeNodeIndicator isExpanded={true} hasChildren={true} />
        <span className="text-[var(--pixel-gray-200)] text-sm">Natural Language Processing</span>
      </div>
      <div className="ml-4 space-y-1">
        <div className="flex items-center gap-1">
          <TreeNodeIndicator isExpanded={false} hasChildren={true} />
          <span className="text-[var(--pixel-gray-300)] text-sm">Understanding</span>
        </div>
        <div className="flex items-center gap-1">
          <TreeNodeIndicator isExpanded={false} hasChildren={false} />
          <span className="text-[var(--pixel-gray-300)] text-sm">Generation</span>
        </div>
        <div className="flex items-center gap-1">
          <TreeNodeIndicator isExpanded={false} hasChildren={false} />
          <span className="text-[var(--pixel-gray-300)] text-sm">Translation</span>
        </div>
      </div>
    </div>
  ),
};
