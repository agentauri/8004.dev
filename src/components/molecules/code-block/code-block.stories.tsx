import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './code-block';

const meta = {
  title: 'Molecules/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable code block component with copy functionality. Displays code snippets with monospace font and retro styling.',
      },
    },
  },
  args: {
    code: 'npm install @8004/sdk',
    language: 'bash',
    showCopy: true,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    code: 'claude mcp add --transport http --scope local 8004-agents https://api.8004.dev/sse',
    label: 'Run this command',
    language: 'bash',
  },
};

export const JsonConfig: Story = {
  args: {
    code: JSON.stringify(
      {
        mcpServers: {
          '8004-agents': {
            command: 'npx',
            args: ['mcp-remote', 'https://api.8004.dev/sse'],
          },
        },
      },
      null,
      2,
    ),
    label: 'Configuration',
    language: 'json',
  },
};

export const LongCommand: Story = {
  args: {
    code: 'curl -X POST https://api.8004.dev/api/v1/search -H "Content-Type: application/json" -d \'{"query": "AI assistant for code review", "limit": 10}\'',
    label: 'API Request',
    language: 'bash',
  },
};

export const WithoutCopyButton: Story = {
  args: {
    code: 'Output: Success',
    label: 'Result',
    language: 'text',
    showCopy: false,
  },
};

export const MultilineCode: Story = {
  args: {
    code: `# Step 1: Install dependencies
npm install @8004/sdk

# Step 2: Configure your agent
npx 8004 init

# Step 3: Start the server
npm run start`,
    label: 'Setup Instructions',
    language: 'bash',
  },
};

export const PlainText: Story = {
  args: {
    code: '~/Library/Application Support/Claude/claude_desktop_config.json',
    label: 'File Path (macOS)',
    language: 'text',
  },
};
