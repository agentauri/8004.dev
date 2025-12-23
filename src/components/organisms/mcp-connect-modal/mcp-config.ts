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

/** Cursor config (uses mcp-remote bridge for stdio-based clients) */
export const CURSOR_CONFIG = {
  mcpServers: {
    '8004-agents': {
      command: 'npx',
      args: ['mcp-remote', 'https://api.8004.dev/sse'],
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
