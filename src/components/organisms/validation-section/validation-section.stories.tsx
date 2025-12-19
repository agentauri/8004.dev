import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { AgentValidation } from '@/types/agent';
import { ValidationSection } from './validation-section';

const meta = {
  title: 'Organisms/ValidationSection',
  component: ValidationSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays detailed validation information for an agent, including validation type, status, attestation details, and timeline. Used in agent detail pages to show on-chain validation proofs.',
      },
    },
  },
  argTypes: {
    validations: {
      control: 'object',
      description: 'Array of validation entries for the agent',
    },
    agentId: {
      control: 'text',
      description: 'Agent ID for explorer links',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ValidationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample validation data
const teeValidation: AgentValidation = {
  type: 'tee',
  status: 'valid',
  attestationId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  validatorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
  timestamp: '2024-01-15T10:30:00Z',
  expiresAt: '2025-01-15T10:30:00Z',
};

const zkmlValidation: AgentValidation = {
  type: 'zkml',
  status: 'valid',
  attestationId: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
  timestamp: '2024-02-20T14:00:00Z',
};

const stakeValidation: AgentValidation = {
  type: 'stake',
  status: 'pending',
  validatorAddress: '0x9876543210fedcba9876543210fedcba98765432',
  timestamp: '2024-03-01T09:00:00Z',
};

const expiredValidation: AgentValidation = {
  type: 'tee',
  status: 'expired',
  attestationId: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
  timestamp: '2023-01-01T00:00:00Z',
  expiresAt: '2024-01-01T00:00:00Z',
};

export const Default: Story = {
  args: {
    validations: [teeValidation, zkmlValidation],
    agentId: '11155111:42',
  },
};

export const SingleValidation: Story = {
  args: {
    validations: [teeValidation],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent with a single TEE validation.',
      },
    },
  },
};

export const MultipleValidations: Story = {
  args: {
    validations: [teeValidation, zkmlValidation, stakeValidation],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent with multiple types of validations.',
      },
    },
  },
};

export const WithExpiredValidation: Story = {
  args: {
    validations: [teeValidation, expiredValidation],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mix of valid and expired validations.',
      },
    },
  },
};

export const PendingValidation: Story = {
  args: {
    validations: [stakeValidation],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Agent with a pending stake validation.',
      },
    },
  },
};

export const AllStatuses: Story = {
  args: {
    validations: [
      { ...teeValidation, status: 'valid' },
      { ...zkmlValidation, status: 'pending' },
      { ...stakeValidation, status: 'expired' },
    ],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'All validation status types displayed.',
      },
    },
  },
};

export const NoValidations: Story = {
  args: {
    validations: [],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when agent has no validations.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    validations: [],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading skeleton state.',
      },
    },
  },
};

export const MinimalData: Story = {
  args: {
    validations: [
      {
        type: 'tee',
        status: 'valid',
      },
    ],
    agentId: '11155111:42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Validation with minimal data (no attestation ID or timestamps).',
      },
    },
  },
};

export const InDetailPage: Story = {
  args: {
    validations: [teeValidation, zkmlValidation],
    agentId: '11155111:42',
  },
  render: (args) => (
    <div className="p-6 bg-[#0A0A0A] max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl text-white font-[family-name:var(--font-pixel-heading)]">
          Trading Bot Alpha
        </h1>
        <p className="text-gray-400 text-sm mt-1">Agent #42 on Sepolia</p>
      </div>
      <ValidationSection {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ValidationSection as it appears in an agent detail page.',
      },
    },
  },
};
