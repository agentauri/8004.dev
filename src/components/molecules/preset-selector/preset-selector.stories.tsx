import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { FilterPreset } from '@/types/filter-preset';
import { PresetSelector } from './preset-selector';

const mockPresets: FilterPreset[] = [
  {
    id: 'all',
    name: 'All',
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    activeOnly: false,
    createdAt: Date.now(),
  },
  {
    id: 'high-rep',
    name: 'High Rep',
    chains: [],
    filterMode: 'AND',
    minReputation: 70,
    maxReputation: 100,
    activeOnly: true,
    createdAt: Date.now(),
  },
  {
    id: 'active',
    name: 'Active',
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    activeOnly: true,
    createdAt: Date.now(),
  },
];

const meta = {
  title: 'Molecules/PresetSelector',
  component: PresetSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays preset filter buttons with save/delete functionality. Built-in presets cannot be deleted.',
      },
    },
  },
  argTypes: {
    selectedPresetId: {
      control: 'text',
      description: 'Currently selected preset ID',
    },
    canSave: {
      control: 'boolean',
      description: 'Whether save button is enabled',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PresetSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    presets: mockPresets,
    onSelect: () => {},
  },
};

export const WithSelected: Story = {
  args: {
    presets: mockPresets,
    selectedPresetId: 'high-rep',
    onSelect: () => {},
  },
};

export const WithSave: Story = {
  args: {
    presets: mockPresets,
    onSelect: () => {},
    onSave: () => {},
    canSave: true,
  },
};

export const SaveDisabled: Story = {
  args: {
    presets: mockPresets,
    onSelect: () => {},
    onSave: () => {},
    canSave: false,
  },
};

export const WithCustomPresets: Story = {
  args: {
    presets: [
      ...mockPresets,
      {
        id: 'custom-1',
        name: 'Ethereum Only',
        chains: [11155111],
        filterMode: 'AND',
        minReputation: 50,
        maxReputation: 100,
        activeOnly: true,
        createdAt: Date.now(),
      },
      {
        id: 'custom-2',
        name: 'Low Rep',
        chains: [],
        filterMode: 'OR',
        minReputation: 0,
        maxReputation: 30,
        activeOnly: false,
        createdAt: Date.now(),
      },
    ],
    selectedPresetId: 'custom-1',
    onSelect: () => {},
    onDelete: () => {},
  },
};

export const Disabled: Story = {
  args: {
    presets: mockPresets,
    selectedPresetId: 'all',
    onSelect: () => {},
    onSave: () => {},
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    presets: [],
    onSelect: () => {},
  },
};

export const Interactive: Story = {
  args: {
    presets: mockPresets,
    onSelect: () => {},
  },
  render: function InteractiveSelector() {
    const [presets, setPresets] = useState<FilterPreset[]>([
      ...mockPresets,
      {
        id: 'custom-1',
        name: 'My Preset',
        chains: [11155111],
        filterMode: 'OR',
        minReputation: 40,
        maxReputation: 80,
        activeOnly: true,
        createdAt: Date.now(),
      },
    ]);
    const [selectedId, setSelectedId] = useState<string>('all');
    const [customCount, setCustomCount] = useState(2);

    const handleSelect = (preset: FilterPreset) => {
      setSelectedId(preset.id);
    };

    const handleSave = () => {
      const newPreset: FilterPreset = {
        id: `custom-${customCount}`,
        name: `Custom ${customCount}`,
        chains: [],
        filterMode: 'AND',
        minReputation: Math.floor(Math.random() * 50),
        maxReputation: Math.floor(Math.random() * 50) + 50,
        activeOnly: Math.random() > 0.5,
        createdAt: Date.now(),
      };
      setPresets([...presets, newPreset]);
      setCustomCount(customCount + 1);
    };

    const handleDelete = (presetId: string) => {
      setPresets(presets.filter((p) => p.id !== presetId));
      if (selectedId === presetId) {
        setSelectedId('all');
      }
    };

    const selectedPreset = presets.find((p) => p.id === selectedId);

    return (
      <div className="w-80 space-y-4">
        <PresetSelector
          presets={presets}
          selectedPresetId={selectedId}
          onSelect={handleSelect}
          onSave={handleSave}
          onDelete={handleDelete}
          canSave={presets.length < 8}
        />
        {selectedPreset && (
          <div className="p-3 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] text-[0.625rem]">
            <div className="text-[var(--pixel-gray-400)]">Selected preset:</div>
            <div className="text-[var(--pixel-blue-sky)]">{selectedPreset.name}</div>
            <div className="text-[var(--pixel-gray-500)] mt-1">
              Rep: {selectedPreset.minReputation}-{selectedPreset.maxReputation} | Mode:{' '}
              {selectedPreset.filterMode}
            </div>
          </div>
        )}
      </div>
    );
  },
};
