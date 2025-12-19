import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EndpointItem } from './endpoint-item';

const meta = {
  title: 'Molecules/EndpointItem',
  component: EndpointItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays an endpoint URL with type indicator, icon, and optional copy button. Supports HTTP, WebSocket, and Webhook endpoint types.',
      },
    },
  },
  argTypes: {
    url: {
      control: 'text',
      description: 'The endpoint URL',
    },
    type: {
      control: 'select',
      options: ['http', 'websocket', 'webhook'],
      description: 'Type of endpoint',
    },
    label: {
      control: 'text',
      description: 'Optional label override',
    },
    showCopy: {
      control: 'boolean',
      description: 'Whether to show the copy button',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate long URLs',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof EndpointItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTTP: Story = {
  args: {
    url: 'https://api.agent-registry.io/v1/agents/0x1234',
    type: 'http',
  },
};

export const WebSocket: Story = {
  args: {
    url: 'wss://ws.agent-registry.io/stream',
    type: 'websocket',
  },
};

export const Webhook: Story = {
  args: {
    url: 'https://hooks.agent-registry.io/notify',
    type: 'webhook',
  },
};

export const WithCustomLabel: Story = {
  args: {
    url: 'https://api.example.com/graphql',
    type: 'http',
    label: 'GraphQL',
  },
};

export const WithoutCopy: Story = {
  args: {
    url: 'https://api.example.com/endpoint',
    type: 'http',
    showCopy: false,
  },
};

export const LongURL: Story = {
  args: {
    url: 'https://api.very-long-domain-name.agent-registry.io/v1/agents/0x1234567890abcdef1234567890abcdef12345678/endpoints/primary',
    type: 'http',
  },
};

export const NoTruncate: Story = {
  args: {
    url: 'https://api.very-long-domain-name.agent-registry.io/v1/agents/0x1234567890abcdef',
    type: 'http',
    truncate: false,
  },
};

export const AllTypes: Story = {
  args: {
    url: 'https://api.example.com',
    type: 'http',
  },
  render: () => (
    <div className="space-y-2 max-w-md">
      <EndpointItem url="https://api.example.com/v1/agent" type="http" />
      <EndpointItem url="wss://ws.example.com/stream" type="websocket" />
      <EndpointItem url="https://hooks.example.com/notify" type="webhook" />
    </div>
  ),
};

export const InAgentCard: Story = {
  args: {
    url: 'https://api.example.com',
    type: 'http',
  },
  render: () => (
    <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] max-w-md">
      <h3 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-body)] text-sm mb-3">
        ENDPOINTS
      </h3>
      <div className="space-y-2">
        <EndpointItem url="https://api.agent.io/v1" type="http" />
        <EndpointItem url="wss://ws.agent.io/events" type="websocket" />
      </div>
    </div>
  ),
};
