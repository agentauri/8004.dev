import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CopyButton } from './copy-button';

const meta = {
  title: 'Atoms/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A button component that copies text to clipboard with visual feedback. Shows a checkmark icon briefly after successful copy.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to copy to clipboard',
    },
    successDuration: {
      control: { type: 'number', min: 500, max: 5000, step: 100 },
      description: 'Duration in ms to show success state',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size variant - xs/sm are compact, md/lg have 44px touch targets',
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '0x1234567890abcdef1234567890abcdef12345678',
  },
};

export const ExtraSmall: Story = {
  args: {
    text: 'Extra small button',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    text: 'Small button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    text: 'Large button',
    size: 'lg',
  },
};

export const WithCustomLabel: Story = {
  args: {
    text: 'agent-id-123',
    label: 'Copy agent ID',
  },
};

export const AllSizes: Story = {
  args: {
    text: 'test',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <CopyButton text="XS" size="xs" />
        <span className="text-xs text-[var(--pixel-gray-400)]">xs</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <CopyButton text="SM" size="sm" />
        <span className="text-xs text-[var(--pixel-gray-400)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <CopyButton text="MD" size="md" />
        <span className="text-xs text-[var(--pixel-gray-400)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <CopyButton text="LG" size="lg" />
        <span className="text-xs text-[var(--pixel-gray-400)]">lg</span>
      </div>
    </div>
  ),
};

export const WithAddress: Story = {
  args: {
    text: '0x1234567890abcdef1234567890abcdef12345678',
  },
  render: () => (
    <div className="flex items-center gap-1.5 p-4 border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]">
      <span className="font-mono text-sm text-[var(--pixel-gray-200)]">0x1234...5678</span>
      <CopyButton text="0x1234567890abcdef1234567890abcdef12345678" size="xs" />
    </div>
  ),
};

export const WithCallback: Story = {
  args: {
    text: 'Copied text',
    onCopy: () => console.log('Text was copied!'),
  },
};
