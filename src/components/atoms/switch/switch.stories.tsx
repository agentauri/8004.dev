import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A binary on/off toggle control with retro pixel art styling. Supports labels, descriptions, and multiple sizes.',
      },
    },
  },
  args: {
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the switch',
    },
    checked: {
      control: 'boolean',
      description: 'Current checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    label: {
      control: 'text',
      description: 'Optional label text',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for controlled state
function InteractiveSwitch(props: React.ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(props.checked ?? false);
  return <Switch {...props} checked={checked} onChange={setChecked} />;
}

export const Default: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    label: 'Enable notifications',
  },
};

export const WithLabelAndDescription: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    label: 'Show all agents',
    description: 'Include inactive agents and agents without metadata',
  },
};

export const CheckedWithLabel: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    label: 'Dark mode',
    description: 'Enable dark theme for the interface',
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled option',
    description: 'This option is currently unavailable',
  },
};

export const DisabledChecked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    disabled: true,
    label: 'Locked feature',
    description: 'This feature is enabled and locked',
  },
};

export const Small: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    size: 'sm',
    label: 'Small switch',
    description: 'Compact size for tight spaces',
  },
};

export const Medium: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    size: 'md',
    label: 'Medium switch',
    description: 'Default size for most use cases',
  },
};

export const Large: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    size: 'lg',
    label: 'Large switch',
    description: 'Larger size for emphasis',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <InteractiveSwitch size="sm" checked={false} onChange={() => {}} label="Small" />
      <InteractiveSwitch size="md" checked={false} onChange={() => {}} label="Medium (default)" />
      <InteractiveSwitch size="lg" checked={false} onChange={() => {}} label="Large" />
    </div>
  ),
  args: {
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available size variants.',
      },
    },
  },
};

export const SwitchOnly: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    ariaLabel: 'Toggle feature',
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch without visible label - uses ariaLabel for accessibility.',
      },
    },
  },
};
