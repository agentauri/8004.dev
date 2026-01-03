import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { WorkflowStep } from '@/types';
import { WorkflowVisualizer } from './workflow-visualizer';

const mockSteps: WorkflowStep[] = [
  {
    order: 1,
    name: 'Analyze Code',
    description: 'Analyze source code for issues',
    requiredRole: 'code-analyzer',
    inputs: ['source_code'],
    outputs: ['analysis_report'],
  },
  {
    order: 2,
    name: 'Security Review',
    description: 'Check for security vulnerabilities',
    requiredRole: 'security-reviewer',
    inputs: ['analysis_report'],
    outputs: ['security_report'],
  },
  {
    order: 3,
    name: 'Generate Report',
    description: 'Compile final review report',
    requiredRole: 'report-generator',
    inputs: ['analysis_report', 'security_report'],
    outputs: ['final_report'],
  },
];

describe('WorkflowVisualizer', () => {
  describe('rendering', () => {
    it('renders the workflow visualizer', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByTestId('workflow-visualizer')).toBeInTheDocument();
    });

    it('renders all workflow steps', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getAllByTestId('workflow-step')).toHaveLength(3);
    });

    it('renders steps container', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByTestId('workflow-steps')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<WorkflowVisualizer steps={mockSteps} className="custom-class" />);
      expect(screen.getByTestId('workflow-visualizer')).toHaveClass('custom-class');
    });
  });

  describe('empty state', () => {
    it('shows empty state when no steps', () => {
      render(<WorkflowVisualizer steps={[]} />);
      expect(screen.getByTestId('workflow-visualizer-empty')).toBeInTheDocument();
    });

    it('shows empty message', () => {
      render(<WorkflowVisualizer steps={[]} />);
      expect(screen.getByText('No workflow steps defined')).toBeInTheDocument();
    });
  });

  describe('step ordering', () => {
    it('renders steps in order', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      const stepNames = screen.getAllByTestId('step-name');
      expect(stepNames[0]).toHaveTextContent('Analyze Code');
      expect(stepNames[1]).toHaveTextContent('Security Review');
      expect(stepNames[2]).toHaveTextContent('Generate Report');
    });

    it('handles unsorted steps', () => {
      const unsortedSteps = [mockSteps[2], mockSteps[0], mockSteps[1]];
      render(<WorkflowVisualizer steps={unsortedSteps} />);
      const stepNames = screen.getAllByTestId('step-name');
      expect(stepNames[0]).toHaveTextContent('Analyze Code');
      expect(stepNames[1]).toHaveTextContent('Security Review');
      expect(stepNames[2]).toHaveTextContent('Generate Report');
    });
  });

  describe('connectors', () => {
    it('shows connectors between steps', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      const connectors = screen.getAllByTestId('step-connector');
      // Should have connectors for all but the last step
      expect(connectors).toHaveLength(2);
    });

    it('does not show connector on last step', () => {
      render(<WorkflowVisualizer steps={[mockSteps[0]]} />);
      expect(screen.queryByTestId('step-connector')).not.toBeInTheDocument();
    });
  });

  describe('active step', () => {
    it('marks the correct step as active', () => {
      render(<WorkflowVisualizer steps={mockSteps} activeStep={2} />);
      const steps = screen.getAllByTestId('workflow-step');
      expect(steps[1]).toHaveAttribute('data-active', 'true');
    });

    it('does not mark other steps as active', () => {
      render(<WorkflowVisualizer steps={mockSteps} activeStep={2} />);
      const steps = screen.getAllByTestId('workflow-step');
      expect(steps[0]).toHaveAttribute('data-active', 'false');
      expect(steps[2]).toHaveAttribute('data-active', 'false');
    });
  });

  describe('matched agents', () => {
    it('shows matched agents for roles', () => {
      const matchedAgents = {
        'code-analyzer': '11155111:1',
        'security-reviewer': '11155111:2',
      };
      render(<WorkflowVisualizer steps={mockSteps} matchedAgents={matchedAgents} />);

      const matchedElements = screen.getAllByTestId('step-matched-agent');
      expect(matchedElements).toHaveLength(2);
      expect(matchedElements[0]).toHaveTextContent('11155111:1');
      expect(matchedElements[1]).toHaveTextContent('11155111:2');
    });

    it('does not show matched agent when not provided', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.queryByTestId('step-matched-agent')).not.toBeInTheDocument();
    });

    it('only shows matched agents for provided roles', () => {
      const matchedAgents = {
        'code-analyzer': '11155111:1',
      };
      render(<WorkflowVisualizer steps={mockSteps} matchedAgents={matchedAgents} />);

      const matchedElements = screen.getAllByTestId('step-matched-agent');
      expect(matchedElements).toHaveLength(1);
    });
  });

  describe('summary footer', () => {
    it('shows total steps label', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByText('Total Steps')).toBeInTheDocument();
    });

    it('shows required roles label', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByText('Required Roles')).toBeInTheDocument();
    });

    it('shows matched agents section when available', () => {
      const matchedAgents = {
        'code-analyzer': '11155111:1',
        'security-reviewer': '11155111:2',
      };
      render(<WorkflowVisualizer steps={mockSteps} matchedAgents={matchedAgents} />);
      expect(screen.getByText('Matched Agents')).toBeInTheDocument();
    });

    it('does not show matched agents section when empty', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.queryByText('Matched Agents')).not.toBeInTheDocument();
    });

    it('shows data artifacts label', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByText('Data Artifacts')).toBeInTheDocument();
    });
  });

  describe('legend', () => {
    it('shows flow legend', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.getByText('Workflow Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Input')).toBeInTheDocument();
      expect(screen.getByText('Output')).toBeInTheDocument();
    });

    it('shows matched legend when agents are matched', () => {
      const matchedAgents = { 'code-analyzer': '11155111:1' };
      render(<WorkflowVisualizer steps={mockSteps} matchedAgents={matchedAgents} />);
      expect(screen.getByText('Matched')).toBeInTheDocument();
    });

    it('does not show matched legend when no agents matched', () => {
      render(<WorkflowVisualizer steps={mockSteps} />);
      expect(screen.queryByText('Matched')).not.toBeInTheDocument();
    });
  });
});
