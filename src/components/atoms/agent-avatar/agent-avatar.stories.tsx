import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentAvatar } from './agent-avatar';

const meta = {
  title: 'Atoms/AgentAvatar',
  component: AgentAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays an agent avatar with smart fallback behavior. Shows image when available, falls back to name-based initials with consistent color generation, ensuring every agent has a unique visual identity.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Agent name used for initials and color generation',
    },
    image: {
      control: 'text',
      description: 'Optional avatar image URL',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AgentAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    name: 'Trading Bot',
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=TradingBot',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar with a valid image URL displays the image.',
      },
    },
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Trading Bot',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When no image is provided, shows initials (first 2 characters) with a color derived from the name hash.',
      },
    },
  },
};

export const ImageError: Story = {
  args: {
    name: 'Failed Bot',
    image: 'https://invalid-url-that-will-fail.example.com/avatar.jpg',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gracefully handles image load errors by falling back to initials. Try this with a broken URL.',
      },
    },
  },
};

export const AllSizes: Story = {
  args: {
    name: 'Code Agent',
    size: 'md',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <AgentAvatar name="Code Agent" size="sm" />
      <AgentAvatar name="Code Agent" size="md" />
      <AgentAvatar name="Code Agent" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Available sizes: sm (32px), md (48px), lg (64px).',
      },
    },
  },
};

export const DifferentNames: Story = {
  args: {
    name: 'Trading Bot',
    size: 'md',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Trading Bot" size="md" />
        <span className="text-xs text-white font-mono">Trading Bot</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Code Agent" size="md" />
        <span className="text-xs text-white font-mono">Code Agent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Assistant AI" size="md" />
        <span className="text-xs text-white font-mono">Assistant AI</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Helper Bot" size="md" />
        <span className="text-xs text-white font-mono">Helper Bot</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Security Guard" size="md" />
        <span className="text-xs text-white font-mono">Security Guard</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="Analytics Engine" size="md" />
        <span className="text-xs text-white font-mono">Analytics Engine</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different names generate different colors consistently using a hash function. Same name always gets the same color.',
      },
    },
  },
};

export const WithImageAllSizes: Story = {
  args: {
    name: 'Photo Bot',
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=PhotoBot1',
    size: 'md',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <AgentAvatar
        name="Photo Bot"
        image="https://api.dicebear.com/7.x/bottts/svg?seed=PhotoBot1"
        size="sm"
      />
      <AgentAvatar
        name="Photo Bot"
        image="https://api.dicebear.com/7.x/bottts/svg?seed=PhotoBot2"
        size="md"
      />
      <AgentAvatar
        name="Photo Bot"
        image="https://api.dicebear.com/7.x/bottts/svg?seed=PhotoBot3"
        size="lg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Image avatars in all available sizes.',
      },
    },
  },
};

export const EdgeCases: Story = {
  args: {
    name: '',
    size: 'md',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="" size="md" />
        <span className="text-xs text-white font-mono">Empty name</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="A" size="md" />
        <span className="text-xs text-white font-mono">Single char</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="🤖" size="md" />
        <span className="text-xs text-white font-mono">Emoji</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AgentAvatar name="123" size="md" />
        <span className="text-xs text-white font-mono">Numbers</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Edge cases: empty names, single characters, emojis, and numbers are handled gracefully.',
      },
    },
  },
};
