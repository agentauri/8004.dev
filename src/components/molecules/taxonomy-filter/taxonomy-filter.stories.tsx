import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { TaxonomyFilter } from './taxonomy-filter';

const meta = {
  title: 'Molecules/TaxonomyFilter',
  component: TaxonomyFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaxonomyFilter provides a filterable, expandable tree with checkboxes for selecting taxonomy categories. Used in the search filters sidebar.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Type of taxonomy',
    },
    selected: {
      control: 'object',
      description: 'Currently selected slugs',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled',
    },
  },
} satisfies Meta<typeof TaxonomyFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillFilter: Story = {
  args: {
    type: 'skill',
    selected: [],
    onChange: () => {},
  },
};

export const DomainFilter: Story = {
  args: {
    type: 'domain',
    selected: [],
    onChange: () => {},
  },
};

export const WithSelection: Story = {
  args: {
    type: 'skill',
    selected: ['natural_language_processing', 'computer_vision'],
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    type: 'skill',
    selected: ['natural_language_processing'],
    onChange: () => {},
    disabled: true,
  },
};

function InteractiveSkillFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="w-64">
      <TaxonomyFilter type="skill" selected={selected} onChange={setSelected} />
      <div className="mt-4 p-2 bg-[var(--pixel-gray-800)] rounded text-xs">
        <div className="text-[var(--pixel-gray-400)]">Selected:</div>
        <div className="text-[var(--pixel-gray-200)] font-mono mt-1">
          {selected.length > 0 ? selected.join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
}

export const InteractiveSkill: Story = {
  args: {
    type: 'skill',
    selected: [],
    onChange: () => {},
  },
  render: () => <InteractiveSkillFilter />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - click checkboxes to select, use search to filter.',
      },
    },
  },
};

function InteractiveDomainFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="w-64">
      <TaxonomyFilter type="domain" selected={selected} onChange={setSelected} />
      <div className="mt-4 p-2 bg-[var(--pixel-gray-800)] rounded text-xs">
        <div className="text-[var(--pixel-gray-400)]">Selected:</div>
        <div className="text-[var(--pixel-gray-200)] font-mono mt-1">
          {selected.length > 0 ? selected.join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
}

export const InteractiveDomain: Story = {
  args: {
    type: 'domain',
    selected: [],
    onChange: () => {},
  },
  render: () => <InteractiveDomainFilter />,
};

function BothFiltersExample() {
  const [skillSelected, setSkillSelected] = useState<string[]>(['natural_language_processing']);
  const [domainSelected, setDomainSelected] = useState<string[]>(['technology']);

  return (
    <div className="w-64 space-y-4">
      <TaxonomyFilter type="skill" selected={skillSelected} onChange={setSkillSelected} />
      <TaxonomyFilter type="domain" selected={domainSelected} onChange={setDomainSelected} />
    </div>
  );
}

export const BothFilters: Story = {
  args: {
    type: 'skill',
    selected: [],
    onChange: () => {},
  },
  render: () => <BothFiltersExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Example showing both skill and domain filters together as they would appear in the search sidebar.',
      },
    },
  },
};
