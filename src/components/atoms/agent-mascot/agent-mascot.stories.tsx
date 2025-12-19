import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AgentMascot } from './agent-mascot';

const meta = {
  title: 'Atoms/AgentMascot',
  component: AgentMascot,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pixel art mascot character "Agent-0" in 80s retro NES/Sega style. Features a humanoid figure with VR visor, blue jacket, and 8004 badge. Perfect for branding and logo usage.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the mascot sprite',
    },
    animation: {
      control: 'select',
      options: [
        'none',
        'float',
        'blink',
        'bounce',
        'pulse',
        'walk',
        'wave',
        'dance',
        'glitch',
        'spin',
        'celebrate',
      ],
      description: 'Animation type to apply',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AgentMascot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    animation: 'none',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const AllSizes: Story = {
  args: {
    size: 'md',
  },
  render: () => (
    <div className="flex items-end gap-8">
      <div className="text-center">
        <AgentMascot size="sm" />
        <p className="mt-2 text-xs text-gray-400">sm (16px)</p>
      </div>
      <div className="text-center">
        <AgentMascot size="md" />
        <p className="mt-2 text-xs text-gray-400">md (32px)</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" />
        <p className="mt-2 text-xs text-gray-400">lg (64px)</p>
      </div>
      <div className="text-center">
        <AgentMascot size="xl" />
        <p className="mt-2 text-xs text-gray-400">xl (128px)</p>
      </div>
    </div>
  ),
};

// Animation Stories

export const Float: Story = {
  args: {
    size: 'lg',
    animation: 'float',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gentle floating animation - classic idle effect.',
      },
    },
  },
};

export const Blink: Story = {
  args: {
    size: 'lg',
    animation: 'blink',
  },
  parameters: {
    docs: {
      description: {
        story: 'VR visor blink animation - periodic flicker effect.',
      },
    },
  },
};

export const Bounce: Story = {
  args: {
    size: 'lg',
    animation: 'bounce',
  },
  parameters: {
    docs: {
      description: {
        story: '8-bit bounce animation - NES-style idle jump.',
      },
    },
  },
};

export const Pulse: Story = {
  args: {
    size: 'lg',
    animation: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge pulse animation - draws attention to the 8004 badge.',
      },
    },
  },
};

export const Walk: Story = {
  args: {
    size: 'lg',
    animation: 'walk',
  },
  parameters: {
    docs: {
      description: {
        story: 'Walking animation - alternating leg movement.',
      },
    },
  },
};

export const Wave: Story = {
  args: {
    size: 'lg',
    animation: 'wave',
  },
  parameters: {
    docs: {
      description: {
        story: 'Wave animation - friendly arm greeting.',
      },
    },
  },
};

export const Dance: Story = {
  args: {
    size: 'lg',
    animation: 'dance',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dance animation - arcade victory dance with swaying body and arms.',
      },
    },
  },
};

export const Glitch: Story = {
  args: {
    size: 'lg',
    animation: 'glitch',
  },
  parameters: {
    docs: {
      description: {
        story: 'Glitch animation - retro distortion effect with color shifts.',
      },
    },
  },
};

export const Spin: Story = {
  args: {
    size: 'lg',
    animation: 'spin',
  },
  parameters: {
    docs: {
      description: {
        story: 'Spin animation - power-up style 3D rotation.',
      },
    },
  },
};

export const Celebrate: Story = {
  args: {
    size: 'lg',
    animation: 'celebrate',
  },
  parameters: {
    docs: {
      description: {
        story: 'Celebrate animation - victory jump with falling pixel confetti.',
      },
    },
  },
};

export const AllAnimations: Story = {
  args: {
    size: 'lg',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <div className="text-center">
        <AgentMascot size="lg" animation="none" />
        <p className="mt-2 text-sm text-gray-400">none</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="float" />
        <p className="mt-2 text-sm text-gray-400">float</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="blink" />
        <p className="mt-2 text-sm text-gray-400">blink</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="bounce" />
        <p className="mt-2 text-sm text-gray-400">bounce</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="pulse" />
        <p className="mt-2 text-sm text-gray-400">pulse</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="walk" />
        <p className="mt-2 text-sm text-gray-400">walk</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="wave" />
        <p className="mt-2 text-sm text-gray-400">wave</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="dance" />
        <p className="mt-2 text-sm text-gray-400">dance</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="glitch" />
        <p className="mt-2 text-sm text-gray-400">glitch</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="spin" />
        <p className="mt-2 text-sm text-gray-400">spin</p>
      </div>
      <div className="text-center">
        <AgentMascot size="lg" animation="celebrate" />
        <p className="mt-2 text-sm text-gray-400">celebrate</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available animations side by side.',
      },
    },
  },
};

export const InHeader: Story = {
  args: {
    size: 'md',
  },
  render: () => (
    <div className="flex items-center gap-3 p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
      <AgentMascot size="md" animation="bounce" />
      <span className="font-[family-name:var(--font-pixel-heading)] text-lg text-white">
        AGENT EXPLORER
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example usage in a header/navbar context.',
      },
    },
  },
};

export const AsLogo: Story = {
  args: {
    size: 'xl',
  },
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <AgentMascot size="xl" animation="float" />
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl text-[var(--pixel-blue-sky)]">
          8004.DEV
        </h1>
        <p className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gold-coin)]">
          AGENT EXPLORER
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full logo treatment with mascot and text.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    size: 'lg',
    animation: 'bounce',
  },
  render: (args) => (
    <div className="p-8 bg-black">
      <AgentMascot {...args} />
    </div>
  ),
};

export const OnLightBackground: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <div className="p-8 bg-white">
      <AgentMascot {...args} />
    </div>
  ),
  globals: {
    backgrounds: {
      value: "light"
    }
  },
};
