import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaxonomySection } from './taxonomy-section';

describe('TaxonomySection', () => {
  describe('rendering', () => {
    it('renders with data-testid', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByTestId('taxonomy-section')).toBeInTheDocument();
    });

    it('returns null when no data', () => {
      const { container } = render(<TaxonomySection />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when empty arrays', () => {
      const { container } = render(<TaxonomySection skills={[]} domains={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom className', () => {
      render(<TaxonomySection skills={['natural_language_processing']} className="custom-class" />);
      expect(screen.getByTestId('taxonomy-section')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('shows loading skeleton when isLoading', () => {
      render(<TaxonomySection isLoading />);
      expect(screen.getByTestId('taxonomy-section-loading')).toBeInTheDocument();
    });

    it('loading skeleton has animate-pulse', () => {
      render(<TaxonomySection isLoading />);
      const loading = screen.getByTestId('taxonomy-section-loading');
      const skeletons = loading.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(2);
    });
  });

  describe('skills section', () => {
    it('renders skills section when skills provided', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByTestId('taxonomy-section-skill')).toBeInTheDocument();
    });

    it('does not render skills section when no skills', () => {
      render(<TaxonomySection domains={['technology']} />);
      expect(screen.queryByTestId('taxonomy-section-skill')).not.toBeInTheDocument();
    });

    it('shows skill count', () => {
      render(<TaxonomySection skills={['natural_language_processing', 'computer_vision']} />);
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('renders skill tags', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    });
  });

  describe('domains section', () => {
    it('renders domains section when domains provided', () => {
      render(<TaxonomySection domains={['technology']} />);
      expect(screen.getByTestId('taxonomy-section-domain')).toBeInTheDocument();
    });

    it('does not render domains section when no domains', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.queryByTestId('taxonomy-section-domain')).not.toBeInTheDocument();
    });

    it('shows domain count', () => {
      render(<TaxonomySection domains={['technology', 'healthcare', 'finance']} />);
      expect(screen.getByText('(3)')).toBeInTheDocument();
    });

    it('renders domain tags', () => {
      render(<TaxonomySection domains={['technology']} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });

  describe('collapsible sections', () => {
    it('sections are expanded by default', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByTestId('taxonomy-section-skill-content')).toBeInTheDocument();
    });

    it('collapses section when toggle clicked', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      const toggle = screen.getByTestId('taxonomy-section-skill-toggle');

      fireEvent.click(toggle);

      expect(screen.queryByTestId('taxonomy-section-skill-content')).not.toBeInTheDocument();
    });

    it('expands section when toggle clicked again', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      const toggle = screen.getByTestId('taxonomy-section-skill-toggle');

      fireEvent.click(toggle);
      fireEvent.click(toggle);

      expect(screen.getByTestId('taxonomy-section-skill-content')).toBeInTheDocument();
    });

    it('toggle has aria-expanded attribute', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      const toggle = screen.getByTestId('taxonomy-section-skill-toggle');

      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('grouping', () => {
    it('groups child slugs under parent', () => {
      render(
        <TaxonomySection
          skills={[
            'natural_language_processing/natural_language_understanding',
            'natural_language_processing/natural_language_generation',
          ]}
        />,
      );

      // Parent name should appear as group header
      expect(screen.getByText('Natural Language Processing')).toBeInTheDocument();
    });

    it('shows expandable group for categories with children', () => {
      render(
        <TaxonomySection
          skills={[
            'natural_language_processing/natural_language_understanding',
            'natural_language_processing/natural_language_generation',
          ]}
        />,
      );

      expect(
        screen.getByTestId('taxonomy-group-toggle-natural_language_processing'),
      ).toBeInTheDocument();
    });
  });

  describe('both skills and domains', () => {
    it('renders both sections when both provided', () => {
      render(<TaxonomySection skills={['natural_language_processing']} domains={['technology']} />);

      expect(screen.getByTestId('taxonomy-section-skill')).toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-section-domain')).toBeInTheDocument();
    });

    it('skills section appears before domains', () => {
      render(<TaxonomySection skills={['natural_language_processing']} domains={['technology']} />);

      const section = screen.getByTestId('taxonomy-section');
      const children = section.children;

      expect(within(children[0] as HTMLElement).getByText('Skills')).toBeInTheDocument();
      expect(within(children[1] as HTMLElement).getByText('Domains')).toBeInTheDocument();
    });
  });

  describe('unknown slugs', () => {
    it('handles unknown skill slugs gracefully', () => {
      render(<TaxonomySection skills={['unknown_skill']} />);
      expect(screen.getByText('Unknown Skill')).toBeInTheDocument();
    });

    it('handles unknown domain slugs gracefully', () => {
      render(<TaxonomySection domains={['unknown_domain']} />);
      expect(screen.getByText('Unknown Domain')).toBeInTheDocument();
    });

    it('handles unknown nested slugs', () => {
      render(<TaxonomySection skills={['parent/unknown_child']} />);
      // Unknown nested slugs are grouped under parent - expand the group first
      const groupToggle = screen.getByTestId('taxonomy-group-toggle-parent');
      fireEvent.click(groupToggle);
      expect(screen.getByText('Unknown Child')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('section toggles are buttons', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByTestId('taxonomy-section-skill-toggle').tagName).toBe('BUTTON');
    });

    it('section toggles have type="button"', () => {
      render(<TaxonomySection skills={['natural_language_processing']} />);
      expect(screen.getByTestId('taxonomy-section-skill-toggle')).toHaveAttribute('type', 'button');
    });
  });
});
