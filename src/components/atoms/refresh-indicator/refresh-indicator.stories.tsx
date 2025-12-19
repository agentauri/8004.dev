import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RefreshIndicator } from './refresh-indicator';

const meta = {
  title: 'Atoms/RefreshIndicator',
  component: RefreshIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays real-time refresh status with manual refresh capability. Shows last updated timestamp with retro styling.',
      },
    },
  },
  argTypes: {
    isRefreshing: {
      control: 'boolean',
      description: 'Whether the component is currently refreshing',
    },
    lastUpdated: {
      control: 'date',
      description: 'Timestamp of last update',
    },
    onManualRefresh: {
      action: 'refresh clicked',
      description: 'Callback when user clicks to refresh',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RefreshIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: new Date(Date.now() - 30000), // 30 seconds ago
    onManualRefresh: () => console.log('Refresh clicked'),
  },
};

export const Refreshing: Story = {
  args: {
    isRefreshing: true,
    lastUpdated: new Date(),
    onManualRefresh: () => console.log('Refresh clicked'),
  },
};

export const WithCallback: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: new Date(Date.now() - 120000), // 2 minutes ago
    onManualRefresh: () => {
      console.log('Manual refresh triggered');
      alert('Refreshing data...');
    },
  },
};

export const JustUpdated: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: new Date(Date.now() - 5000), // 5 seconds ago
    onManualRefresh: () => console.log('Refresh clicked'),
  },
};

export const LongAgo: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: new Date(Date.now() - 3600000), // 1 hour ago
    onManualRefresh: () => console.log('Refresh clicked'),
  },
};

export const NeverUpdated: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: undefined,
    onManualRefresh: () => console.log('Refresh clicked'),
  },
};

export const WithoutCallback: Story = {
  args: {
    isRefreshing: false,
    lastUpdated: new Date(Date.now() - 60000), // 1 minute ago
  },
};
