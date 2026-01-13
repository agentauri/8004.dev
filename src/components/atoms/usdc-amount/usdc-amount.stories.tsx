import type { Meta, StoryObj } from '@storybook/react';
import { UsdcAmount } from './usdc-amount';

const meta = {
  title: 'Atoms/UsdcAmount',
  component: UsdcAmount,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays USDC amounts with consistent formatting and optional symbols.',
      },
    },
  },
  argTypes: {
    amount: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Amount in USD',
    },
    showSymbol: {
      control: 'boolean',
      description: 'Show $ prefix',
    },
    showToken: {
      control: 'boolean',
      description: 'Show USDC suffix',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size variant',
    },
  },
} satisfies Meta<typeof UsdcAmount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 0.05,
  },
};

export const WithSymbol: Story = {
  args: {
    amount: 0.05,
    showSymbol: true,
  },
};

export const WithToken: Story = {
  args: {
    amount: 0.05,
    showToken: true,
  },
};

export const FullDisplay: Story = {
  args: {
    amount: 0.05,
    showSymbol: true,
    showToken: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows both $ symbol and USDC token name.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    amount: 0.05,
    showSymbol: true,
    showToken: true,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    amount: 0.05,
    showSymbol: true,
    showToken: true,
    size: 'lg',
  },
};

export const LargerAmount: Story = {
  args: {
    amount: 100.5,
    showSymbol: true,
    showToken: true,
  },
};

export const SmallAmount: Story = {
  args: {
    amount: 0.001,
    showSymbol: true,
    showToken: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Very small amounts show more decimal precision.',
      },
    },
  },
};

export const AllSizes: Story = {
  args: {
    amount: 0.05,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-pixel-gray-400">Small:</span>
        <UsdcAmount amount={0.05} showSymbol showToken size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-pixel-gray-400">Medium:</span>
        <UsdcAmount amount={0.05} showSymbol showToken size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-pixel-gray-400">Large:</span>
        <UsdcAmount amount={0.05} showSymbol showToken size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All size variants displayed together for comparison.',
      },
    },
  },
};
