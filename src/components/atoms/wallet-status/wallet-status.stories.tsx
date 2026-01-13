import type { Meta, StoryObj } from '@storybook/react';
import { WalletStatus } from './wallet-status';

const meta = {
  title: 'Atoms/WalletStatus',
  component: WalletStatus,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays wallet connection status with truncated address and network indicator.',
      },
    },
  },
  argTypes: {
    address: {
      control: 'text',
      description: 'Ethereum wallet address',
    },
    status: {
      control: 'select',
      options: ['disconnected', 'connecting', 'reconnecting', 'connected'],
      description: 'Current connection status',
    },
    isCorrectNetwork: {
      control: 'boolean',
      description: 'Whether wallet is on the correct network (Base mainnet)',
    },
  },
} satisfies Meta<typeof WalletStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {
  args: {
    address: null,
    status: 'disconnected',
  },
};

export const Connecting: Story = {
  args: {
    address: null,
    status: 'connecting',
  },
};

export const Reconnecting: Story = {
  args: {
    address: null,
    status: 'reconnecting',
  },
};

export const Connected: Story = {
  args: {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'connected',
    isCorrectNetwork: true,
  },
};

export const WrongNetwork: Story = {
  args: {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    status: 'connected',
    isCorrectNetwork: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows warning when wallet is connected to wrong network (not Base mainnet).',
      },
    },
  },
};

export const AllStates: Story = {
  args: {
    address: null,
    status: 'disconnected',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-pixel-gray-400">Disconnected:</span>
        <WalletStatus address={null} status="disconnected" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-pixel-gray-400">Connecting:</span>
        <WalletStatus address={null} status="connecting" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-pixel-gray-400">Connected:</span>
        <WalletStatus
          address="0x1234567890abcdef1234567890abcdef12345678"
          status="connected"
          isCorrectNetwork={true}
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-pixel-gray-400">Wrong Network:</span>
        <WalletStatus
          address="0xabcdef1234567890abcdef1234567890abcdef12"
          status="connected"
          isCorrectNetwork={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All wallet status states displayed together for comparison.',
      },
    },
  },
};
