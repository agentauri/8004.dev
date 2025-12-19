import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<SearchInput />);
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<SearchInput placeholder="Search agents..." />);
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(<SearchInput value="test query" />);
      expect(screen.getByTestId('search-input-field')).toHaveValue('test query');
    });

    it('renders clear button when value exists', () => {
      render(<SearchInput value="test" />);
      expect(screen.getByTestId('search-input-clear')).toBeInTheDocument();
    });

    it('does not render clear button when empty', () => {
      render(<SearchInput value="" />);
      expect(screen.queryByTestId('search-input-clear')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SearchInput className="custom-class" />);
      expect(screen.getByTestId('search-input')).toHaveClass('custom-class');
    });

    it('applies disabled styles when disabled', () => {
      render(<SearchInput disabled />);
      expect(screen.getByTestId('search-input')).toHaveClass('opacity-50');
      expect(screen.getByTestId('search-input-field')).toBeDisabled();
    });
  });

  describe('controlled mode', () => {
    it('uses controlled value', () => {
      const { rerender } = render(<SearchInput value="initial" />);
      expect(screen.getByTestId('search-input-field')).toHaveValue('initial');

      rerender(<SearchInput value="updated" />);
      expect(screen.getByTestId('search-input-field')).toHaveValue('updated');
    });

    it('calls onChange with new value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<SearchInput value="" onChange={onChange} />);
      await user.type(screen.getByTestId('search-input-field'), 'a');

      expect(onChange).toHaveBeenCalledWith('a');
    });
  });

  describe('uncontrolled mode', () => {
    it('manages internal state', async () => {
      const user = userEvent.setup();

      render(<SearchInput />);
      const input = screen.getByTestId('search-input-field');

      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('calls onChange in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<SearchInput onChange={onChange} />);
      await user.type(screen.getByTestId('search-input-field'), 'a');

      expect(onChange).toHaveBeenCalledWith('a');
    });
  });

  describe('clear functionality', () => {
    it('clears controlled value on clear button click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(<SearchInput value="test" onChange={onChange} onClear={onClear} />);
      await user.click(screen.getByTestId('search-input-clear'));

      expect(onChange).toHaveBeenCalledWith('');
      expect(onClear).toHaveBeenCalled();
    });

    it('clears uncontrolled value on clear button click', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();

      render(<SearchInput onClear={onClear} />);
      const input = screen.getByTestId('search-input-field');

      await user.type(input, 'test');
      expect(input).toHaveValue('test');

      await user.click(screen.getByTestId('search-input-clear'));
      expect(input).toHaveValue('');
      expect(onClear).toHaveBeenCalled();
    });

    it('clears on Escape key', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();

      render(<SearchInput onClear={onClear} />);
      const input = screen.getByTestId('search-input-field');

      await user.type(input, 'test');
      await user.keyboard('{Escape}');

      expect(input).toHaveValue('');
      expect(onClear).toHaveBeenCalled();
    });
  });

  describe('submit functionality', () => {
    it('calls onSubmit on Enter key', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<SearchInput value="search query" onSubmit={onSubmit} />);
      const input = screen.getByTestId('search-input-field');

      input.focus();
      await user.keyboard('{Enter}');

      expect(onSubmit).toHaveBeenCalledWith('search query');
    });

    it('calls onSubmit with current uncontrolled value', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<SearchInput onSubmit={onSubmit} />);
      const input = screen.getByTestId('search-input-field');

      await user.type(input, 'my search');
      await user.keyboard('{Enter}');

      expect(onSubmit).toHaveBeenCalledWith('my search');
    });
  });

  describe('accessibility', () => {
    it('has accessible clear button', () => {
      render(<SearchInput value="test" />);
      expect(screen.getByTestId('search-input-clear')).toHaveAttribute(
        'aria-label',
        'Clear search',
      );
    });

    it('clear button is disabled when input is disabled', () => {
      render(<SearchInput value="test" disabled />);
      expect(screen.getByTestId('search-input-clear')).toBeDisabled();
    });

    it('supports autoFocus', () => {
      render(<SearchInput autoFocus />);
      expect(screen.getByTestId('search-input-field')).toHaveFocus();
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();

      render(<SearchInput />);
      const input = screen.getByTestId('search-input-field');

      await user.tab();
      expect(input).toHaveFocus();
    });
  });

  describe('search icon', () => {
    it('renders search icon', () => {
      render(<SearchInput />);
      const container = screen.getByTestId('search-input');
      const svg = container.querySelector('svg.lucide-search');
      expect(svg).toBeInTheDocument();
    });
  });
});
