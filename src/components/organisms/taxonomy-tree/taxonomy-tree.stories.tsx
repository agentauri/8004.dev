import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { TaxonomyTree } from './taxonomy-tree';

const meta = {
  title: 'Organisms/TaxonomyTree',
  component: TaxonomyTree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaxonomyTree displays a full hierarchical tree view of OASF taxonomy categories. Used in the taxonomy browser page.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Type of taxonomy to display',
    },
    searchQuery: {
      control: 'text',
      description: 'Search query to filter the tree',
    },
  },
} satisfies Meta<typeof TaxonomyTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Skills: Story = {
  args: {
    type: 'skill',
  },
};

export const Domains: Story = {
  args: {
    type: 'domain',
  },
};

export const WithSearch: Story = {
  args: {
    type: 'skill',
    searchQuery: 'vision',
  },
};

export const NoResults: Story = {
  args: {
    type: 'skill',
    searchQuery: 'xyznonexistent',
  },
};

function InteractiveExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories..."
          className="flex-1 px-3 py-2 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] rounded text-sm text-[var(--pixel-gray-200)]"
        />
      </div>

      {selectedCategory && (
        <div className="p-2 bg-[var(--pixel-gray-800)] rounded text-xs">
          <span className="text-[var(--pixel-gray-400)]">Selected: </span>
          <span className="text-[var(--pixel-gray-200)] font-mono">{selectedCategory}</span>
        </div>
      )}

      <TaxonomyTree
        type="skill"
        searchQuery={searchQuery}
        onCategoryClick={(cat) => setSelectedCategory(cat.slug)}
      />
    </div>
  );
}

export const Interactive: Story = {
  args: {
    type: 'skill',
  },
  render: () => <InteractiveExample />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with search input and category selection.',
      },
    },
  },
};

function SideBySideExample() {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <h3 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)] text-sm uppercase mb-4">
          Skills
        </h3>
        <TaxonomyTree type="skill" />
      </div>
      <div className="flex-1">
        <h3 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)] text-sm uppercase mb-4">
          Domains
        </h3>
        <TaxonomyTree type="domain" />
      </div>
    </div>
  );
}

export const SideBySide: Story = {
  args: {
    type: 'skill',
  },
  render: () => <SideBySideExample />,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of Skills and Domains trees.',
      },
    },
  },
};
