import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { TaxonomyCategory } from '@/lib/constants/oasf/types';
import { TaxonomyTreeNode } from './taxonomy-tree-node';

const mockNLPCategory: TaxonomyCategory = {
  id: 1,
  slug: 'natural_language_processing',
  name: 'Natural Language Processing',
  description: 'NLP capabilities for text understanding and generation',
  children: [
    {
      id: 101,
      slug: 'natural_language_processing/summarization',
      name: 'Summarization',
      parentId: 1,
    },
    { id: 102, slug: 'natural_language_processing/translation', name: 'Translation', parentId: 1 },
    {
      id: 103,
      slug: 'natural_language_processing/sentiment_analysis',
      name: 'Sentiment Analysis',
      parentId: 1,
    },
  ],
};

const mockLeafCategory: TaxonomyCategory = {
  id: 101,
  slug: 'natural_language_processing/summarization',
  name: 'Summarization',
  parentId: 1,
};

const mockTechnologyDomain: TaxonomyCategory = {
  id: 1,
  slug: 'technology',
  name: 'Technology',
  children: [
    {
      id: 101,
      slug: 'technology/artificial_intelligence',
      name: 'Artificial Intelligence',
      parentId: 1,
    },
    { id: 102, slug: 'technology/blockchain', name: 'Blockchain', parentId: 1 },
    { id: 103, slug: 'technology/cloud_computing', name: 'Cloud Computing', parentId: 1 },
    { id: 104, slug: 'technology/cybersecurity', name: 'Cybersecurity', parentId: 1 },
  ],
};

const meta = {
  title: 'Molecules/TaxonomyTreeNode',
  component: TaxonomyTreeNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaxonomyTreeNode displays a single node in a hierarchical taxonomy tree. Handles expand/collapse for parent nodes and selection state.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Type of taxonomy',
    },
    depth: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Nesting depth (0 = root)',
    },
    isExpanded: {
      control: 'boolean',
      description: 'Whether the node is expanded',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the node is selected',
    },
  },
} satisfies Meta<typeof TaxonomyTreeNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CollapsedParent: Story = {
  args: {
    category: mockNLPCategory,
    type: 'skill',
    depth: 0,
    isExpanded: false,
    onToggle: () => {},
  },
};

export const ExpandedParent: Story = {
  args: {
    category: mockNLPCategory,
    type: 'skill',
    depth: 0,
    isExpanded: true,
    onToggle: () => {},
  },
};

export const LeafNode: Story = {
  args: {
    category: mockLeafCategory,
    type: 'skill',
    depth: 1,
    isExpanded: false,
    onToggle: () => {},
  },
};

export const SelectedSkill: Story = {
  args: {
    category: mockNLPCategory,
    type: 'skill',
    depth: 0,
    isExpanded: false,
    isSelected: true,
    onToggle: () => {},
  },
};

export const SelectedDomain: Story = {
  args: {
    category: mockTechnologyDomain,
    type: 'domain',
    depth: 0,
    isExpanded: false,
    isSelected: true,
    onToggle: () => {},
  },
};

export const DomainNode: Story = {
  args: {
    category: mockTechnologyDomain,
    type: 'domain',
    depth: 0,
    isExpanded: false,
    onToggle: () => {},
  },
};

export const NestedDepth: Story = {
  args: {
    category: { id: 1, slug: 'root', name: 'Root Category' },
    type: 'skill',
    depth: 0,
    isExpanded: true,
    onToggle: () => {},
  },
  render: () => (
    <div className="space-y-1">
      <TaxonomyTreeNode
        category={{
          id: 1,
          slug: 'root',
          name: 'Root Category',
          children: [{ id: 2, slug: 'child', name: 'Child' }],
        }}
        type="skill"
        depth={0}
        isExpanded={true}
        onToggle={() => {}}
      />
      <TaxonomyTreeNode
        category={{
          id: 2,
          slug: 'level1',
          name: 'Level 1',
          children: [{ id: 3, slug: 'child', name: 'Child' }],
        }}
        type="skill"
        depth={1}
        isExpanded={true}
        onToggle={() => {}}
      />
      <TaxonomyTreeNode
        category={{
          id: 3,
          slug: 'level2',
          name: 'Level 2',
          children: [{ id: 4, slug: 'child', name: 'Child' }],
        }}
        type="skill"
        depth={2}
        isExpanded={true}
        onToggle={() => {}}
      />
      <TaxonomyTreeNode
        category={{ id: 4, slug: 'level3', name: 'Level 3 (Leaf)' }}
        type="skill"
        depth={3}
        isExpanded={false}
        onToggle={() => {}}
      />
    </div>
  ),
};

