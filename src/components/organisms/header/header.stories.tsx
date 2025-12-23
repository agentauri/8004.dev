import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Header } from './header';

const meta = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main navigation header with logo, navigation links, and MCP connect button.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InPageContext: Story = {
  render: function InPageContextStory() {
    return (
      <div className="min-h-screen bg-[var(--pixel-gray-dark)]">
        <Header />
        <main className="p-8">
          <h1 className="text-[var(--pixel-gray-100)] font-[family-name:var(--font-pixel-heading)] text-2xl mb-4">
            AGENT EXPLORER
          </h1>
          <p className="text-[var(--pixel-gray-400)]">Page content goes here...</p>
        </main>
      </div>
    );
  },
};
