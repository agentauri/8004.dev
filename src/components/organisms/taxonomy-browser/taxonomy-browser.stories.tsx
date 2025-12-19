import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TaxonomyBrowser } from './taxonomy-browser';

const meta = {
  title: 'Organisms/TaxonomyBrowser',
  component: TaxonomyBrowser,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'TaxonomyBrowser provides a tabbed interface to browse and search OASF taxonomy categories. Used in the /taxonomy page.',
      },
    },
  },
  argTypes: {
    defaultTab: {
      control: 'radio',
      options: ['skill', 'domain'],
      description: 'Default tab to show',
    },
  },
} satisfies Meta<typeof TaxonomyBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const StartWithDomains: Story = {
  args: {
    defaultTab: 'domain',
  },
};

export const WithCategorySelection: Story = {
  args: {
    onCategorySelect: (category, type) => {
      alert(`Selected ${type}: ${category.name} (${category.slug})`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click a category to see the selection callback in action.',
      },
    },
  },
};
