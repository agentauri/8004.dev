import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { ExportDialog } from './export-dialog';

const meta = {
  title: 'Organisms/ExportDialog',
  component: ExportDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog component for exporting data in CSV or JSON format. Provides format selection and download options.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    filename: {
      control: 'text',
      description: 'Default filename (without extension)',
    },
    presetType: {
      control: 'select',
      options: ['bookmarks', 'agents', 'agentDetails'],
      description: 'Export preset type for column configuration',
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
  },
} satisfies Meta<typeof ExportDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAgents = [
  {
    id: '11155111:101',
    name: 'Data Analyzer',
    description: 'Analyzes large datasets and provides insights',
    chainId: 11155111,
    isActive: true,
    trustScore: 92,
    capabilities: ['mcp'],
  },
  {
    id: '84532:202',
    name: 'Code Assistant',
    description: 'Helps with code review and suggestions',
    chainId: 84532,
    isActive: true,
    isVerified: true,
    trustScore: 88,
    capabilities: ['mcp', 'a2a'],
  },
  {
    id: '80002:303',
    name: 'Content Creator',
    description: 'Creates marketing content and copy',
    chainId: 80002,
    isActive: false,
    trustScore: 45,
    capabilities: ['a2a'],
  },
];

const sampleBookmarks = [
  {
    agentId: '11155111:101',
    name: 'Data Analyzer',
    chainId: 11155111,
    description: 'Analyzes large datasets',
    bookmarkedAt: Date.now() - 86400000,
  },
  {
    agentId: '84532:202',
    name: 'Code Assistant',
    chainId: 84532,
    bookmarkedAt: Date.now(),
  },
];

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    data: sampleAgents,
    filename: 'agents-export',
    presetType: 'agents',
  },
};

export const ExportBookmarks: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    data: sampleBookmarks,
    filename: 'bookmarks-export',
    presetType: 'bookmarks',
    title: 'Export Bookmarks',
  },
};

export const EmptyData: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    data: [],
    filename: 'empty-export',
    title: 'Export Data',
  },
};

export const SingleItem: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    data: [sampleAgents[0]],
    filename: 'single-agent',
    presetType: 'agentDetails',
    title: 'Export Agent Details',
  },
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    data: sampleAgents,
    filename: 'agents-export',
    presetType: 'agents',
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border-2 border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-text)] hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)] transition-colors"
        >
          Open Export Dialog
        </button>
        <ExportDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};
