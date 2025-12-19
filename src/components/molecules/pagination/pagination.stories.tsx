import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pagination navigation controls for browsing through pages of content. Includes first, previous, next, and last page buttons with a current page indicator.',
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current page number (1-indexed)',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether pagination is in loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the pagination is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'When there is only one page, the pagination is hidden.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: () => {},
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
    disabled: true,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    onPageChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: function InteractivePagination() {
    const [page, setPage] = useState(1);
    const totalPages = 10;

    return (
      <div className="space-y-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <div className="text-center text-sm text-[var(--pixel-gray-400)]">
          Showing page <span className="text-[var(--pixel-blue-sky)]">{page}</span> of {totalPages}
        </div>
      </div>
    );
  },
};

export const WithContent: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
  render: function PaginationWithContent() {
    const [page, setPage] = useState(1);
    const totalPages = 5;
    const itemsPerPage = 3;

    const allItems = [
      'Agent Alpha',
      'Agent Bravo',
      'Agent Charlie',
      'Agent Delta',
      'Agent Echo',
      'Agent Foxtrot',
      'Agent Golf',
      'Agent Hotel',
      'Agent India',
      'Agent Juliet',
      'Agent Kilo',
      'Agent Lima',
      'Agent Mike',
      'Agent November',
      'Agent Oscar',
    ];

    const startIdx = (page - 1) * itemsPerPage;
    const pageItems = allItems.slice(startIdx, startIdx + itemsPerPage);

    return (
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          {pageItems.map((item) => (
            <div
              key={item}
              className="p-3 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-sm text-[var(--pixel-gray-200)]"
            >
              {item}
            </div>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    );
  },
};
