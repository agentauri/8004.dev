import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ValidationBadge } from './validation-badge';

const meta = {
  title: 'Atoms/ValidationBadge',
  component: ValidationBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays validation status for ERC-8004 agents. Supports TEE attestation (hardware security), zkML proof (cryptographic security), stake-based validation (economic security), or no validation. Colors indicate status: green for valid, gold for pending, gray for expired/none.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['tee', 'zkml', 'stake', 'none'],
      description: 'The validation mechanism type',
    },
    status: {
      control: 'select',
      options: ['valid', 'pending', 'expired', 'none'],
      description: 'The current validation status',
    },
    attestationId: {
      control: 'text',
      description: 'Optional attestation ID for valid validations',
    },
  },
} satisfies Meta<typeof ValidationBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TEEValid: Story = {
  args: {
    type: 'tee',
    status: 'valid',
    attestationId: '0x1234567890abcdef',
  },
  parameters: {
    docs: {
      description: {
        story:
          'TEE (Trusted Execution Environment) validation with valid status and green glow effect.',
      },
    },
  },
};

export const TEEPending: Story = {
  args: {
    type: 'tee',
    status: 'pending',
  },
  parameters: {
    docs: {
      description: {
        story: 'TEE validation pending verification with gold glow effect.',
      },
    },
  },
};

export const ZKMLValid: Story = {
  args: {
    type: 'zkml',
    status: 'valid',
    attestationId: '0xabcdef1234567890',
  },
  parameters: {
    docs: {
      description: {
        story: 'zkML (zero-knowledge machine learning) proof validation with valid status.',
      },
    },
  },
};

export const StakeValid: Story = {
  args: {
    type: 'stake',
    status: 'valid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stake-based validation using economic security guarantees.',
      },
    },
  },
};

export const Expired: Story = {
  args: {
    type: 'tee',
    status: 'expired',
    attestationId: '0xexpired123',
  },
  parameters: {
    docs: {
      description: {
        story: 'Expired validation shown in gray without glow effect.',
      },
    },
  },
};

export const None: Story = {
  args: {
    type: 'none',
    status: 'none',
  },
  parameters: {
    docs: {
      description: {
        story: 'No validation configured for this agent.',
      },
    },
  },
};

export const AllTypes: Story = {
  args: {
    type: 'tee',
    status: 'valid',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ValidationBadge type="tee" status="valid" attestationId="0x123" />
      <ValidationBadge type="zkml" status="valid" attestationId="0xabc" />
      <ValidationBadge type="stake" status="valid" />
      <ValidationBadge type="none" status="none" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All validation types shown with valid status.',
      },
    },
  },
};

export const AllStatuses: Story = {
  args: {
    type: 'tee',
    status: 'valid',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-[var(--pixel-gray-400)]">Valid:</span>
        <ValidationBadge type="tee" status="valid" attestationId="0x123" />
        <ValidationBadge type="zkml" status="valid" attestationId="0xabc" />
        <ValidationBadge type="stake" status="valid" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-[var(--pixel-gray-400)]">Pending:</span>
        <ValidationBadge type="tee" status="pending" />
        <ValidationBadge type="zkml" status="pending" />
        <ValidationBadge type="stake" status="pending" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-[var(--pixel-gray-400)]">Expired:</span>
        <ValidationBadge type="tee" status="expired" attestationId="0xold" />
        <ValidationBadge type="zkml" status="expired" />
        <ValidationBadge type="stake" status="expired" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-[var(--pixel-gray-400)]">None:</span>
        <ValidationBadge type="none" status="none" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All validation statuses across different types.',
      },
    },
  },
};
