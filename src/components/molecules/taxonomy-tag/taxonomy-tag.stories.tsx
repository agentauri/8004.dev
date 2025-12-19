import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TaxonomyTag } from './taxonomy-tag';

const meta = {
  title: 'Molecules/TaxonomyTag',
  component: TaxonomyTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaxonomyTag resolves a taxonomy slug to its display name and optionally shows a tooltip with the full path. Used to display OASF skills and domains.',
      },
    },
  },
  argTypes: {
    slug: {
      control: 'text',
      description: 'The taxonomy slug to resolve',
    },
    type: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Type of taxonomy',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show full path tooltip on hover',
    },
    variant: {
      control: 'radio',
      options: ['default', 'outline'],
      description: 'Visual variant',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the type icon',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
  },
} satisfies Meta<typeof TaxonomyTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillTag: Story = {
  args: {
    slug: 'natural_language_processing',
    type: 'skill',
    showTooltip: true,
  },
};

export const DomainTag: Story = {
  args: {
    slug: 'technology',
    type: 'domain',
    showTooltip: true,
  },
};

export const ChildCategory: Story = {
  args: {
    slug: 'natural_language_processing/summarization',
    type: 'skill',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Hover to see the full path in the tooltip: "Natural Language Processing > Summarization"',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    slug: 'computer_vision',
    type: 'skill',
    showIcon: true,
    showTooltip: true,
  },
};

export const OutlineVariant: Story = {
  args: {
    slug: 'healthcare',
    type: 'domain',
    variant: 'outline',
    showTooltip: true,
  },
};

export const MediumSize: Story = {
  args: {
    slug: 'security',
    type: 'skill',
    size: 'md',
    showIcon: true,
    showTooltip: true,
  },
};

export const UnknownSlug: Story = {
  args: {
    slug: 'unknown_category',
    type: 'skill',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Falls back to formatted slug when the category is not found in taxonomy',
      },
    },
  },
};

export const AllSkillExamples: Story = {
  args: {
    slug: 'natural_language_processing',
    type: 'skill',
  },
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Top-Level Skills</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="natural_language_processing" type="skill" showTooltip />
          <TaxonomyTag slug="computer_vision" type="skill" showTooltip />
          <TaxonomyTag slug="audio" type="skill" showTooltip />
          <TaxonomyTag slug="security" type="skill" showTooltip />
          <TaxonomyTag slug="data_engineering" type="skill" showTooltip />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">
          Child Skills (hover for path)
        </h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="natural_language_processing/summarization" type="skill" showTooltip />
          <TaxonomyTag slug="natural_language_processing/translation" type="skill" showTooltip />
          <TaxonomyTag slug="computer_vision/image_classification" type="skill" showTooltip />
          <TaxonomyTag slug="security/vulnerability_scanning" type="skill" showTooltip />
        </div>
      </div>
    </div>
  ),
};

export const AllDomainExamples: Story = {
  args: {
    slug: 'technology',
    type: 'domain',
  },
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Top-Level Domains</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="technology" type="domain" showTooltip />
          <TaxonomyTag slug="healthcare" type="domain" showTooltip />
          <TaxonomyTag slug="finance" type="domain" showTooltip />
          <TaxonomyTag slug="legal" type="domain" showTooltip />
          <TaxonomyTag slug="education" type="domain" showTooltip />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">
          Child Domains (hover for path)
        </h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="technology/blockchain" type="domain" showTooltip />
          <TaxonomyTag slug="technology/artificial_intelligence" type="domain" showTooltip />
          <TaxonomyTag slug="finance/banking" type="domain" showTooltip />
          <TaxonomyTag slug="healthcare/medical_research" type="domain" showTooltip />
        </div>
      </div>
    </div>
  ),
};

export const VariantComparison: Story = {
  args: {
    slug: 'natural_language_processing',
    type: 'skill',
  },
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Default Variant</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="natural_language_processing" type="skill" />
          <TaxonomyTag slug="technology" type="domain" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Outline Variant</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="natural_language_processing" type="skill" variant="outline" />
          <TaxonomyTag slug="technology" type="domain" variant="outline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">With Icons</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyTag slug="natural_language_processing" type="skill" showIcon />
          <TaxonomyTag slug="technology" type="domain" showIcon />
          <TaxonomyTag slug="computer_vision" type="skill" showIcon variant="outline" />
          <TaxonomyTag slug="healthcare" type="domain" showIcon variant="outline" />
        </div>
      </div>
    </div>
  ),
};
