import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  describe('rendering', () => {
    it('renders search bar element', () => {
      render(<SearchBar />);
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SearchBar className="custom-class" />);
      expect(screen.getByTestId('search-bar')).toHaveClass('custom-class');
    });

    it('renders search input', () => {
      render(<SearchBar />);
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('uses default placeholder', () => {
      render(<SearchBar />);
      expect(
        screen.getByPlaceholderText('Search agents by name, description, or address...'),
      ).toBeInTheDocument();
    });

    it('uses custom placeholder', () => {
      render(<SearchBar placeholder="Custom placeholder" />);
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });
  });

  describe('query handling', () => {
    it('displays provided query value', () => {
      render(<SearchBar query="test query" />);
      expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
    });

    it('calls onQueryChange when input changes', () => {
      const onQueryChange = vi.fn();
      render(<SearchBar onQueryChange={onQueryChange} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'new query' } });

      expect(onQueryChange).toHaveBeenCalledWith('new query');
    });

    it('calls onSubmit when Enter is pressed', () => {
      const onSubmit = vi.fn();
      render(<SearchBar query="test" onSubmit={onSubmit} />);

      const input = screen.getByRole('searchbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledWith('test');
    });

    it('calls onQueryChange and onSubmit with empty string on clear', () => {
      const onQueryChange = vi.fn();
      const onSubmit = vi.fn();
      render(<SearchBar query="test" onQueryChange={onQueryChange} onSubmit={onSubmit} />);

      const clearButton = screen.getByTestId('search-input-clear');
      fireEvent.click(clearButton);

      expect(onQueryChange).toHaveBeenCalledWith('');
      expect(onSubmit).toHaveBeenCalledWith('');
    });
  });

  describe('loading state', () => {
    it('does not show loading indicator by default', () => {
      render(<SearchBar />);
      expect(screen.queryByTestId('search-loading')).not.toBeInTheDocument();
    });

    it('shows loading indicator when isLoading is true', () => {
      render(<SearchBar isLoading />);
      expect(screen.getByTestId('search-loading')).toBeInTheDocument();
      expect(screen.getByTestId('search-loading')).toHaveTextContent('Searching...');
    });

    it('disables input when loading', () => {
      render(<SearchBar isLoading />);
      expect(screen.getByRole('searchbox')).toBeDisabled();
    });
  });

  describe('auto focus', () => {
    it('does not auto-focus by default', () => {
      render(<SearchBar />);
      expect(document.activeElement).not.toBe(screen.getByRole('searchbox'));
    });

    it('auto-focuses when autoFocus is true', () => {
      render(<SearchBar autoFocus />);
      expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    });
  });
});
