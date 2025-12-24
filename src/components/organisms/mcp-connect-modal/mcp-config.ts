/**
 * MCP (Model Context Protocol) configuration for connecting AI assistants
 * to the 8004 Agent Explorer backend.
 */

export const MCP_ENDPOINTS = {
  sse: 'https://api.8004.dev/sse',
  mcp: 'https://api.8004.dev/mcp',
  docs: 'https://api.8004.dev/mcp/docs',
} as const;

export const CLAUDE_CODE_COMMAND =
  'claude mcp add --transport sse 8004-agents https://api.8004.dev/sse';

/**
 * Claude Desktop config (uses mcp-remote bridge due to Connector bug)
 * @see https://github.com/anthropics/claude-code/issues/5826
 */
export const CLAUDE_DESKTOP_CONFIG = {
  mcpServers: {
    '8004-agents': {
      command: 'npx',
      args: ['-y', 'mcp-remote', 'https://api.8004.dev/sse'],
    },
  },
};

export const CLAUDE_DESKTOP_CONFIG_PATHS = {
  mac: '~/Library/Application Support/Claude/claude_desktop_config.json',
  windows: '%APPDATA%\\Claude\\claude_desktop_config.json',
} as const;

/** Cursor config (uses mcp-remote bridge for stdio-based clients) */
export const CURSOR_CONFIG = {
  mcpServers: {
    '8004-agents': {
      command: 'npx',
      args: ['-y', 'mcp-remote', 'https://api.8004.dev/sse'],
    },
  },
};

export const CURSOR_CONFIG_PATHS = {
  mac: '~/.cursor/mcp.json',
  windows: '%USERPROFILE%\\.cursor\\mcp.json',
} as const;

export type MCPTab = 'claude-code' | 'claude-desktop' | 'cursor' | 'other';

export const MCP_TABS: { id: MCPTab; label: string }[] = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'claude-desktop', label: 'Claude Desktop' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'other', label: 'Other' },
];
