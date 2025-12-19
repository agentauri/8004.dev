import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { AgentReputation, AgentValidation } from '@/types/agent';
import { AgentStatistics } from './agent-statistics';

const meta = {
  title: 'Organisms/AgentStatistics',
  component: AgentStatistics,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays detailed statistics for an agent including score metrics, validations count, and supported trust models. Used in the Statistics tab of the agent detail page.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--pixel-black)] p-6 min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentStatistics>;

export default meta;
type Story = StoryObj<typeof meta>;

const goodReputation: AgentReputation = {
  count: 156,
  averageScore: 87,
  distribution: {
    low: 8,
    medium: 24,
    high: 124,
  },
};

const poorReputation: AgentReputation = {
  count: 45,
  averageScore: 32,
  distribution: {
    low: 28,
    medium: 12,
    high: 5,
  },
};

const validations: AgentValidation[] = [
  {
    type: 'tee',
    status: 'valid',
    validatorAddress: '0x1234567890abcdef1234567890abcdef12345678',
    attestationId: '0xabc123def456',
    timestamp: '2024-01-15T10:00:00Z',
    expiresAt: '2025-01-15T10:00:00Z',
  },
  {
    type: 'stake',
    status: 'valid',
    validatorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: '2024-02-01T08:00:00Z',
  },
];

export const Default: Story = {
  args: {
    reputation: goodReputation,
    validations: validations,
    supportedTrust: ['reputation', 'stake'],
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

export const HighPerformingAgent: Story = {
  args: {
    reputation: {
      count: 523,
      averageScore: 94,
      distribution: { low: 5, medium: 35, high: 483 },
    },
    validations: [
      { type: 'tee', status: 'valid', attestationId: '0x123' },
      { type: 'zkml', status: 'valid', attestationId: '0x456' },
      { type: 'stake', status: 'valid', attestationId: '0x789' },
    ],
    supportedTrust: ['reputation', 'tee', 'zkml', 'stake'],
    registeredAt: '2023-06-01T00:00:00Z',
  },
};

export const LowPerformingAgent: Story = {
  args: {
    reputation: poorReputation,
    validations: [{ type: 'stake', status: 'expired' }],
    supportedTrust: ['reputation'],
    registeredAt: '2024-03-01T00:00:00Z',
  },
};

export const NewAgent: Story = {
  args: {
    reputation: {
      count: 0,
      averageScore: 0,
      distribution: { low: 0, medium: 0, high: 0 },
    },
    validations: [],
    supportedTrust: ['reputation'],
    registeredAt: '2024-06-15T12:00:00Z',
  },
  parameters: {
    docs: {
      description: {
        story: 'A newly registered agent with no reputation data yet.',
      },
    },
  },
};

export const NoTrustModels: Story = {
  args: {
    reputation: goodReputation,
    validations: [],
    supportedTrust: [],
    registeredAt: '2024-01-01T00:00:00Z',
  },
  parameters: {
    docs: {
      description: {
        story: 'An agent without any configured trust models.',
      },
    },
  },
};

export const WithPendingValidations: Story = {
  args: {
    reputation: goodReputation,
    validations: [
      { type: 'tee', status: 'valid', attestationId: '0x123' },
      { type: 'zkml', status: 'pending' },
      { type: 'stake', status: 'pending' },
    ],
    supportedTrust: ['reputation', 'tee', 'zkml', 'stake'],
    registeredAt: '2024-02-15T00:00:00Z',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    supportedTrust: ['reputation'],
  },
};

export const MinimalData: Story = {
  args: {
    reputation: {
      count: 3,
      averageScore: 65,
      distribution: { low: 1, medium: 1, high: 1 },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent with minimal data - no validations, trust models, or registration date.',
      },
    },
  },
};
