import type { Meta, StoryObj } from '@storybook/react';
import { ConnectWalletButton, DisconnectButton } from './connect-wallet-button';

const meta = {
  title: 'Molecules/ConnectWalletButton',
  component: ConnectWalletButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button for wallet connection. Shows connect prompt when disconnected, or address when connected.',
      },
    },
  },
  argTypes: {
    address: {
      control: 'text',
      description: 'Wallet address when connected',
    },
    status: {
      control: 'select',
      options: ['disconnected', 'connecting', 'reconnecting', 'connected'],
      description: 'Current connection status',
    },
    isCorrectNetwork: {
      control: 'boolean',
      description: 'Whether wallet is on Base mainnet',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
} satisfies Meta<typeof ConnectWalletButton>;

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
        story: 'Shows warning styling when wallet is on wrong network.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    address: null,
    status: 'disconnected',
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    address: null,
    status: 'disconnected',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    address: null,
    status: 'disconnected',
    size: 'lg',
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
        <span className="w-32 text-sm text-pixel-gray-400">Disconnected:</span>
        <ConnectWalletButton address={null} status="disconnected" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-pixel-gray-400">Connecting:</span>
        <ConnectWalletButton address={null} status="connecting" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-pixel-gray-400">Connected:</span>
        <ConnectWalletButton
          address="0x1234567890abcdef1234567890abcdef12345678"
          status="connected"
          isCorrectNetwork={true}
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-pixel-gray-400">Wrong Network:</span>
        <ConnectWalletButton
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
        story: 'All button states displayed together for comparison.',
      },
    },
  },
};

// DisconnectButton story
export const DisconnectButtonStory: Story = {
  args: {
    address: null,
    status: 'disconnected',
  },
  render: () => <DisconnectButton />,
  name: 'Disconnect Button',
  parameters: {
    docs: {
      description: {
        story: 'Standalone disconnect button for use in wallet dropdown.',
      },
    },
  },
};
