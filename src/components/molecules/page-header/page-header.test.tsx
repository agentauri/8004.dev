import { render, screen } from '@testing-library/react';
import { FlaskConical, MessageSquare, Trophy, Users, Workflow } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  describe('rendering', () => {
    it('renders title in uppercase', () => {
      render(<PageHeader title="Test Title" icon={Trophy} />);

      const title = screen.getByTestId('page-header-title');
      expect(title).toHaveTextContent('Test Title');
      expect(title).toHaveClass('uppercase');
    });

    it('renders icon', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      expect(screen.getByTestId('page-header-icon')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(<PageHeader title="Test" icon={Trophy} description="Test description" />);

      expect(screen.getByTestId('page-header-description')).toHaveTextContent('Test description');
    });

    it('does not render description when not provided', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      expect(screen.queryByTestId('page-header-description')).not.toBeInTheDocument();
    });

    it('renders action when provided', () => {
      render(
        <PageHeader title="Test" icon={Trophy} action={<button type="button">Action</button>} />,
      );

      expect(screen.getByTestId('page-header-action')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('does not render action when not provided', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      expect(screen.queryByTestId('page-header-action')).not.toBeInTheDocument();
    });
  });

  describe('color variants', () => {
    it('applies blue color to icon by default', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      const icon = screen.getByTestId('page-header-icon');
      expect(icon).toHaveClass('text-[var(--pixel-blue-sky)]');
    });

    it('applies gold color to icon when glow="gold"', () => {
      render(<PageHeader title="Test" icon={Trophy} glow="gold" />);

      const icon = screen.getByTestId('page-header-icon');
      expect(icon).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies green color to icon when glow="green"', () => {
      render(<PageHeader title="Test" icon={Trophy} glow="green" />);

      const icon = screen.getByTestId('page-header-icon');
      expect(icon).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('sets aria-hidden on icon', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      const icon = screen.getByTestId('page-header-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('alignment', () => {
    it('aligns left by default', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      const header = screen.getByTestId('page-header');
      expect(header).not.toHaveClass('text-center');
    });

    it('centers content when align="center"', () => {
      render(<PageHeader title="Test" icon={Trophy} align="center" />);

      const header = screen.getByTestId('page-header');
      expect(header).toHaveClass('text-center');
    });

    it('applies max-w-2xl to description when left-aligned', () => {
      render(<PageHeader title="Test" icon={Trophy} description="Test description" />);

      const description = screen.getByTestId('page-header-description');
      expect(description).toHaveClass('max-w-2xl');
    });

    it('does not apply max-w-2xl to description when centered', () => {
      render(
        <PageHeader title="Test" icon={Trophy} description="Test description" align="center" />,
      );

      const description = screen.getByTestId('page-header-description');
      expect(description).not.toHaveClass('max-w-2xl');
    });
  });

  describe('accessibility', () => {
    it('uses semantic header element', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      const header = screen.getByTestId('page-header');
      expect(header.tagName).toBe('HEADER');
    });

    it('renders h1 for page title', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Test');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<PageHeader title="Test" icon={Trophy} className="mb-8" />);

      const header = screen.getByTestId('page-header');
      expect(header).toHaveClass('mb-8');
    });
  });

  describe('testId', () => {
    it('uses default testId', () => {
      render(<PageHeader title="Test" icon={Trophy} />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('page-header-icon')).toBeInTheDocument();
    });

    it('uses custom testId', () => {
      render(<PageHeader title="Test" icon={Trophy} testId="custom-header" />);

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-icon')).toBeInTheDocument();
    });
  });

  describe('real-world examples', () => {
    it('renders Leaderboard header correctly', () => {
      render(
        <PageHeader
          title="Leaderboard"
          description="Top agents ranked by reputation score."
          icon={Trophy}
          glow="gold"
        />,
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Leaderboard');
      expect(screen.getByTestId('page-header-description')).toHaveTextContent(
        'Top agents ranked by reputation score.',
      );
      expect(screen.getByTestId('page-header-icon')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('renders Feedbacks header correctly', () => {
      render(
        <PageHeader
          title="Global Feedbacks"
          description="Browse all on-chain feedbacks."
          icon={MessageSquare}
          glow="blue"
        />,
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Global Feedbacks');
      expect(screen.getByTestId('page-header-icon')).toHaveClass('text-[var(--pixel-blue-sky)]');
    });

    it('renders Evaluate header with action correctly', () => {
      render(
        <PageHeader
          title="Evaluations"
          description="Agent benchmark results."
          icon={FlaskConical}
          glow="blue"
          action={<button type="button">+ New Evaluation</button>}
        />,
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Evaluations');
      expect(screen.getByRole('button', { name: '+ New Evaluation' })).toBeInTheDocument();
    });

    it('renders Compose header centered correctly', () => {
      render(
        <PageHeader
          title="Team Composer"
          description="Build the perfect agent team."
          icon={Users}
          glow="gold"
          align="center"
        />,
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Team Composer');
      expect(screen.getByTestId('page-header')).toHaveClass('text-center');
    });

    it('renders Intents header correctly', () => {
      render(
        <PageHeader
          title="Intent Templates"
          description="Browse workflow templates."
          icon={Workflow}
          glow="blue"
        />,
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Intent Templates');
    });
  });
});
