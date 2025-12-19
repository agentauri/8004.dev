import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PixelExplorer } from './pixel-explorer';

const meta = {
  title: 'Atoms/PixelExplorer',
  component: PixelExplorer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pixel art modern explorer character in 80s retro NES/Sega style. Features a hat-wearing adventurer with tech goggles, beard, and backpack with antenna. Perfect for search states and discovery themes.',
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
      description: 'Size of the explorer sprite',
    },
    animation: {
      control: 'select',
      options: ['none', 'float', 'bounce', 'walk', 'search', 'discover'],
      description: 'Animation type to apply',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PixelExplorer>;

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
        <PixelExplorer size="sm" />
        <p className="mt-2 text-xs text-gray-400">sm (16px)</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="md" />
        <p className="mt-2 text-xs text-gray-400">md (32px)</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" />
        <p className="mt-2 text-xs text-gray-400">lg (64px)</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="xl" />
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

export const Walk: Story = {
  args: {
    size: 'lg',
    animation: 'walk',
  },
  parameters: {
    docs: {
      description: {
        story: 'Walking animation - body bob with leg movement.',
      },
    },
  },
};

export const Search: Story = {
  args: {
    size: 'lg',
    animation: 'search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Search animation - hat opens and closes like a lid.',
      },
    },
  },
};

export const Discover: Story = {
  args: {
    size: 'lg',
    animation: 'discover',
  },
  parameters: {
    docs: {
      description: {
        story: 'Discover animation - excitement jump with sparkling effects.',
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
        <PixelExplorer size="lg" animation="none" />
        <p className="mt-2 text-sm text-gray-400">none</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" animation="float" />
        <p className="mt-2 text-sm text-gray-400">float</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" animation="bounce" />
        <p className="mt-2 text-sm text-gray-400">bounce</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" animation="walk" />
        <p className="mt-2 text-sm text-gray-400">walk</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" animation="search" />
        <p className="mt-2 text-sm text-gray-400">search</p>
      </div>
      <div className="text-center">
        <PixelExplorer size="lg" animation="discover" />
        <p className="mt-2 text-sm text-gray-400">discover</p>
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

export const SearchingState: Story = {
  args: {
    size: 'xl',
  },
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <PixelExplorer size="xl" animation="search" />
      <div className="text-center">
        <p className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-blue-sky)]">
          SEARCHING FOR AGENTS...
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Explorer in search state - perfect for loading/searching UI.',
      },
    },
  },
};

export const DiscoveryState: Story = {
  args: {
    size: 'xl',
  },
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <PixelExplorer size="xl" animation="discover" />
      <div className="text-center">
        <p className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gold-coin)]">
          AGENT FOUND!
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Explorer in discovery state - for success/found results.',
      },
    },
  },
};

export const InEmptyState: Story = {
  args: {
    size: 'lg',
  },
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8 bg-[var(--pixel-gray-800)] rounded border-2 border-[var(--pixel-gray-700)]">
      <PixelExplorer size="lg" animation="float" />
      <div className="text-center">
        <p className="font-[family-name:var(--font-pixel-heading)] text-lg text-white">
          NO AGENTS FOUND
        </p>
        <p className="font-[family-name:var(--font-pixel-body)] text-xs text-gray-400 mt-2">
          Try a different search query
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Explorer used in empty state messaging.',
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
      <PixelExplorer {...args} />
    </div>
  ),
};

export const OnLightBackground: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <div className="p-8 bg-white">
      <PixelExplorer {...args} />
    </div>
  ),
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};
