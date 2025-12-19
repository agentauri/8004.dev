import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { MobileFilterSheet } from './mobile-filter-sheet';

const meta = {
  title: 'Organisms/MobileFilterSheet',
  component: MobileFilterSheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'MobileFilterSheet provides a bottom sheet UI for filters on mobile devices. It displays a trigger button that opens a full-height bottom sheet with all search filters.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-[var(--pixel-gray-900)] min-h-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileFilterSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFilters: SearchFiltersState = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
};

const InteractiveTemplate = ({
  initialFilters = defaultFilters,
  disabled = false,
}: {
  initialFilters?: SearchFiltersState;
  disabled?: boolean;
}) => {
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);

  return (
    <MobileFilterSheet
      filters={filters}
      onFiltersChange={setFilters}
      disabled={disabled}
      counts={{
        active: 150,
        inactive: 50,
        mcp: 75,
        a2a: 45,
        x402: 30,
      }}
    />
  );
};

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
};

export const WithActiveFilters: Story = {
  args: {
    filters: {
      ...defaultFilters,
      status: ['active'],
      protocols: ['mcp'],
      chains: [11155111],
    },
    onFiltersChange: () => {},
  },
};

export const WithManyActiveFilters: Story = {
  args: {
    filters: {
      ...defaultFilters,
      status: ['active'],
      protocols: ['mcp', 'a2a', 'x402'],
      chains: [11155111, 84532],
      skills: ['nlp'],
      domains: ['technology'],
    },
    onFiltersChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: () => {},
  },
  render: (args) => <InteractiveTemplate initialFilters={args.filters} disabled={args.disabled} />,
};

export const InteractiveWithFilters: Story = {
  args: {
    filters: {
      ...defaultFilters,
      status: ['active'],
      protocols: ['mcp'],
    },
    onFiltersChange: () => {},
  },
  render: (args) => <InteractiveTemplate initialFilters={args.filters} />,
};
