import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { type IOMode, IOModeFilter } from './io-mode-filter';

describe('IOModeFilter', () => {
  it('renders with default modes', () => {
    render(<IOModeFilter />);

    expect(screen.getByTestId('io-mode-filter')).toBeInTheDocument();
    expect(screen.getByTestId('input-modes-group')).toBeInTheDocument();
    expect(screen.getByTestId('output-modes-group')).toBeInTheDocument();

    // Check all default modes are rendered for both input and output
    const defaultModes: IOMode[] = ['text', 'json', 'image', 'audio', 'multimodal'];
    for (const mode of defaultModes) {
      expect(screen.getByTestId(`input-mode-${mode}`)).toBeInTheDocument();
      expect(screen.getByTestId(`output-mode-${mode}`)).toBeInTheDocument();
    }
  });

  it('renders with custom modes', () => {
    render(<IOModeFilter inputModes={['text', 'json']} outputModes={['json', 'image']} />);

    // Input modes
    expect(screen.getByTestId('input-mode-text')).toBeInTheDocument();
    expect(screen.getByTestId('input-mode-json')).toBeInTheDocument();
    expect(screen.queryByTestId('input-mode-image')).not.toBeInTheDocument();

    // Output modes
    expect(screen.getByTestId('output-mode-json')).toBeInTheDocument();
    expect(screen.getByTestId('output-mode-image')).toBeInTheDocument();
    expect(screen.queryByTestId('output-mode-text')).not.toBeInTheDocument();
  });

  it('shows selected state for input modes', () => {
    render(<IOModeFilter selectedInput={['text', 'json']} selectedOutput={[]} />);

    const textButton = screen.getByTestId('input-mode-text');
    const jsonButton = screen.getByTestId('input-mode-json');
    const imageButton = screen.getByTestId('input-mode-image');

    expect(textButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(imageButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows selected state for output modes', () => {
    render(<IOModeFilter selectedInput={[]} selectedOutput={['json', 'multimodal']} />);

    const jsonButton = screen.getByTestId('output-mode-json');
    const multiButton = screen.getByTestId('output-mode-multimodal');
    const textButton = screen.getByTestId('output-mode-text');

    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(multiButton).toHaveAttribute('aria-pressed', 'true');
    expect(textButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when input mode is toggled on', () => {
    const onChange = vi.fn();
    render(<IOModeFilter selectedInput={[]} selectedOutput={['json']} onChange={onChange} />);

    fireEvent.click(screen.getByTestId('input-mode-text'));

    expect(onChange).toHaveBeenCalledWith(['text'], ['json']);
  });

  it('calls onChange when input mode is toggled off', () => {
    const onChange = vi.fn();
    render(
      <IOModeFilter selectedInput={['text', 'json']} selectedOutput={[]} onChange={onChange} />,
    );

    fireEvent.click(screen.getByTestId('input-mode-text'));

    expect(onChange).toHaveBeenCalledWith(['json'], []);
  });

  it('calls onChange when output mode is toggled on', () => {
    const onChange = vi.fn();
    render(<IOModeFilter selectedInput={['text']} selectedOutput={[]} onChange={onChange} />);

    fireEvent.click(screen.getByTestId('output-mode-image'));

    expect(onChange).toHaveBeenCalledWith(['text'], ['image']);
  });

  it('calls onChange when output mode is toggled off', () => {
    const onChange = vi.fn();
    render(
      <IOModeFilter selectedInput={[]} selectedOutput={['json', 'image']} onChange={onChange} />,
    );

    fireEvent.click(screen.getByTestId('output-mode-json'));

    expect(onChange).toHaveBeenCalledWith([], ['image']);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(
      <IOModeFilter selectedInput={[]} selectedOutput={[]} onChange={onChange} disabled={true} />,
    );

    fireEvent.click(screen.getByTestId('input-mode-text'));
    fireEvent.click(screen.getByTestId('output-mode-json'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<IOModeFilter disabled={true} />);

    const defaultModes: IOMode[] = ['text', 'json', 'image', 'audio', 'multimodal'];
    for (const mode of defaultModes) {
      expect(screen.getByTestId(`input-mode-${mode}`)).toBeDisabled();
      expect(screen.getByTestId(`output-mode-${mode}`)).toBeDisabled();
    }
  });

  it('applies custom className', () => {
    render(<IOModeFilter className="custom-class" />);

    expect(screen.getByTestId('io-mode-filter')).toHaveClass('custom-class');
  });

  it('renders section labels', () => {
    render(<IOModeFilter />);

    expect(screen.getByText('Input Modes')).toBeInTheDocument();
    expect(screen.getByText('Output Modes')).toBeInTheDocument();
  });

  it('renders correct icons for each mode', () => {
    render(<IOModeFilter inputModes={['text']} outputModes={['json']} />);

    // Check that icons are rendered (they have aria-hidden="true")
    const inputButton = screen.getByTestId('input-mode-text');
    const outputButton = screen.getByTestId('output-mode-json');

    expect(inputButton.querySelector('svg')).toBeInTheDocument();
    expect(outputButton.querySelector('svg')).toBeInTheDocument();
  });

  it('shows correct labels for all mode types', () => {
    render(<IOModeFilter />);

    // Input modes
    expect(screen.getByTestId('input-mode-text')).toHaveTextContent('Text');
    expect(screen.getByTestId('input-mode-json')).toHaveTextContent('JSON');
    expect(screen.getByTestId('input-mode-image')).toHaveTextContent('Image');
    expect(screen.getByTestId('input-mode-audio')).toHaveTextContent('Audio');
    expect(screen.getByTestId('input-mode-multimodal')).toHaveTextContent('Multi');
  });

  it('handles adding to selections correctly', () => {
    const onChange = vi.fn();
    render(<IOModeFilter selectedInput={['text']} selectedOutput={['json']} onChange={onChange} />);

    // Add another input mode
    fireEvent.click(screen.getByTestId('input-mode-image'));
    expect(onChange).toHaveBeenCalledWith(['text', 'image'], ['json']);
  });

  it('handles adding to output selections correctly', () => {
    const onChange = vi.fn();
    render(
      <IOModeFilter
        selectedInput={['text', 'image']}
        selectedOutput={['json']}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByTestId('output-mode-audio'));
    expect(onChange).toHaveBeenCalledWith(['text', 'image'], ['json', 'audio']);
  });

  it('works without onChange callback', () => {
    render(<IOModeFilter selectedInput={['text']} selectedOutput={['json']} />);

    // Should not throw when clicking without onChange
    expect(() => {
      fireEvent.click(screen.getByTestId('input-mode-text'));
      fireEvent.click(screen.getByTestId('output-mode-json'));
    }).not.toThrow();
  });

  it('applies selected styling correctly', () => {
    render(<IOModeFilter selectedInput={['text']} selectedOutput={[]} />);

    const selectedButton = screen.getByTestId('input-mode-text');
    const unselectedButton = screen.getByTestId('input-mode-json');

    // Selected button should have blue background class
    expect(selectedButton).toHaveClass('bg-[var(--pixel-blue-sky)]');
    // Unselected should have transparent background
    expect(unselectedButton).toHaveClass('bg-transparent');
  });
});
