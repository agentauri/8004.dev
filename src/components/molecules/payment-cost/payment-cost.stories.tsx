import type { Meta, StoryObj } from '@storybook/react';
import { PaymentCost } from './payment-cost';

const meta = {
  title: 'Molecules/PaymentCost',
  component: PaymentCost,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays the USDC cost of a paid operation with optional label and icon.',
      },
    },
  },
  argTypes: {
    cost: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Cost in USD',
    },
    label: {
      control: 'text',
      description: 'Label for the operation',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show coin icon',
    },
    variant: {
      control: 'select',
      options: ['inline', 'stacked'],
      description: 'Layout variant',
    },
  },
} satisfies Meta<typeof PaymentCost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cost: 0.05,
  },
};

export const WithLabel: Story = {
  args: {
    cost: 0.05,
    label: 'Compose Team',
  },
};

export const WithoutIcon: Story = {
  args: {
    cost: 0.05,
    label: 'Evaluate Agent',
    showIcon: false,
  },
};

export const StackedVariant: Story = {
  args: {
    cost: 0.05,
    label: 'Transaction Cost',
    variant: 'stacked',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stacked layout for use in modals or confirmation dialogs.',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {
    cost: 0.05,
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-pixel-gray-400">Inline (default):</h3>
        <PaymentCost cost={0.05} label="Compose Team" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-pixel-gray-400">Inline without icon:</h3>
        <PaymentCost cost={0.05} label="Evaluate Agent" showIcon={false} />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-pixel-gray-400">Stacked:</h3>
        <PaymentCost cost={0.05} label="Transaction Cost" variant="stacked" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different layout variants.',
      },
    },
  },
};

export const DifferentAmounts: Story = {
  args: {
    cost: 0.05,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <PaymentCost cost={0.01} label="Micro" />
      <PaymentCost cost={0.05} label="Standard" />
      <PaymentCost cost={0.5} label="Medium" />
      <PaymentCost cost={5} label="Large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various cost amounts displayed together.',
      },
    },
  },
};
