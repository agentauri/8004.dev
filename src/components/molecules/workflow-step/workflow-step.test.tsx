import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { WorkflowStep as WorkflowStepType } from '@/types';
import { WorkflowStep } from './workflow-step';

const mockStep: WorkflowStepType = {
  order: 1,
  name: 'Analyze Code',
  description: 'Analyze source code for issues and potential improvements',
  requiredRole: 'code-analyzer',
  inputs: ['source_code', 'config_file'],
  outputs: ['analysis_report'],
};

describe('WorkflowStep', () => {
  describe('rendering', () => {
    it('renders the workflow step', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('workflow-step')).toBeInTheDocument();
    });

    it('renders step number', () => {
      render(<WorkflowStep step={mockStep} stepNumber={3} />);
      expect(screen.getByTestId('step-number')).toHaveTextContent('3');
    });

    it('renders step name', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('step-name')).toHaveTextContent('Analyze Code');
    });

    it('renders step description', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('step-description')).toHaveTextContent(
        'Analyze source code for issues',
      );
    });

    it('renders required role', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('step-role')).toHaveTextContent('code-analyzer');
    });

    it('renders inputs', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      const inputs = screen.getByTestId('step-inputs');
      expect(inputs).toHaveTextContent('source_code');
      expect(inputs).toHaveTextContent('config_file');
    });

    it('renders outputs', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      const outputs = screen.getByTestId('step-outputs');
      expect(outputs).toHaveTextContent('analysis_report');
    });

    it('sets data-step-order attribute', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('workflow-step')).toHaveAttribute('data-step-order', '1');
    });

    it('applies custom className', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} className="custom-class" />);
      expect(screen.getByTestId('workflow-step')).toHaveClass('custom-class');
    });
  });

  describe('active state', () => {
    it('sets data-active attribute when active', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive />);
      expect(screen.getByTestId('workflow-step')).toHaveAttribute('data-active', 'true');
    });

    it('sets data-active attribute to false when not active', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive={false} />);
      expect(screen.getByTestId('workflow-step')).toHaveAttribute('data-active', 'false');
    });

    it('applies active styles to step number', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive />);
      expect(screen.getByTestId('step-number')).toHaveClass('border-[var(--pixel-green-pipe)]');
    });

    it('applies inactive styles to step number when not active', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive={false} />);
      expect(screen.getByTestId('step-number')).toHaveClass('border-[var(--pixel-gray-600)]');
    });
  });

  describe('connector line', () => {
    it('shows connector by default', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.getByTestId('step-connector')).toBeInTheDocument();
    });

    it('hides connector when showConnector is false', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} showConnector={false} />);
      expect(screen.queryByTestId('step-connector')).not.toBeInTheDocument();
    });

    it('marks connector as active when step is active', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive />);
      expect(screen.getByTestId('step-connector')).toHaveAttribute('data-active', 'true');
    });

    it('marks connector as inactive when step is not active', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} isActive={false} />);
      expect(screen.getByTestId('step-connector')).toHaveAttribute('data-active', 'false');
    });
  });

  describe('matched agent', () => {
    it('does not show matched agent by default', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} />);
      expect(screen.queryByTestId('step-matched-agent')).not.toBeInTheDocument();
    });

    it('shows matched agent when provided', () => {
      render(<WorkflowStep step={mockStep} stepNumber={1} matchedAgentId="11155111:123" />);
      expect(screen.getByTestId('step-matched-agent')).toBeInTheDocument();
      expect(screen.getByTestId('step-matched-agent')).toHaveTextContent('11155111:123');
    });
  });

  describe('empty inputs/outputs', () => {
    it('does not render inputs section when empty', () => {
      const stepNoInputs = { ...mockStep, inputs: [] };
      render(<WorkflowStep step={stepNoInputs} stepNumber={1} />);
      expect(screen.queryByTestId('step-inputs')).not.toBeInTheDocument();
    });

    it('does not render outputs section when empty', () => {
      const stepNoOutputs = { ...mockStep, outputs: [] };
      render(<WorkflowStep step={stepNoOutputs} stepNumber={1} />);
      expect(screen.queryByTestId('step-outputs')).not.toBeInTheDocument();
    });
  });
});
