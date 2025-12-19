import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FilterPreset } from '@/types/filter-preset';
import { PresetSelector } from './preset-selector';

const mockPresets: FilterPreset[] = [
  {
    id: 'all',
    name: 'All',
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    activeOnly: false,
    createdAt: Date.now(),
  },
  {
    id: 'high-rep',
    name: 'High Rep',
    chains: [],
    filterMode: 'AND',
    minReputation: 70,
    maxReputation: 100,
    activeOnly: true,
    createdAt: Date.now(),
  },
  {
    id: 'custom-1',
    name: 'Custom',
    chains: [11155111],
    filterMode: 'OR',
    minReputation: 50,
    maxReputation: 80,
    activeOnly: true,
    createdAt: Date.now(),
  },
];

const defaultProps = {
  presets: mockPresets,
  onSelect: vi.fn(),
};

describe('PresetSelector', () => {
  describe('basic rendering', () => {
    it('renders preset selector', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-selector')).toBeInTheDocument();
    });

    it('renders preset label', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-label')).toHaveTextContent('Presets');
    });

    it('renders preset list', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-list')).toBeInTheDocument();
    });

    it('renders all preset buttons', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-button-all')).toBeInTheDocument();
      expect(screen.getByTestId('preset-button-high-rep')).toBeInTheDocument();
      expect(screen.getByTestId('preset-button-custom-1')).toBeInTheDocument();
    });

    it('displays preset names', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-button-all')).toHaveTextContent('All');
      expect(screen.getByTestId('preset-button-high-rep')).toHaveTextContent('High Rep');
      expect(screen.getByTestId('preset-button-custom-1')).toHaveTextContent('Custom');
    });
  });

  describe('selection state', () => {
    it('shows selected preset with aria-pressed', () => {
      render(<PresetSelector {...defaultProps} selectedPresetId="all" />);
      expect(screen.getByTestId('preset-button-all')).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows unselected presets with aria-pressed false', () => {
      render(<PresetSelector {...defaultProps} selectedPresetId="all" />);
      expect(screen.getByTestId('preset-button-high-rep')).toHaveAttribute('aria-pressed', 'false');
    });

    it('no preset is pressed when selectedPresetId is undefined', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-button-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('preset-button-high-rep')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('preset selection', () => {
    it('calls onSelect when a preset is clicked', () => {
      const onSelect = vi.fn();
      render(<PresetSelector {...defaultProps} onSelect={onSelect} />);
      fireEvent.click(screen.getByTestId('preset-button-all'));
      expect(onSelect).toHaveBeenCalledWith(mockPresets[0]);
    });

    it('passes correct preset to onSelect', () => {
      const onSelect = vi.fn();
      render(<PresetSelector {...defaultProps} onSelect={onSelect} />);
      fireEvent.click(screen.getByTestId('preset-button-high-rep'));
      expect(onSelect).toHaveBeenCalledWith(mockPresets[1]);
    });
  });

  describe('save functionality', () => {
    it('renders save button when onSave is provided', () => {
      render(<PresetSelector {...defaultProps} onSave={vi.fn()} />);
      expect(screen.getByTestId('save-preset-button')).toBeInTheDocument();
    });

    it('does not render save button when onSave is not provided', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.queryByTestId('save-preset-button')).not.toBeInTheDocument();
    });

    it('calls onSave when save button is clicked', () => {
      const onSave = vi.fn();
      render(<PresetSelector {...defaultProps} onSave={onSave} />);
      fireEvent.click(screen.getByTestId('save-preset-button'));
      expect(onSave).toHaveBeenCalled();
    });

    it('disables save button when canSave is false', () => {
      render(<PresetSelector {...defaultProps} onSave={vi.fn()} canSave={false} />);
      expect(screen.getByTestId('save-preset-button')).toBeDisabled();
    });

    it('enables save button when canSave is true', () => {
      render(<PresetSelector {...defaultProps} onSave={vi.fn()} canSave={true} />);
      expect(screen.getByTestId('save-preset-button')).not.toBeDisabled();
    });
  });

  describe('delete functionality', () => {
    it('renders delete button for custom presets when onDelete is provided', () => {
      render(<PresetSelector {...defaultProps} onDelete={vi.fn()} />);
      expect(screen.getByTestId('delete-preset-custom-1')).toBeInTheDocument();
    });

    it('does not render delete button for built-in presets', () => {
      render(<PresetSelector {...defaultProps} onDelete={vi.fn()} />);
      expect(screen.queryByTestId('delete-preset-all')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-preset-high-rep')).not.toBeInTheDocument();
    });

    it('does not render delete buttons when onDelete is not provided', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.queryByTestId('delete-preset-custom-1')).not.toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', () => {
      const onDelete = vi.fn();
      render(<PresetSelector {...defaultProps} onDelete={onDelete} />);
      fireEvent.click(screen.getByTestId('delete-preset-custom-1'));
      expect(onDelete).toHaveBeenCalledWith('custom-1');
    });

    it('does not trigger onSelect when delete button is clicked', () => {
      const onSelect = vi.fn();
      const onDelete = vi.fn();
      render(<PresetSelector {...defaultProps} onSelect={onSelect} onDelete={onDelete} />);
      fireEvent.click(screen.getByTestId('delete-preset-custom-1'));
      expect(onDelete).toHaveBeenCalled();
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('has disabled data attribute when disabled', () => {
      render(<PresetSelector {...defaultProps} disabled />);
      expect(screen.getByTestId('preset-selector')).toHaveAttribute('data-disabled', 'true');
    });

    it('disables all preset buttons when disabled', () => {
      render(<PresetSelector {...defaultProps} disabled />);
      expect(screen.getByTestId('preset-button-all')).toBeDisabled();
      expect(screen.getByTestId('preset-button-high-rep')).toBeDisabled();
    });

    it('disables save button when disabled', () => {
      render(<PresetSelector {...defaultProps} onSave={vi.fn()} disabled />);
      expect(screen.getByTestId('save-preset-button')).toBeDisabled();
    });

    it('hides delete buttons when disabled', () => {
      render(<PresetSelector {...defaultProps} onDelete={vi.fn()} disabled />);
      expect(screen.queryByTestId('delete-preset-custom-1')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows message when no presets available', () => {
      render(<PresetSelector presets={[]} onSelect={vi.fn()} />);
      expect(screen.getByTestId('no-presets-message')).toBeInTheDocument();
      expect(screen.getByTestId('no-presets-message')).toHaveTextContent('No presets available');
    });
  });

  describe('accessibility', () => {
    it('save button has aria-label', () => {
      render(<PresetSelector {...defaultProps} onSave={vi.fn()} />);
      expect(screen.getByTestId('save-preset-button')).toHaveAttribute(
        'aria-label',
        'Save current filters as preset',
      );
    });

    it('preset buttons have aria-label', () => {
      render(<PresetSelector {...defaultProps} />);
      expect(screen.getByTestId('preset-button-all')).toHaveAttribute(
        'aria-label',
        'Select All preset',
      );
    });

    it('delete buttons have aria-label', () => {
      render(<PresetSelector {...defaultProps} onDelete={vi.fn()} />);
      expect(screen.getByTestId('delete-preset-custom-1')).toHaveAttribute(
        'aria-label',
        'Delete Custom preset',
      );
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<PresetSelector {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('preset-selector')).toHaveClass('custom-class');
    });
  });
});
