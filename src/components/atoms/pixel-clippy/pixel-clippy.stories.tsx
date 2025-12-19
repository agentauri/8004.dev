import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { ClippyAnimation, ClippyMood } from './pixel-clippy';
import { PixelClippy } from './pixel-clippy';

const meta = {
  title: 'Atoms/PixelClippy',
  component: PixelClippy,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A pixel art paperclip assistant character inspired by Clippy. Features different moods, animations, and optional speech bubbles.',
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
      description: 'Size of the clippy',
    },
    mood: {
      control: 'select',
      options: ['idle', 'thinking', 'happy', 'surprised', 'wink'],
      description: 'Current mood/expression',
    },
    animation: {
      control: 'select',
      options: ['none', 'float', 'bounce', 'wiggle', 'wave'],
      description: 'Animation type',
    },
    message: {
      control: 'text',
      description: 'Speech bubble text',
    },
  },
} satisfies Meta<typeof PixelClippy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'lg',
    mood: 'idle',
    animation: 'none',
  },
};

export const WithMessage: Story = {
  args: {
    size: 'lg',
    mood: 'idle',
    message: 'Need help?',
    animation: 'float',
  },
};

export const Happy: Story = {
  args: {
    size: 'lg',
    mood: 'happy',
    animation: 'bounce',
  },
};

export const Thinking: Story = {
  args: {
    size: 'lg',
    mood: 'thinking',
    message: 'Hmm...',
  },
};

export const Surprised: Story = {
  args: {
    size: 'lg',
    mood: 'surprised',
    animation: 'wiggle',
  },
};

export const Wink: Story = {
  args: {
    size: 'lg',
    mood: 'wink',
    message: 'Got it!',
  },
};

export const AllMoods: Story = {
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" mood="idle" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Idle
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" mood="thinking" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Thinking
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" mood="happy" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Happy
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" mood="surprised" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Surprised
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" mood="wink" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Wink
        </span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available mood expressions for Clippy.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="sm" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          SM
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="md" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          MD
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          LG
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="xl" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          XL
        </span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes for Clippy.',
      },
    },
  },
};

export const AllAnimations: Story = {
  render: () => (
    <div className="flex gap-8 items-end pt-12">
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" animation="none" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          None
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" animation="float" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Float
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" animation="bounce" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Bounce
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" animation="wiggle" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Wiggle
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PixelClippy size="lg" animation="wave" />
        <span className="text-xs text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] uppercase">
          Wave
        </span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available animations for Clippy.',
      },
    },
  },
};

// Interactive story with state
function InteractiveClippy() {
  const moods: ClippyMood[] = ['idle', 'thinking', 'happy', 'surprised', 'wink'];
  const animations: ClippyAnimation[] = ['none', 'float', 'bounce', 'wiggle', 'wave'];
  const messages = ['Hi there!', 'Need help?', 'Click me!', 'Great job!', "Let's go!"];

  const [moodIndex, setMoodIndex] = useState(0);
  const [animIndex, setAnimIndex] = useState(0);

  const handleClick = () => {
    setMoodIndex((prev) => (prev + 1) % moods.length);
    setAnimIndex((prev) => (prev + 1) % animations.length);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <PixelClippy
        size="xl"
        mood={moods[moodIndex]}
        animation={animations[animIndex]}
        message={messages[moodIndex]}
        onClick={handleClick}
      />
      <p className="text-sm text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
        Click to change mood!
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveClippy />,
  parameters: {
    docs: {
      description: {
        story: 'Click on Clippy to cycle through different moods and animations.',
      },
    },
  },
};

export const MessageExamples: Story = {
  render: () => (
    <div className="flex gap-12 items-end pt-16">
      <PixelClippy size="lg" mood="idle" message="Hello!" animation="float" />
      <PixelClippy size="lg" mood="thinking" message="Hmm..." />
      <PixelClippy size="lg" mood="happy" message="Great!" animation="bounce" />
      <PixelClippy size="lg" mood="surprised" message="Wow!" animation="wiggle" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of Clippy with different speech bubble messages.',
      },
    },
  },
};
