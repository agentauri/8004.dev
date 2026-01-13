import type { Meta, StoryObj } from '@storybook/react';
import type { X402PaymentDetails } from '@/types/x402';
import { PaymentModal } from './payment-modal';

const mockPaymentDetails: X402PaymentDetails = {
  x402Version: 1,
  accepts: [
    {
      scheme: 'exact',
      network: 'eip155:8453',
      maxAmountRequired: '50000', // 0.05 USDC
      asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
    },
  ],
};

const meta = {
  title: 'Organisms/PaymentModal',
  component: PaymentModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal for confirming x402 payments before executing paid operations like compose or evaluate.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether modal is open',
    },
    isWalletConnected: {
      control: 'boolean',
      description: 'Whether wallet is connected',
    },
    isCorrectNetwork: {
      control: 'boolean',
      description: 'Whether on Base network',
    },
    isProcessing: {
      control: 'boolean',
      description: 'Whether payment is processing',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    isErrorRetryable: {
      control: 'boolean',
      description: 'Whether the error can be retried (shows retry button)',
    },
  },
} satisfies Meta<typeof PaymentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    paymentDetails: mockPaymentDetails,
    operationName: 'Compose Team',
    usdcBalance: BigInt(1000000), // 1 USDC
    isWalletConnected: true,
    isCorrectNetwork: true,
    isProcessing: false,
    error: null,
    onConfirm: () => {},
    onSwitchNetwork: () => {},
    onConnectWallet: () => {},
  },
};

export const WalletNotConnected: Story = {
  args: {
    ...Default.args,
    isWalletConnected: false,
    usdcBalance: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'When wallet is not connected, shows connect wallet button.',
      },
    },
  },
};

export const WrongNetwork: Story = {
  args: {
    ...Default.args,
    isCorrectNetwork: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'When wallet is on wrong network, shows switch network prompt.',
      },
    },
  },
};

export const InsufficientBalance: Story = {
  args: {
    ...Default.args,
    usdcBalance: BigInt(10000), // 0.01 USDC
  },
  parameters: {
    docs: {
      description: {
        story: 'When balance is less than cost, shows insufficient balance warning.',
      },
    },
  },
};

export const Processing: Story = {
  args: {
    ...Default.args,
    isProcessing: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'While payment is being processed, shows loading state.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Payment verification failed. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'When payment fails, shows error message.',
      },
    },
  },
};

export const WithRetryableError: Story = {
  args: {
    ...Default.args,
    error: 'Network error. Request timed out.',
    isErrorRetryable: true,
    onRetry: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a retryable error occurs (network timeout, connection failed), shows retry button.',
      },
    },
  },
};

export const EvaluateOperation: Story = {
  args: {
    ...Default.args,
    operationName: 'Evaluate Agent',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal for evaluate agent operation.',
      },
    },
  },
};

export const LargerCost: Story = {
  args: {
    ...Default.args,
    paymentDetails: {
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'eip155:8453',
          maxAmountRequired: '500000', // 0.50 USDC
          asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
        },
      ],
    },
    usdcBalance: BigInt(10000000), // 10 USDC
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with a larger payment amount.',
      },
    },
  },
};
