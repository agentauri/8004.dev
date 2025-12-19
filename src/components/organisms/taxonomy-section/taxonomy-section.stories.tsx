import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TaxonomySection } from './taxonomy-section';

const meta = {
  title: 'Organisms/TaxonomySection',
  component: TaxonomySection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "TaxonomySection displays an agent's OASF skills and domains in collapsible sections with hierarchical grouping. Used on the agent detail page.",
      },
    },
  },
  argTypes: {
    skills: {
      control: 'object',
      description: 'Array of skill slugs',
    },
    domains: {
      control: 'object',
      description: 'Array of domain slugs',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether data is loading',
    },
  },
} satisfies Meta<typeof TaxonomySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkillsOnly: Story = {
  args: {
    skills: ['natural_language_processing', 'computer_vision', 'analytical_skills'],
  },
};

export const DomainsOnly: Story = {
  args: {
    domains: ['technology', 'healthcare', 'finance'],
  },
};

export const SkillsAndDomains: Story = {
  args: {
    skills: ['natural_language_processing', 'computer_vision', 'security'],
    domains: ['technology', 'healthcare'],
  },
};

export const WithChildCategories: Story = {
  args: {
    skills: [
      'natural_language_processing/natural_language_understanding',
      'natural_language_processing/natural_language_generation',
      'natural_language_processing/text_classification',
      'computer_vision/image_classification',
      'computer_vision/object_detection',
      'security',
    ],
    domains: [
      'technology/artificial_intelligence',
      'technology/blockchain',
      'healthcare/medical_research',
      'finance',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows hierarchical grouping when child categories are present. Click group headers to expand/collapse.',
      },
    },
  },
};

export const SingleSkill: Story = {
  args: {
    skills: ['natural_language_processing'],
  },
};

export const SingleDomain: Story = {
  args: {
    domains: ['technology'],
  },
};

export const ManyItems: Story = {
  args: {
    skills: [
      'natural_language_processing',
      'natural_language_processing/natural_language_understanding',
      'natural_language_processing/natural_language_generation',
      'natural_language_processing/text_classification',
      'computer_vision',
      'computer_vision/image_classification',
      'computer_vision/object_detection',
      'audio',
      'audio/speech_recognition',
      'security',
      'analytical_skills',
      'analytical_skills/mathematical_reasoning',
      'analytical_skills/coding_skills',
    ],
    domains: [
      'technology',
      'technology/artificial_intelligence',
      'technology/blockchain',
      'technology/cybersecurity',
      'healthcare',
      'healthcare/medical_research',
      'finance',
      'finance/banking',
      'legal',
      'education',
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    skills: [],
    domains: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Returns null when no skills or domains are provided.',
      },
    },
  },
};

export const UnknownSlugs: Story = {
  args: {
    skills: ['unknown_skill', 'another_unknown/child'],
    domains: ['unknown_domain'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles unknown slugs gracefully by formatting them as display names.',
      },
    },
  },
};

export const RealWorldExample: Story = {
  args: {
    skills: [
      'natural_language_processing/natural_language_understanding',
      'natural_language_processing/natural_language_generation',
      'analytical_skills/coding_skills',
      'retrieval_augmented_generation',
      'agentic_frameworks/tool_calling',
    ],
    domains: [
      'technology/software_development',
      'technology/artificial_intelligence',
      'legal/legal_compliance',
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how a typical AI coding assistant agent might be categorized.',
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="max-w-md space-y-4 p-4 bg-[var(--pixel-gray-900)] rounded">
      <h3 className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)] text-sm uppercase">
        Agent Capabilities
      </h3>
      <TaxonomySection
        skills={[
          'natural_language_processing',
          'natural_language_processing/natural_language_understanding',
          'computer_vision/image_classification',
          'security',
        ]}
        domains={['technology/artificial_intelligence', 'healthcare']}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how the component appears within a card context.',
      },
    },
  },
};
