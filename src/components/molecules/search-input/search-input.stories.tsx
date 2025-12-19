import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { SearchInput } from './search-input';

const meta = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search input field with icon and clear button. Supports both controlled and uncontrolled modes with keyboard shortcuts (Enter to submit, Escape to clear).',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current search value (controlled mode)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto focus on mount',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search agents...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'AI Assistant',
    placeholder: 'Search agents...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search agents...',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: 'Cannot clear this',
    disabled: true,
  },
};

export const Controlled: Story = {
  args: {
    placeholder: 'Type to search...',
  },
  render: function ControlledStory(args) {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4">
        <SearchInput
          {...args}
          value={value}
          onChange={setValue}
          onSubmit={(v) => alert(`Searching for: ${v}`)}
        />
        <p className="text-[var(--pixel-gray-400)] text-sm font-[family-name:var(--font-pixel-body)]">
          Current value: "{value}"
        </p>
      </div>
    );
  },
};

export const InContext: Story = {
  args: {
    placeholder: 'Search agents...',
  },
  render: (args) => (
    <div className="p-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] max-w-md">
      <h2 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-title)] text-lg mb-4">
        FIND AGENTS
      </h2>
      <SearchInput {...args} />
    </div>
  ),
};
