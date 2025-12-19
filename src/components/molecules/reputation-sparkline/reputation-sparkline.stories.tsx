import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { type ReputationDataPoint, ReputationSparkline } from './reputation-sparkline';

const meta = {
  title: 'Molecules/ReputationSparkline',
  component: ReputationSparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A mini chart component that displays reputation score trends over time. Uses SVG for lightweight rendering without external dependencies. Color indicates trend direction: green (up), red (down), blue (stable).',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data points with date and score',
    },
    width: {
      control: { type: 'number', min: 20, max: 200 },
      description: 'Width of the sparkline in pixels',
    },
    height: {
      control: { type: 'number', min: 10, max: 100 },
      description: 'Height of the sparkline in pixels',
    },
    showTrendColor: {
      control: 'boolean',
      description: 'Whether to color based on trend direction',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ReputationSparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data generators
const generateUpwardData = (): ReputationDataPoint[] => [
  { date: '2024-01-01', score: 65 },
  { date: '2024-01-15', score: 70 },
  { date: '2024-02-01', score: 72 },
  { date: '2024-02-15', score: 78 },
  { date: '2024-03-01', score: 82 },
  { date: '2024-03-15', score: 85 },
];

const generateDownwardData = (): ReputationDataPoint[] => [
  { date: '2024-01-01', score: 90 },
  { date: '2024-01-15', score: 87 },
  { date: '2024-02-01', score: 82 },
  { date: '2024-02-15', score: 78 },
  { date: '2024-03-01', score: 73 },
  { date: '2024-03-15', score: 70 },
];

const generateStableData = (): ReputationDataPoint[] => [
  { date: '2024-01-01', score: 75 },
  { date: '2024-01-15', score: 76 },
  { date: '2024-02-01', score: 74 },
  { date: '2024-02-15', score: 75 },
  { date: '2024-03-01', score: 76 },
  { date: '2024-03-15', score: 75 },
];

const generateVolatileData = (): ReputationDataPoint[] => [
  { date: '2024-01-01', score: 50 },
  { date: '2024-01-15', score: 80 },
  { date: '2024-02-01', score: 45 },
  { date: '2024-02-15', score: 90 },
  { date: '2024-03-01', score: 60 },
  { date: '2024-03-15', score: 75 },
];

export const Default: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
  },
};

export const UpwardTrend: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Green color indicates upward reputation trend.',
      },
    },
  },
};

export const DownwardTrend: Story = {
  args: {
    data: generateDownwardData(),
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Red color indicates downward reputation trend.',
      },
    },
  },
};

export const StableTrend: Story = {
  args: {
    data: generateStableData(),
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Blue color indicates stable reputation (within ±2% threshold).',
      },
    },
  },
};

export const VolatileData: Story = {
  args: {
    data: generateVolatileData(),
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles volatile data with large swings gracefully.',
      },
    },
  },
};

export const LargerSize: Story = {
  args: {
    data: generateUpwardData(),
    width: 120,
    height: 40,
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger sparkline for more detailed views.',
      },
    },
  },
};

export const AllSizes: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateUpwardData()} width={40} height={16} />
        <span className="text-xs text-gray-400 font-mono">40×16</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateUpwardData()} width={60} height={20} />
        <span className="text-xs text-gray-400 font-mono">60×20 (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateUpwardData()} width={100} height={30} />
        <span className="text-xs text-gray-400 font-mono">100×30</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateUpwardData()} width={150} height={50} />
        <span className="text-xs text-gray-400 font-mono">150×50</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various size options for different use cases.',
      },
    },
  },
};

export const AllTrends: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateUpwardData()} width={80} height={24} />
        <span className="text-xs text-[#00D800] font-mono">Upward ↑</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateDownwardData()} width={80} height={24} />
        <span className="text-xs text-[#FC5454] font-mono">Downward ↓</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ReputationSparkline data={generateStableData()} width={80} height={24} />
        <span className="text-xs text-[#5C94FC] font-mono">Stable →</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all trend types with their respective colors.',
      },
    },
  },
};

export const WithoutTrendColor: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
    showTrendColor: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable trend-based coloring to always use blue.',
      },
    },
  },
};

export const MinimalData: Story = {
  args: {
    data: [
      { date: '2024-01-01', score: 70 },
      { date: '2024-02-01', score: 85 },
    ],
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles minimal data (just 2 points) gracefully.',
      },
    },
  },
};

export const SinglePoint: Story = {
  args: {
    data: [{ date: '2024-01-01', score: 75 }],
    width: 60,
    height: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single data point renders as a horizontal line.',
      },
    },
  },
};

export const InCardContext: Story = {
  args: {
    data: generateUpwardData(),
    width: 60,
    height: 20,
  },
  render: () => (
    <div className="p-4 bg-[#1A1A1A] border border-[#3A3A3A] rounded w-64">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-200 font-[family-name:var(--font-pixel-body)]">
          Trading Bot
        </span>
        <span className="text-sm text-[#00D800] font-[family-name:var(--font-pixel-body)]">85</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Reputation trend</span>
        <ReputationSparkline data={generateUpwardData()} width={60} height={20} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of sparkline used within an agent card context.',
      },
    },
  },
};
