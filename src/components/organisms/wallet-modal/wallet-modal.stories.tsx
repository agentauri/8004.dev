import type { Meta, StoryObj } from '@storybook/react';
import { WalletModal } from './wallet-modal';

const mockConnectors = [
  { id: 'injected', name: 'MetaMask' },
  { id: 'coinbaseWallet', name: 'Coinbase Wallet' },
  { id: 'walletConnect', name: 'WalletConnect' },
];

const meta = {
  title: 'Organisms/WalletModal',
  component: WalletModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal for connecting to different wallet providers and managing wallet connection.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether modal is open',
    },
    status: {
      control: 'select',
      options: ['disconnected', 'connecting', 'reconnecting', 'connected'],
      description: 'Connection status',
    },
    isCorrectNetwork: {
      control: 'boolean',
      description: 'Whether on correct network',
    },
  },
} satisfies Meta<typeof WalletModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    connectors: mockConnectors,
    address: null,
    status: 'disconnected',
    isCorrectNetwork: true,
    onConnect: () => {},
    onDisconnect: () => {},
    onSwitchNetwork: () => {},
  },
};

export const Connecting: Story = {
  args: {
    ...Disconnected.args,
    status: 'connecting',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows connecting state with disabled buttons.',
      },
    },
  },
};

export const Connected: Story = {
  args: {
    ...Disconnected.args,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'connected',
  },
};

export const WrongNetwork: Story = {
  args: {
    ...Connected.args,
    isCorrectNetwork: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'When connected to wrong network, shows switch network option.',
      },
    },
  },
};

export const NoConnectors: Story = {
  args: {
    ...Disconnected.args,
    connectors: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'When no wallet providers are detected.',
      },
    },
  },
};

export const SingleConnector: Story = {
  args: {
    ...Disconnected.args,
    connectors: [{ id: 'injected', name: 'MetaMask' }],
  },
  parameters: {
    docs: {
      description: {
        story: 'With only one connector available.',
      },
    },
  },
};
