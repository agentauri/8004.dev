import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentRegistration } from './agent-registration';

const meta = {
  title: 'Organisms/AgentRegistration',
  component: AgentRegistration,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AgentRegistration displays on-chain registration information including owner, contract address, token ID, and registration date.',
      },
    },
  },
} satisfies Meta<typeof AgentRegistration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    registration: {
      chainId: 11155111,
      tokenId: '123',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmXYZ123456789',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-15T10:30:00Z',
    },
  },
};

export const SepoliaAgent: Story = {
  args: {
    registration: {
      chainId: 11155111,
      tokenId: '456',
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      metadataUri: 'https://arweave.net/abc123',
      owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      registeredAt: '2024-03-20T14:45:00Z',
    },
  },
};

export const BaseSepoliaAgent: Story = {
  args: {
    registration: {
      chainId: 84532,
      tokenId: '789',
      contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      metadataUri: 'ipfs://QmABC789xyz',
      owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      registeredAt: '2024-02-28T08:15:00Z',
    },
  },
};

export const PolygonAmoyAgent: Story = {
  args: {
    registration: {
      chainId: 80002,
      tokenId: '1001',
      contractAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      metadataUri: 'ar://xyz789abc',
      owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      registeredAt: '2024-04-01T16:20:00Z',
    },
  },
};

export const RecentRegistration: Story = {
  args: {
    registration: {
      chainId: 11155111,
      tokenId: '999',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmNewAgent',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: new Date().toISOString(),
    },
  },
};
