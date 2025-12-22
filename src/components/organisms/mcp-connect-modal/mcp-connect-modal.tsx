'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CodeBlock } from '@/components/molecules/code-block';
import { TabNavigation } from '@/components/molecules/tab-navigation';
import {
  CLAUDE_CODE_COMMAND,
  CONFIG_PATHS,
  MCP_ENDPOINTS,
  MCP_SERVER_CONFIG,
  MCP_TABS,
  type MCPTab,
} from './mcp-config';

export interface MCPConnectModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Modal for connecting AI assistants to the 8004 MCP server.
 * Provides instructions for Claude Code, Claude Desktop, Cursor, and other clients.
 *
 * @example
 * ```tsx
 * <MCPConnectModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 * />
 * ```
 */
export function MCPConnectModal({ isOpen, onClose }: MCPConnectModalProps) {
  const [activeTab, setActiveTab] = useState<MCPTab>('claude-code');

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  const tabs = MCP_TABS.map((tab) => ({ id: tab.id, label: tab.label }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="mcp-modal-backdrop"
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_30px_rgba(92,148,252,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mcp-modal-title"
        data-testid="mcp-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--pixel-gray-700)]">
          <h2
            id="mcp-modal-title"
            className="text-pixel-title text-lg text-[var(--pixel-blue-text)] uppercase tracking-wider"
          >
            Connect via MCP
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] hover:bg-[var(--pixel-gray-800)] transition-colors"
            aria-label="Close modal"
            data-testid="mcp-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as MCPTab)}
        />

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'claude-code' && <ClaudeCodeTab />}
          {activeTab === 'claude-desktop' && <ClaudeDesktopTab />}
          {activeTab === 'cursor' && <CursorTab />}
          {activeTab === 'other' && <OtherTab />}
        </div>
      </div>
    </div>
  );
}

function ClaudeCodeTab() {
  return (
    <div className="space-y-4" data-testid="tab-content-claude-code">
      <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)]">
        Add the 8004 Agent Explorer to Claude Code with a single command:
      </p>
      <CodeBlock code={CLAUDE_CODE_COMMAND} language="bash" label="Run in your terminal" />
      <p className="text-pixel-body text-xs text-[var(--pixel-gray-500)]">
        This will register the 8004-agents MCP server in your local Claude Code configuration.
      </p>
    </div>
  );
}

function ClaudeDesktopTab() {
  const configJson = JSON.stringify(MCP_SERVER_CONFIG, null, 2);

  return (
    <div className="space-y-4" data-testid="tab-content-claude-desktop">
      <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)]">
        Add the following to your Claude Desktop configuration file:
      </p>
      <CodeBlock code={configJson} language="json" label="Configuration" />

      <div className="space-y-2">
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">
          Config file location:
        </p>
        <div className="space-y-1">
          <CodeBlock code={CONFIG_PATHS.claudeDesktop.mac} language="text" label="macOS" showCopy />
          <CodeBlock
            code={CONFIG_PATHS.claudeDesktop.windows}
            language="text"
            label="Windows"
            showCopy
          />
          <CodeBlock
            code={CONFIG_PATHS.claudeDesktop.linux}
            language="text"
            label="Linux"
            showCopy
          />
        </div>
      </div>
    </div>
  );
}

function CursorTab() {
  const configJson = JSON.stringify(MCP_SERVER_CONFIG, null, 2);

  return (
    <div className="space-y-4" data-testid="tab-content-cursor">
      <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)]">
        Add the following to your Cursor MCP configuration file:
      </p>
      <CodeBlock code={configJson} language="json" label="Configuration" />

      <div className="space-y-2">
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">
          Config file location:
        </p>
        <div className="space-y-1">
          <CodeBlock code={CONFIG_PATHS.cursor.mac} language="text" label="macOS" showCopy />
          <CodeBlock code={CONFIG_PATHS.cursor.windows} language="text" label="Windows" showCopy />
        </div>
      </div>
    </div>
  );
}

function OtherTab() {
  return (
    <div className="space-y-4" data-testid="tab-content-other">
      <p className="text-pixel-body text-sm text-[var(--pixel-gray-300)]">
        Connect any MCP-compatible client using these endpoints:
      </p>

      <div className="bg-[var(--pixel-black)] border-2 border-[var(--pixel-gray-700)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--pixel-gray-700)]">
              <th className="text-left p-3 text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">
                Transport
              </th>
              <th className="text-left p-3 text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">
                Endpoint
              </th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr className="border-b border-[var(--pixel-gray-800)]">
              <td className="p-3 text-[var(--pixel-gold-coin)]">SSE</td>
              <td className="p-3 text-[var(--pixel-gray-200)]">{MCP_ENDPOINTS.sse}</td>
            </tr>
            <tr className="border-b border-[var(--pixel-gray-800)]">
              <td className="p-3 text-[var(--pixel-gold-coin)]">HTTP</td>
              <td className="p-3 text-[var(--pixel-gray-200)]">{MCP_ENDPOINTS.http}</td>
            </tr>
            <tr>
              <td className="p-3 text-[var(--pixel-gold-coin)]">Docs</td>
              <td className="p-3">
                <a
                  href={MCP_ENDPOINTS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--pixel-blue-text)] hover:text-glow-blue underline"
                >
                  {MCP_ENDPOINTS.docs}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-pixel-body text-xs text-[var(--pixel-gray-500)]">
        For detailed MCP protocol documentation, visit the docs endpoint above.
      </p>
    </div>
  );
}
