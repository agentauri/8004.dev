import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PageSizeSelector } from './page-size-selector';

const meta = {
  title: 'Atoms/PageSizeSelector',
  component: PageSizeSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown selector for choosing how many items to display per page in paginated lists.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'select' },
      options: [10, 20, 50, 100],
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof PageSizeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 20,
    onChange: (size) => console.log('Page size changed:', size),
  },
};

export const SmallPageSize: Story = {
  args: {
    value: 10,
    onChange: (size) => console.log('Page size changed:', size),
  },
};

export const LargePageSize: Story = {
  args: {
    value: 100,
    onChange: (size) => console.log('Page size changed:', size),
  },
};

export const CustomOptions: Story = {
  args: {
    value: 25,
    options: [5, 10, 25, 50],
    onChange: (size) => console.log('Page size changed:', size),
  },
};

export const Disabled: Story = {
  args: {
    value: 20,
    disabled: true,
    onChange: (size) => console.log('Page size changed:', size),
  },
};
