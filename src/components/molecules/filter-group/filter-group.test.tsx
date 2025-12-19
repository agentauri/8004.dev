import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterGroup } from './filter-group';

describe('FilterGroup', () => {
  const defaultOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  describe('rendering', () => {
    it('renders with label and options', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup label="Status" options={defaultOptions} selected={[]} onChange={onChange} />,
      );
      expect(screen.getByTestId('filter-group')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={[]}
          onChange={onChange}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('filter-group')).toHaveClass('custom-class');
    });

    it('renders options with counts', () => {
      const onChange = vi.fn();
      const optionsWithCounts = [
        { value: 'active', label: 'Active', count: 42 },
        { value: 'inactive', label: 'Inactive', count: 8 },
      ];
      render(
        <FilterGroup
          label="Status"
          options={optionsWithCounts}
          selected={[]}
          onChange={onChange}
        />,
      );
      expect(screen.getByText('(42)')).toBeInTheDocument();
      expect(screen.getByText('(8)')).toBeInTheDocument();
    });

    it('renders zero count', () => {
      const onChange = vi.fn();
      const optionsWithZero = [{ value: 'empty', label: 'Empty', count: 0 }];
      render(
        <FilterGroup label="Status" options={optionsWithZero} selected={[]} onChange={onChange} />,
      );
      expect(screen.getByText('(0)')).toBeInTheDocument();
    });

    it('renders count with different style when selected', () => {
      const onChange = vi.fn();
      const optionsWithCounts = [{ value: 'active', label: 'Active', count: 42 }];
      render(
        <FilterGroup
          label="Status"
          options={optionsWithCounts}
          selected={['active']}
          onChange={onChange}
        />,
      );
      const countSpan = screen.getByText('(42)');
      expect(countSpan).toBeInTheDocument();
      expect(countSpan).toHaveClass('text-white/70');
    });
  });

  describe('selection state', () => {
    it('shows selected state for selected options', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
        />,
      );
      expect(screen.getByTestId('filter-option-active')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-option-inactive')).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows multiple selected options', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active', 'pending']}
          onChange={onChange}
        />,
      );
      expect(screen.getByTestId('filter-option-active')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-option-inactive')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-option-pending')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('multi-select mode', () => {
    it('adds to selection when clicking unselected option', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByTestId('filter-option-inactive'));
      expect(onChange).toHaveBeenCalledWith(['active', 'inactive']);
    });

    it('removes from selection when clicking selected option', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active', 'inactive']}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByTestId('filter-option-active'));
      expect(onChange).toHaveBeenCalledWith(['inactive']);
    });

    it('allows selecting all options', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active', 'inactive']}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByTestId('filter-option-pending'));
      expect(onChange).toHaveBeenCalledWith(['active', 'inactive', 'pending']);
    });
  });

  describe('single-select mode', () => {
    it('replaces selection when clicking different option', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
          multiSelect={false}
        />,
      );
      fireEvent.click(screen.getByTestId('filter-option-inactive'));
      expect(onChange).toHaveBeenCalledWith(['inactive']);
    });

    it('clears selection when clicking selected option', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
          multiSelect={false}
        />,
      );
      fireEvent.click(screen.getByTestId('filter-option-active'));
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('keyboard interaction', () => {
    it('handles Enter key to toggle selection', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup label="Status" options={defaultOptions} selected={[]} onChange={onChange} />,
      );
      fireEvent.keyDown(screen.getByTestId('filter-option-active'), { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith(['active']);
    });

    it('handles Space key to toggle selection', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
        />,
      );
      fireEvent.keyDown(screen.getByTestId('filter-option-active'), { key: ' ' });
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('ignores other keys', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup label="Status" options={defaultOptions} selected={[]} onChange={onChange} />,
      );
      fireEvent.keyDown(screen.getByTestId('filter-option-active'), { key: 'Tab' });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has accessible group role', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup label="Status" options={defaultOptions} selected={[]} onChange={onChange} />,
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has aria-labelledby linking to label', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup label="Status" options={defaultOptions} selected={[]} onChange={onChange} />,
      );
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-labelledby', 'filter-group-status');
    });

    it('handles multi-word labels in id', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Agent Status"
          options={defaultOptions}
          selected={[]}
          onChange={onChange}
        />,
      );
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-labelledby', 'filter-group-agent-status');
    });

    it('buttons have aria-pressed state', () => {
      const onChange = vi.fn();
      render(
        <FilterGroup
          label="Status"
          options={defaultOptions}
          selected={['active']}
          onChange={onChange}
        />,
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('type safety', () => {
    it('works with generic string type', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      render(<FilterGroup label="Test" options={options} selected={['a']} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('filter-option-b'));
      expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    });
  });
});
