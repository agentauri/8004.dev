import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { type IOMode, IOModeFilter } from './io-mode-filter';

const meta = {
  title: 'Molecules/IOModeFilter',
  component: IOModeFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Filter component for selecting agent input/output modes. Allows users to filter agents by their supported data formats like text, JSON, images, audio, or multimodal capabilities.',
      },
    },
  },
  argTypes: {
    inputModes: {
      control: 'object',
      description: 'Available input modes to display',
    },
    outputModes: {
      control: 'object',
      description: 'Available output modes to display',
    },
    selectedInput: {
      control: 'object',
      description: 'Currently selected input modes',
    },
    selectedOutput: {
      control: 'object',
      description: 'Currently selected output modes',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof IOModeFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedInput: [],
    selectedOutput: [],
  },
};

export const WithSelections: Story = {
  args: {
    selectedInput: ['text', 'json'],
    selectedOutput: ['json'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter with pre-selected input (text, json) and output (json) modes.',
      },
    },
  },
};

export const AllSelected: Story = {
  args: {
    selectedInput: ['text', 'json', 'image', 'audio', 'multimodal'],
    selectedOutput: ['text', 'json', 'image', 'audio', 'multimodal'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter with all modes selected in both input and output.',
      },
    },
  },
};

export const LimitedModes: Story = {
  args: {
    inputModes: ['text', 'json'],
    outputModes: ['text', 'json', 'image'],
    selectedInput: ['text'],
    selectedOutput: ['json'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter showing only specific available modes.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    selectedInput: ['text'],
    selectedOutput: ['json'],
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled filter state - buttons cannot be clicked.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    selectedInput: [],
    selectedOutput: [],
  },
  render: function InteractiveFilter() {
    const [selectedInput, setSelectedInput] = useState<IOMode[]>([]);
    const [selectedOutput, setSelectedOutput] = useState<IOMode[]>([]);

    return (
      <div className="space-y-4">
        <IOModeFilter
          selectedInput={selectedInput}
          selectedOutput={selectedOutput}
          onChange={(input, output) => {
            setSelectedInput(input);
            setSelectedOutput(output);
          }}
        />
        <div className="text-xs font-mono text-gray-400 p-3 bg-[#1A1A1A] border border-[#3A3A3A]">
          <div>Selected Input: {selectedInput.length > 0 ? selectedInput.join(', ') : 'none'}</div>
          <div>
            Selected Output: {selectedOutput.length > 0 ? selectedOutput.join(', ') : 'none'}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing real-time selection state.',
      },
    },
  },
};

export const InFilterPanel: Story = {
  args: {
    selectedInput: ['text'],
    selectedOutput: ['json'],
  },
  render: (args) => (
    <div className="w-64 p-4 bg-[#1A1A1A] border border-[#3A3A3A]">
      <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider mb-4">
        Filters
      </h3>
      <IOModeFilter {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'How the filter looks inside a typical filter panel.',
      },
    },
  },
};
