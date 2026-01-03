import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TeamMember } from '@/types';
import { TeamMemberCard } from './team-member-card';

const mockMember: TeamMember = {
  agentId: '11155111:123',
  role: 'Code Analyzer',
  contribution: 'Analyzes smart contract code for vulnerabilities and security issues',
  compatibilityScore: 92,
};

describe('TeamMemberCard', () => {
  describe('rendering', () => {
    it('renders the team member card', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByTestId('team-member-card')).toBeInTheDocument();
    });

    it('displays the role', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByText('Code Analyzer')).toBeInTheDocument();
    });

    it('displays the agent ID', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByText('11155111:123')).toBeInTheDocument();
    });

    it('displays the contribution', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(
        screen.getByText('Analyzes smart contract code for vulnerabilities and security issues'),
      ).toBeInTheDocument();
    });

    it('displays compatibility label', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByText('Compatibility')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TeamMemberCard member={mockMember} className="custom-class" />);
      expect(screen.getByTestId('team-member-card')).toHaveClass('custom-class');
    });

    it('sets data-agent-id attribute', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByTestId('team-member-card')).toHaveAttribute(
        'data-agent-id',
        '11155111:123',
      );
    });
  });

  describe('role badge styling', () => {
    it('displays role with uppercase styling', () => {
      render(<TeamMemberCard member={mockMember} />);
      const roleElement = screen.getByText('Code Analyzer');
      expect(roleElement).toHaveClass('uppercase');
    });

    it('displays role with correct background color class', () => {
      render(<TeamMemberCard member={mockMember} />);
      const roleElement = screen.getByText('Code Analyzer');
      expect(roleElement).toHaveClass('bg-[var(--pixel-blue-sky)]/20');
    });
  });

  describe('link behavior (without onViewAgent)', () => {
    it('renders as Link without onViewAgent', () => {
      render(<TeamMemberCard member={mockMember} />);
      const card = screen.getByTestId('team-member-card');
      expect(card.tagName).toBe('A');
    });

    it('has correct href', () => {
      render(<TeamMemberCard member={mockMember} />);
      const card = screen.getByTestId('team-member-card');
      expect(card).toHaveAttribute('href', '/agent/11155111:123');
    });
  });

  describe('onClick behavior (with onViewAgent)', () => {
    it('renders as div with button role when onViewAgent is provided', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      const card = screen.getByTestId('team-member-card');
      expect(card.tagName).toBe('DIV');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('calls onViewAgent when clicked', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      fireEvent.click(screen.getByTestId('team-member-card'));
      expect(onViewAgent).toHaveBeenCalledWith('11155111:123');
    });

    it('calls onViewAgent on Enter key', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      fireEvent.keyDown(screen.getByTestId('team-member-card'), { key: 'Enter' });
      expect(onViewAgent).toHaveBeenCalledWith('11155111:123');
    });

    it('calls onViewAgent on Space key', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      fireEvent.keyDown(screen.getByTestId('team-member-card'), { key: ' ' });
      expect(onViewAgent).toHaveBeenCalledWith('11155111:123');
    });

    it('ignores other keys', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      fireEvent.keyDown(screen.getByTestId('team-member-card'), { key: 'Tab' });
      expect(onViewAgent).not.toHaveBeenCalled();
    });

    it('has tabIndex when onViewAgent is provided', () => {
      const onViewAgent = vi.fn();
      render(<TeamMemberCard member={mockMember} onViewAgent={onViewAgent} />);
      expect(screen.getByTestId('team-member-card')).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('different member data', () => {
    it('renders different roles', () => {
      const member: TeamMember = {
        ...mockMember,
        role: 'Security Expert',
      };
      render(<TeamMemberCard member={member} />);
      expect(screen.getByText('Security Expert')).toBeInTheDocument();
    });

    it('renders different agent IDs', () => {
      const member: TeamMember = {
        ...mockMember,
        agentId: '84532:456',
      };
      render(<TeamMemberCard member={member} />);
      expect(screen.getByText('84532:456')).toBeInTheDocument();
    });

    it('renders different contributions', () => {
      const member: TeamMember = {
        ...mockMember,
        contribution: 'Provides security recommendations and best practices',
      };
      render(<TeamMemberCard member={member} />);
      expect(
        screen.getByText('Provides security recommendations and best practices'),
      ).toBeInTheDocument();
    });

    it('renders with low compatibility score', () => {
      const member: TeamMember = {
        ...mockMember,
        compatibilityScore: 45,
      };
      render(<TeamMemberCard member={member} />);
      expect(screen.getByTestId('team-member-card')).toBeInTheDocument();
    });

    it('renders with high compatibility score', () => {
      const member: TeamMember = {
        ...mockMember,
        compatibilityScore: 98,
      };
      render(<TeamMemberCard member={member} />);
      expect(screen.getByTestId('team-member-card')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies hover styles', () => {
      render(<TeamMemberCard member={mockMember} />);
      const card = screen.getByTestId('team-member-card');
      expect(card).toHaveClass('hover:translate-y-[-2px]');
      expect(card).toHaveClass('hover:border-[var(--pixel-blue-sky)]');
    });

    it('applies base border color', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByTestId('team-member-card')).toHaveClass('border-[var(--pixel-gray-700)]');
    });

    it('applies cursor pointer', () => {
      render(<TeamMemberCard member={mockMember} />);
      expect(screen.getByTestId('team-member-card')).toHaveClass('cursor-pointer');
    });
  });

  describe('long content handling', () => {
    it('truncates long contributions with line-clamp', () => {
      const member: TeamMember = {
        ...mockMember,
        contribution:
          'This is a very long contribution text that should be truncated to three lines. It contains extensive details about what this agent does and how it contributes to the team goal. This extra text ensures we test the line clamping properly.',
      };
      render(<TeamMemberCard member={member} />);
      const contribution = screen.getByText(/This is a very long contribution/);
      expect(contribution).toHaveClass('line-clamp-3');
    });
  });
});
