import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TaxonomyBadge } from './taxonomy-badge';

const meta = {
  title: 'Atoms/TaxonomyBadge',
  component: TaxonomyBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaxonomyBadge displays a skill or domain category from the OASF taxonomy with type-specific colors and optional icon.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Type of taxonomy category',
    },
    name: {
      control: 'text',
      description: 'Display name for the badge',
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
} satisfies Meta<typeof TaxonomyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillDefault: Story = {
  args: {
    type: 'skill',
    name: 'Natural Language Processing',
  },
};

export const DomainDefault: Story = {
  args: {
    type: 'domain',
    name: 'Healthcare',
  },
};

export const WithIcon: Story = {
  args: {
    type: 'skill',
    name: 'Machine Learning',
    showIcon: true,
  },
};

export const DomainWithIcon: Story = {
  args: {
    type: 'domain',
    name: 'Technology',
    showIcon: true,
  },
};

export const Outline: Story = {
  args: {
    type: 'skill',
    name: 'Computer Vision',
    variant: 'outline',
  },
};

export const OutlineWithIcon: Story = {
  args: {
    type: 'domain',
    name: 'Finance',
    variant: 'outline',
    showIcon: true,
  },
};

export const MediumSize: Story = {
  args: {
    type: 'skill',
    name: 'Data Engineering',
    size: 'md',
    showIcon: true,
  },
};

export const LongName: Story = {
  args: {
    type: 'skill',
    name: 'Natural Language Understanding and Processing',
    showIcon: true,
  },
};

export const AllVariants: Story = {
  args: {
    type: 'skill',
    name: 'NLP',
  },
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Skills</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyBadge type="skill" name="NLP" />
          <TaxonomyBadge type="skill" name="Computer Vision" showIcon />
          <TaxonomyBadge type="skill" name="Data Engineering" variant="outline" />
          <TaxonomyBadge type="skill" name="Security" variant="outline" showIcon />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Domains</h3>
        <div className="flex flex-wrap gap-2">
          <TaxonomyBadge type="domain" name="Healthcare" />
          <TaxonomyBadge type="domain" name="Finance" showIcon />
          <TaxonomyBadge type="domain" name="Technology" variant="outline" />
          <TaxonomyBadge type="domain" name="Education" variant="outline" showIcon />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <TaxonomyBadge type="skill" name="Small" size="sm" showIcon />
          <TaxonomyBadge type="skill" name="Medium" size="md" showIcon />
        </div>
      </div>
    </div>
  ),
};
