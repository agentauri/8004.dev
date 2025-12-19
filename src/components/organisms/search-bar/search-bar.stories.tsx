import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { SearchBar } from './search-bar';

const meta = {
  title: 'Organisms/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Main search interface for finding agents. Includes loading state and keyboard shortcuts.',
      },
    },
  },
  argTypes: {
    query: {
      control: 'text',
      description: 'Current search query',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether search is in progress',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto-focus on mount',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithQuery: Story = {
  args: {
    query: 'AI assistant',
  },
};

export const Loading: Story = {
  args: {
    query: 'searching...',
    isLoading: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your perfect agent...',
  },
};

export const Interactive: Story = {
  args: {},
  render: function InteractiveStory() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleSubmit = async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResults([
        `Result 1 for "${searchQuery}"`,
        `Result 2 for "${searchQuery}"`,
        `Result 3 for "${searchQuery}"`,
      ]);
      setIsLoading(false);
    };

    return (
      <div className="space-y-4 max-w-2xl">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          autoFocus
        />
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result}
                className="p-3 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] text-sm"
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

export const InHeroContext: Story = {
  args: {},
  render: function InHeroContextStory() {
    const [query, setQuery] = useState('');

    return (
      <div className="py-16 px-8 bg-[var(--pixel-gray-dark)] text-center">
        <h1 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-3xl mb-2">
          AGENT EXPLORER
        </h1>
        <p className="text-[var(--pixel-gray-400)] mb-8">Discover AI agents on ERC-8004</p>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={(q) => console.log('Search:', q)}
            placeholder="Search by name, capability, or address..."
          />
        </div>
      </div>
    );
  },
};
