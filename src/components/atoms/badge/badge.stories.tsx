import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from './badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small label or status indicator. Supports multiple visual variants for different contexts.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const AllVariants: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">
        <span className="mr-1">✓</span>Active
      </Badge>
      <Badge variant="destructive">
        <span className="mr-1">⚠</span>Error
      </Badge>
    </div>
  ),
};

export const InContext: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="p-4 bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)] max-w-xs">
      <div className="flex items-center gap-2">
        <span className="text-[var(--pixel-gray-100)]">Status:</span>
        <Badge variant="default">Active</Badge>
      </div>
    </div>
  ),
};
