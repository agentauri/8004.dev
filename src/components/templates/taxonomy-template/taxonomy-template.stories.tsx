import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TaxonomyTemplate } from './taxonomy-template';

const meta = {
  title: 'Templates/TaxonomyTemplate',
  component: TaxonomyTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'TaxonomyTemplate provides the full page layout for the /taxonomy browser page.',
      },
    },
  },
} satisfies Meta<typeof TaxonomyTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSelection: Story = {
  args: {
    onCategorySelect: (category, type) => {
      alert(`Navigate to /explore?${type}s=${category.slug}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click a category to see the navigation callback in action.',
      },
    },
  },
};
