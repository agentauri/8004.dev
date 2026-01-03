import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import { TeamComposer } from './team-composer';

const meta = {
  title: 'Organisms/TeamComposer',
  component: TeamComposer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A form for composing an optimal agent team for a given task. Includes task description, team size configuration, and capability filtering.',
      },
    },
  },
  argTypes: {
    onCompose: {
      description: 'Callback when the compose button is clicked with valid input',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the team composition is in progress',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onCompose: fn(),
  },
} satisfies Meta<typeof TeamComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The loading state disables all inputs and shows a loading indicator in the button.',
      },
    },
  },
};

export const WithContent: Story = {
  render: () => {
    return (
      <div className="max-w-xl">
        <TeamComposer onCompose={(input) => console.log('Compose:', input)} isLoading={false} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The composer with a constrained width, as it would appear in a page layout.',
      },
    },
  },
};

export const InCard: Story = {
  render: () => {
    return (
      <div className="max-w-xl bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6">
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-100)] mb-4">
          Compose Your Team
        </h2>
        <p className="font-mono text-sm text-[var(--pixel-gray-400)] mb-6">
          Describe your task and we will find the optimal team of AI agents to accomplish it.
        </p>
        <TeamComposer onCompose={(input) => console.log('Compose:', input)} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The composer wrapped in a card with header and description.',
      },
    },
  },
};