function InteractiveDemo() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['natural_language_processing']),
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const toggleNode = (slug: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <div className="space-y-1" role="tree">
      <TaxonomyTreeNode
        category={mockNLPCategory}
        type="skill"
        depth={0}
        isExpanded={expandedNodes.has('natural_language_processing')}
        isSelected={selectedSlug === 'natural_language_processing'}
        onToggle={() => toggleNode('natural_language_processing')}
        onSelect={(cat) => setSelectedSlug(cat.slug)}
      />
      {expandedNodes.has('natural_language_processing') &&
        mockNLPCategory.children?.map((child) => (
          <TaxonomyTreeNode
            key={child.id}
            category={child}
            type="skill"
            depth={1}
            isExpanded={false}
            isSelected={selectedSlug === child.slug}
            onToggle={() => {}}
            onSelect={(cat) => setSelectedSlug(cat.slug)}
          />
        ))}
    </div>
  );
}

export const Interactive: Story = {
  args: {
    category: { id: 1, slug: 'nlp', name: 'NLP' },
    type: 'skill',
    depth: 0,
    isExpanded: true,
    onToggle: () => {},
  },
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Click the chevron to expand/collapse, click the node to select it.',
      },
    },
  },
};

function FullTreeDemo() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['technology']));
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const toggleNode = (slug: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const skills: TaxonomyCategory[] = [
    mockNLPCategory,
    {
      id: 2,
      slug: 'computer_vision',
      name: 'Computer Vision',
      children: [
        {
          id: 201,
          slug: 'computer_vision/image_classification',
          name: 'Image Classification',
          parentId: 2,
        },
        {
          id: 202,
          slug: 'computer_vision/object_detection',
          name: 'Object Detection',
          parentId: 2,
        },
      ],
    },
    {
      id: 3,
      slug: 'security',
      name: 'Security',
      children: [
        {
          id: 301,
          slug: 'security/vulnerability_scanning',
          name: 'Vulnerability Scanning',
          parentId: 3,
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase mb-2">Skills</h3>
        <div className="space-y-1" role="tree">
          {skills.map((category) => (
            <div key={category.id}>
              <TaxonomyTreeNode
                category={category}
                type="skill"
                depth={0}
                isExpanded={expandedNodes.has(category.slug)}
                isSelected={selectedSlug === category.slug}
                onToggle={() => toggleNode(category.slug)}
                onSelect={(cat) => setSelectedSlug(cat.slug)}
              />
              {expandedNodes.has(category.slug) &&
                category.children?.map((child) => (
                  <TaxonomyTreeNode
                    key={child.id}
                    category={child}
                    type="skill"
                    depth={1}
                    isExpanded={false}
                    isSelected={selectedSlug === child.slug}
                    onToggle={() => {}}
                    onSelect={(cat) => setSelectedSlug(cat.slug)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase mb-2">Domains</h3>
        <div className="space-y-1" role="tree">
          <TaxonomyTreeNode
            category={mockTechnologyDomain}
            type="domain"
            depth={0}
            isExpanded={expandedNodes.has('technology')}
            isSelected={selectedSlug === 'technology'}
            onToggle={() => toggleNode('technology')}
            onSelect={(cat) => setSelectedSlug(cat.slug)}
          />
          {expandedNodes.has('technology') &&
            mockTechnologyDomain.children?.map((child) => (
              <TaxonomyTreeNode
                key={child.id}
                category={child}
                type="domain"
                depth={1}
                isExpanded={false}
                isSelected={selectedSlug === child.slug}
                onToggle={() => {}}
                onSelect={(cat) => setSelectedSlug(cat.slug)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export const FullTreeExample: Story = {
  args: {
    category: { id: 1, slug: 'tech', name: 'Technology' },
    type: 'domain',
    depth: 0,
    isExpanded: true,
    onToggle: () => {},
  },
  render: () => <FullTreeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side example showing skills (purple) and domains (teal) tree nodes.',
      },
    },
  },
};
