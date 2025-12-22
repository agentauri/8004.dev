import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MCPConnectModal } from './mcp-connect-modal';

const meta = {
  title: 'Organisms/MCPConnectModal',
  component: MCPConnectModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal for connecting AI assistants to the 8004 MCP server. Provides instructions for Claude Code, Claude Desktop, Cursor, and other MCP-compatible clients.',
      },
    },
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    onClose: () => {},
  },
} satisfies Meta<typeof MCPConnectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8 bg-[var(--pixel-black)] min-h-screen">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-pixel-body text-sm uppercase tracking-wider bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
        >
          Connect MCP
        </button>
        <MCPConnectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing how to trigger the modal with a button.',
      },
    },
  },
};

export const ClaudeCodeTab: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default view showing Claude Code CLI command.',
      },
    },
  },
};

export const ClaudeDesktopTab: Story = {
  render: function ClaudeDesktopStory() {
    return (
      <div className="bg-[var(--pixel-black)] min-h-screen">
        <MCPConnectModal isOpen={true} onClose={() => {}} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // Wait for render then click Claude Desktop tab
    const tab = canvasElement.querySelector('[data-testid="tab-claude-desktop"]');
    if (tab instanceof HTMLElement) {
      tab.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows Claude Desktop configuration with JSON config and file paths for all platforms.',
      },
    },
  },
};

export const CursorTab: Story = {
  render: function CursorStory() {
    return (
      <div className="bg-[var(--pixel-black)] min-h-screen">
        <MCPConnectModal isOpen={true} onClose={() => {}} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector('[data-testid="tab-cursor"]');
    if (tab instanceof HTMLElement) {
      tab.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows Cursor configuration with JSON config and file paths.',
      },
    },
  },
};

export const OtherClientsTab: Story = {
  render: function OtherStory() {
    return (
      <div className="bg-[var(--pixel-black)] min-h-screen">
        <MCPConnectModal isOpen={true} onClose={() => {}} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector('[data-testid="tab-other"]');
    if (tab instanceof HTMLElement) {
      tab.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows generic MCP endpoints table for any MCP-compatible client.',
      },
    },
  },
};
