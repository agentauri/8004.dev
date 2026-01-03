import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { IntentTemplate } from '@/types';
import { IntentCard } from './intent-card';

const mockTemplate: IntentTemplate = {
  id: 'code-review-workflow',
  name: 'Code Review Workflow',
  description: 'Automated code review with AI agents for quality assurance',
  category: 'development',
  steps: [
    {
      order: 1,
      name: 'Analyze Code',
      description: 'Analyze code for issues',
      requiredRole: 'code-analyzer',
      inputs: ['source_code'],
      outputs: ['analysis_report'],
    },
    {
      order: 2,
      name: 'Review Security',
      description: 'Check for security vulnerabilities',
      requiredRole: 'security-reviewer',
      inputs: ['analysis_report'],
      outputs: ['security_report'],
    },
  ],
  requiredRoles: ['code-analyzer', 'security-reviewer'],
};

describe('IntentCard', () => {
  describe('rendering', () => {
    it('renders the intent card', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-card')).toBeInTheDocument();
    });

    it('renders template name', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-name')).toHaveTextContent('Code Review Workflow');
    });

    it('renders template description', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-description')).toHaveTextContent(
        'Automated code review with AI agents',
      );
    });

    it('renders category badge', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-category-badge')).toHaveTextContent('development');
    });

    it('renders steps count', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-steps-count')).toHaveTextContent('Steps:2');
    });

    it('renders required roles', () => {
      render(<IntentCard template={mockTemplate} />);
      const rolesContainer = screen.getByTestId('intent-roles');
      expect(rolesContainer).toHaveTextContent('code-analyzer');
      expect(rolesContainer).toHaveTextContent('security-reviewer');
    });

    it('applies custom className', () => {
      render(<IntentCard template={mockTemplate} className="custom-class" />);
      expect(screen.getByTestId('intent-card')).toHaveClass('custom-class');
    });

    it('sets data-intent-id attribute', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-card')).toHaveAttribute(
        'data-intent-id',
        'code-review-workflow',
      );
    });
  });

  describe('category colors', () => {
    it('applies development category colors', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-category-badge')).toHaveClass(
        'text-[var(--pixel-blue-sky)]',
      );
    });

    it('applies automation category colors', () => {
      const autoTemplate = { ...mockTemplate, category: 'automation' };
      render(<IntentCard template={autoTemplate} />);
      expect(screen.getByTestId('intent-category-badge')).toHaveClass(
        'text-[var(--pixel-green-pipe)]',
      );
    });

    it('applies security category colors', () => {
      const securityTemplate = { ...mockTemplate, category: 'security' };
      render(<IntentCard template={securityTemplate} />);
      expect(screen.getByTestId('intent-category-badge')).toHaveClass(
        'text-[var(--pixel-red-fire)]',
      );
    });

    it('applies analysis category colors', () => {
      const analysisTemplate = { ...mockTemplate, category: 'data-analysis' };
      render(<IntentCard template={analysisTemplate} />);
      expect(screen.getByTestId('intent-category-badge')).toHaveClass(
        'text-[var(--pixel-gold-coin)]',
      );
    });
  });

  describe('roles truncation', () => {
    it('shows +N more when more than 4 roles', () => {
      const manyRolesTemplate = {
        ...mockTemplate,
        requiredRoles: ['role1', 'role2', 'role3', 'role4', 'role5', 'role6'],
      };
      render(<IntentCard template={manyRolesTemplate} />);
      expect(screen.getByTestId('intent-roles')).toHaveTextContent('+2 more');
    });

    it('does not show +N more when 4 or fewer roles', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-roles')).not.toHaveTextContent('+');
    });
  });

  describe('onClick behavior', () => {
    it('renders as interactive div with button role when onClick is provided', () => {
      const onClick = vi.fn();
      render(<IntentCard template={mockTemplate} onClick={onClick} />);
      const card = screen.getByTestId('intent-card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<IntentCard template={mockTemplate} onClick={onClick} />);
      fireEvent.click(screen.getByTestId('intent-card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Enter key', () => {
      const onClick = vi.fn();
      render(<IntentCard template={mockTemplate} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('intent-card'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key', () => {
      const onClick = vi.fn();
      render(<IntentCard template={mockTemplate} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('intent-card'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys', () => {
      const onClick = vi.fn();
      render(<IntentCard template={mockTemplate} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('intent-card'), { key: 'Tab' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not have button role without onClick', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-card')).not.toHaveAttribute('role');
    });
  });

  describe('styling', () => {
    it('applies hover styles', () => {
      render(<IntentCard template={mockTemplate} />);
      const card = screen.getByTestId('intent-card');
      expect(card).toHaveClass('hover:translate-y-[-2px]');
      expect(card).toHaveClass('hover:border-[var(--pixel-blue-sky)]');
    });

    it('applies base border color', () => {
      render(<IntentCard template={mockTemplate} />);
      expect(screen.getByTestId('intent-card')).toHaveClass('border-[var(--pixel-gray-700)]');
    });
  });
});
