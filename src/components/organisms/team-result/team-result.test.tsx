import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TeamComposition } from '@/types';
import { TeamResult } from './team-result';

const mockComposition: TeamComposition = {
  id: 'comp-123',
  task: 'Build a smart contract auditor',
  team: [
    {
      agentId: '11155111:123',
      role: 'Code Analyzer',
      contribution: 'Analyzes smart contract code for vulnerabilities',
      compatibilityScore: 92,
    },
    {
      agentId: '11155111:456',
      role: 'Security Expert',
      contribution: 'Provides security best practices and recommendations',
      compatibilityScore: 88,
    },
    {
      agentId: '84532:789',
      role: 'Report Generator',
      contribution: 'Generates comprehensive audit reports',
      compatibilityScore: 85,
    },
  ],
  fitnessScore: 87,
  reasoning:
    'This team combines code analysis expertise with security knowledge and reporting capabilities to provide comprehensive smart contract audits.',
  createdAt: new Date('2024-01-15T10:30:00Z'),
};

describe('TeamResult', () => {
  describe('rendering', () => {
    it('renders the team result', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByTestId('team-result')).toBeInTheDocument();
    });

    it('displays the header', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('Team Composed')).toBeInTheDocument();
    });

    it('displays fitness score label', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('Team Fitness Score')).toBeInTheDocument();
    });

    it('displays task label', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('Task')).toBeInTheDocument();
    });

    it('displays the task description', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByTestId('task-description')).toHaveTextContent(
        'Build a smart contract auditor',
      );
    });

    it('displays team members count', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('Team Members (3)')).toBeInTheDocument();
    });

    it('displays AI reasoning label', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('AI Reasoning')).toBeInTheDocument();
    });

    it('displays the AI reasoning text', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByTestId('ai-reasoning')).toHaveTextContent(
        'This team combines code analysis expertise',
      );
    });

    it('displays composition ID', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText(/ID: comp-123/)).toBeInTheDocument();
    });

    it('displays creation date', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TeamResult composition={mockComposition} className="custom-class" />);
      expect(screen.getByTestId('team-result')).toHaveClass('custom-class');
    });
  });

  describe('team members grid', () => {
    it('renders team members grid', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByTestId('team-members-grid')).toBeInTheDocument();
    });

    it('renders correct number of team member cards', () => {
      render(<TeamResult composition={mockComposition} />);
      const cards = screen.getAllByTestId('team-member-card');
      expect(cards).toHaveLength(3);
    });

    it('renders team members with correct agent IDs', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('11155111:123')).toBeInTheDocument();
      expect(screen.getByText('11155111:456')).toBeInTheDocument();
      expect(screen.getByText('84532:789')).toBeInTheDocument();
    });

    it('renders team members with correct roles', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.getByText('Code Analyzer')).toBeInTheDocument();
      expect(screen.getByText('Security Expert')).toBeInTheDocument();
      expect(screen.getByText('Report Generator')).toBeInTheDocument();
    });
  });

  describe('reset button', () => {
    it('renders reset button when onReset is provided', () => {
      render(<TeamResult composition={mockComposition} onReset={vi.fn()} />);
      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
      expect(screen.getByTestId('reset-button')).toHaveTextContent('Try Again');
    });

    it('does not render reset button when onReset is not provided', () => {
      render(<TeamResult composition={mockComposition} />);
      expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument();
    });

    it('calls onReset when reset button is clicked', () => {
      const onReset = vi.fn();
      render(<TeamResult composition={mockComposition} onReset={onReset} />);
      fireEvent.click(screen.getByTestId('reset-button'));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('different composition data', () => {
    it('renders with different fitness score', () => {
      const composition: TeamComposition = {
        ...mockComposition,
        fitnessScore: 45,
      };
      render(<TeamResult composition={composition} />);
      expect(screen.getByTestId('team-result')).toBeInTheDocument();
    });

    it('renders with single team member', () => {
      const composition: TeamComposition = {
        ...mockComposition,
        team: [mockComposition.team[0]],
      };
      render(<TeamResult composition={composition} />);
      expect(screen.getByText('Team Members (1)')).toBeInTheDocument();
      expect(screen.getAllByTestId('team-member-card')).toHaveLength(1);
    });

    it('renders with many team members', () => {
      const composition: TeamComposition = {
        ...mockComposition,
        team: [
          ...mockComposition.team,
          { agentId: '80002:111', role: 'Tester', contribution: 'Tests', compatibilityScore: 80 },
          {
            agentId: '80002:222',
            role: 'Reviewer',
            contribution: 'Reviews',
            compatibilityScore: 75,
          },
        ],
      };
      render(<TeamResult composition={composition} />);
      expect(screen.getByText('Team Members (5)')).toBeInTheDocument();
      expect(screen.getAllByTestId('team-member-card')).toHaveLength(5);
    });

    it('renders with different task', () => {
      const composition: TeamComposition = {
        ...mockComposition,
        task: 'Create a multi-agent code review system',
      };
      render(<TeamResult composition={composition} />);
      expect(screen.getByTestId('task-description')).toHaveTextContent(
        'Create a multi-agent code review system',
      );
    });

    it('renders with different reasoning', () => {
      const composition: TeamComposition = {
        ...mockComposition,
        reasoning: 'Custom reasoning text for the team composition.',
      };
      render(<TeamResult composition={composition} />);
      expect(screen.getByTestId('ai-reasoning')).toHaveTextContent(
        'Custom reasoning text for the team composition.',
      );
    });
  });

  describe('styling', () => {
    it('applies grid layout to team members', () => {
      render(<TeamResult composition={mockComposition} />);
      const grid = screen.getByTestId('team-members-grid');
      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('applies hover styles to reset button', () => {
      render(<TeamResult composition={mockComposition} onReset={vi.fn()} />);
      const button = screen.getByTestId('reset-button');
      expect(button).toHaveClass('hover:bg-[var(--pixel-blue-sky)]');
    });
  });
});
