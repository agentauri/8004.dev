import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Footer } from './footer';

const meta = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Site footer with links to ERC-8004 spec, GitHub, and copyright information.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InPageContext: Story = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--pixel-gray-dark)] flex flex-col">
      <main className="flex-1 p-8">
        <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
          PAGE CONTENT
        </h1>
        <p className="text-[var(--pixel-gray-400)]">Main content area...</p>
      </main>
      <Footer />
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-[var(--pixel-primary)]',
  },
};
