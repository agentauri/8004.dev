import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TeamComposer } from './team-composer';

describe('TeamComposer', () => {
  describe('rendering', () => {
    it('renders the team composer form', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByTestId('team-composer')).toBeInTheDocument();
    });

    it('renders task description label', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByText('Task Description')).toBeInTheDocument();
    });

    it('renders task textarea', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByTestId('task-input')).toBeInTheDocument();
    });

    it('renders team size label with default value', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByText('Max Team Size:')).toBeInTheDocument();
      expect(screen.getByTestId('team-size-value')).toHaveTextContent('5');
    });

    it('renders team size slider', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByTestId('team-size-slider')).toBeInTheDocument();
    });

    it('renders capabilities section', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByText('Required Capabilities (Optional)')).toBeInTheDocument();
    });

    it('renders all capability buttons', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByTestId('capability-mcp')).toBeInTheDocument();
      expect(screen.getByTestId('capability-a2a')).toBeInTheDocument();
      expect(screen.getByTestId('capability-x402')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByTestId('compose-button')).toBeInTheDocument();
      expect(screen.getByTestId('compose-button')).toHaveTextContent('Build Team');
    });

    it('applies custom className', () => {
      render(<TeamComposer onCompose={vi.fn()} className="custom-class" />);
      expect(screen.getByTestId('team-composer')).toHaveClass('custom-class');
    });
  });

  describe('task input', () => {
    it('updates task value on input', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const input = screen.getByTestId('task-input');

      fireEvent.change(input, { target: { value: 'Test task' } });
      expect(input).toHaveValue('Test task');
    });

    it('shows character count', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      expect(screen.getByText('0/1000')).toBeInTheDocument();
    });

    it('updates character count on input', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const input = screen.getByTestId('task-input');

      fireEvent.change(input, { target: { value: 'Hello world' } });
      expect(screen.getByText('11/1000')).toBeInTheDocument();
    });

    it('has maxLength of 1000', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const input = screen.getByTestId('task-input');
      expect(input).toHaveAttribute('maxLength', '1000');
    });

    it('shows placeholder text', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const input = screen.getByTestId('task-input');
      expect(input).toHaveAttribute(
        'placeholder',
        'Describe the task you want a team of agents to accomplish...',
      );
    });
  });

  describe('team size slider', () => {
    it('has default value of 5', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const slider = screen.getByTestId('team-size-slider');
      expect(slider).toHaveValue('5');
    });

    it('updates team size on change', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const slider = screen.getByTestId('team-size-slider');

      fireEvent.change(slider, { target: { value: '8' } });
      expect(slider).toHaveValue('8');
      expect(screen.getByTestId('team-size-value')).toHaveTextContent('8');
    });

    it('has min of 2', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const slider = screen.getByTestId('team-size-slider');
      expect(slider).toHaveAttribute('min', '2');
    });

    it('has max of 10', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const slider = screen.getByTestId('team-size-slider');
      expect(slider).toHaveAttribute('max', '10');
    });
  });

  describe('capability toggles', () => {
    it('toggles MCP capability on click', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const mcpButton = screen.getByTestId('capability-mcp');

      expect(mcpButton).toHaveClass('border-[var(--pixel-gray-600)]');

      fireEvent.click(mcpButton);
      expect(mcpButton).toHaveClass('border-[var(--pixel-green-pipe)]');

      fireEvent.click(mcpButton);
      expect(mcpButton).toHaveClass('border-[var(--pixel-gray-600)]');
    });

    it('toggles A2A capability on click', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const a2aButton = screen.getByTestId('capability-a2a');

      fireEvent.click(a2aButton);
      expect(a2aButton).toHaveClass('border-[var(--pixel-green-pipe)]');
    });

    it('toggles x402 capability on click', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const x402Button = screen.getByTestId('capability-x402');

      fireEvent.click(x402Button);
      expect(x402Button).toHaveClass('border-[var(--pixel-green-pipe)]');
    });

    it('allows multiple capabilities to be selected', () => {
      render(<TeamComposer onCompose={vi.fn()} />);

      fireEvent.click(screen.getByTestId('capability-mcp'));
      fireEvent.click(screen.getByTestId('capability-a2a'));

      expect(screen.getByTestId('capability-mcp')).toHaveClass('border-[var(--pixel-green-pipe)]');
      expect(screen.getByTestId('capability-a2a')).toHaveClass('border-[var(--pixel-green-pipe)]');
    });
  });

  describe('submit button', () => {
    it('is disabled when task is empty', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      const button = screen.getByTestId('compose-button');
      expect(button).toBeDisabled();
    });

    it('is disabled when task is only whitespace', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      fireEvent.change(screen.getByTestId('task-input'), { target: { value: '   ' } });
      expect(screen.getByTestId('compose-button')).toBeDisabled();
    });

    it('is enabled when task has content', () => {
      render(<TeamComposer onCompose={vi.fn()} />);
      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Test task' } });
      expect(screen.getByTestId('compose-button')).not.toBeDisabled();
    });

    it('is disabled when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Test task' } });
      expect(screen.getByTestId('compose-button')).toBeDisabled();
    });

    it('shows loading text when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      expect(screen.getByTestId('compose-button')).toHaveTextContent('Building Team...');
    });
  });

  describe('form submission', () => {
    it('calls onCompose with task only', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Build a bot' } });
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 5,
      });
    });

    it('calls onCompose with custom team size', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Build a bot' } });
      fireEvent.change(screen.getByTestId('team-size-slider'), { target: { value: '8' } });
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 8,
      });
    });

    it('calls onCompose with selected capabilities', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Build a bot' } });
      fireEvent.click(screen.getByTestId('capability-mcp'));
      fireEvent.click(screen.getByTestId('capability-a2a'));
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 5,
        requiredCapabilities: ['mcp', 'a2a'],
      });
    });

    it('calls onCompose with all options', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Build a bot' } });
      fireEvent.change(screen.getByTestId('team-size-slider'), { target: { value: '6' } });
      fireEvent.click(screen.getByTestId('capability-mcp'));
      fireEvent.click(screen.getByTestId('capability-x402'));
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 6,
        requiredCapabilities: ['mcp', 'x402'],
      });
    });

    it('trims whitespace from task', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: '  Build a bot  ' } });
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 5,
      });
    });

    it('does not call onCompose when task is empty', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.submit(screen.getByTestId('team-composer'));
      expect(onCompose).not.toHaveBeenCalled();
    });

    it('does not include requiredCapabilities when none selected', () => {
      const onCompose = vi.fn();
      render(<TeamComposer onCompose={onCompose} />);

      fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Build a bot' } });
      fireEvent.submit(screen.getByTestId('team-composer'));

      expect(onCompose).toHaveBeenCalledWith({
        task: 'Build a bot',
        maxTeamSize: 5,
      });
      expect(onCompose.mock.calls[0][0]).not.toHaveProperty('requiredCapabilities');
    });
  });

  describe('loading state', () => {
    it('disables task input when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      expect(screen.getByTestId('task-input')).toBeDisabled();
    });

    it('disables team size slider when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      expect(screen.getByTestId('team-size-slider')).toBeDisabled();
    });

    it('disables capability buttons when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      expect(screen.getByTestId('capability-mcp')).toBeDisabled();
      expect(screen.getByTestId('capability-a2a')).toBeDisabled();
      expect(screen.getByTestId('capability-x402')).toBeDisabled();
    });

    it('disables submit button when loading', () => {
      render(<TeamComposer onCompose={vi.fn()} isLoading />);
      expect(screen.getByTestId('compose-button')).toBeDisabled();
    });
  });
});
