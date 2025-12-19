import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaxonomyFilter } from './taxonomy-filter';

describe('TaxonomyFilter', () => {
  describe('rendering', () => {
    it('renders with data-testid for skill type', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} />);
      expect(screen.getByTestId('taxonomy-filter-skill')).toBeInTheDocument();
    });

    it('renders with data-testid for domain type', () => {
      render(<TaxonomyFilter type="domain" selected={[]} onChange={() => {}} />);
      expect(screen.getByTestId('taxonomy-filter-domain')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TaxonomyFilter type="skill" selected={[]} onChange={() => {}} className="custom-class" />,
      );
      expect(screen.getByTestId('taxonomy-filter-skill')).toHaveClass('custom-class');
    });

    it('shows Skills title for skill type', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} />);
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('shows Domains title for domain type', () => {
      render(<TaxonomyFilter type="domain" selected={[]} onChange={() => {}} />);
      expect(screen.getByText('Domains')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('applies opacity when disabled', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} disabled />);
      expect(screen.getByTestId('taxonomy-filter-skill')).toHaveClass('opacity-50');
    });

    it('has pointer-events-none when disabled', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} disabled />);
      expect(screen.getByTestId('taxonomy-filter-skill')).toHaveClass('pointer-events-none');
    });
  });

  describe('expand/collapse', () => {
    it('is collapsed by default', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} />);
      expect(screen.queryByTestId('taxonomy-filter-skill-tree')).not.toBeInTheDocument();
    });

    it('respects defaultExpanded prop', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(screen.getByTestId('taxonomy-filter-skill-tree')).toBeInTheDocument();
    });

    it('expands when toggle clicked', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} />);
      const toggle = screen.getByTestId('taxonomy-filter-skill-toggle');

      fireEvent.click(toggle);

      expect(screen.getByTestId('taxonomy-filter-skill-tree')).toBeInTheDocument();
    });

    it('collapses when toggle clicked on expanded filter', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      const toggle = screen.getByTestId('taxonomy-filter-skill-toggle');

      fireEvent.click(toggle);

      expect(screen.queryByTestId('taxonomy-filter-skill-tree')).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('renders search input', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(screen.getByTestId('taxonomy-filter-skill-search')).toBeInTheDocument();
    });

    it('has placeholder text', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();
    });

    it('filters categories by search query', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      const search = screen.getByTestId('taxonomy-filter-skill-search');

      // NLP should be visible before search
      expect(
        screen.getByTestId('taxonomy-filter-node-natural_language_processing'),
      ).toBeInTheDocument();

      // Search for something that won't match NLP
      fireEvent.change(search, { target: { value: 'computer vision' } });

      // NLP should be hidden, Computer Vision visible
      expect(
        screen.queryByTestId('taxonomy-filter-node-natural_language_processing'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-filter-node-images_computer_vision')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('shows selection count when items selected', () => {
      render(
        <TaxonomyFilter
          type="skill"
          selected={['natural_language_processing', 'images_computer_vision']}
          onChange={() => {}}
        />,
      );
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('does not show count when nothing selected', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} />);
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('calls onChange when checkbox clicked', () => {
      const onChange = vi.fn();
      render(<TaxonomyFilter type="skill" selected={[]} onChange={onChange} defaultExpanded />);

      const checkbox = screen.getByTestId('taxonomy-filter-checkbox-natural_language_processing');
      fireEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(['natural_language_processing']);
    });

    it('removes slug from selection when unchecked', () => {
      const onChange = vi.fn();
      render(
        <TaxonomyFilter
          type="skill"
          selected={['natural_language_processing']}
          onChange={onChange}
          defaultExpanded
        />,
      );

      const checkbox = screen.getByTestId('taxonomy-filter-checkbox-natural_language_processing');
      fireEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('checkbox is checked when slug is selected', () => {
      render(
        <TaxonomyFilter
          type="skill"
          selected={['natural_language_processing']}
          onChange={() => {}}
          defaultExpanded
        />,
      );

      const checkbox = screen.getByTestId(
        'taxonomy-filter-checkbox-natural_language_processing',
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('clear selection', () => {
    it('shows clear button when items selected', () => {
      render(
        <TaxonomyFilter
          type="skill"
          selected={['natural_language_processing']}
          onChange={() => {}}
          defaultExpanded
        />,
      );
      expect(screen.getByTestId('taxonomy-filter-skill-clear')).toBeInTheDocument();
    });

    it('does not show clear button when nothing selected', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(screen.queryByTestId('taxonomy-filter-skill-clear')).not.toBeInTheDocument();
    });

    it('calls onChange with empty array when clear clicked', () => {
      const onChange = vi.fn();
      render(
        <TaxonomyFilter
          type="skill"
          selected={['natural_language_processing', 'images_computer_vision']}
          onChange={onChange}
          defaultExpanded
        />,
      );

      fireEvent.click(screen.getByTestId('taxonomy-filter-skill-clear'));

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('tree nodes', () => {
    it('renders top-level categories', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(
        screen.getByTestId('taxonomy-filter-node-natural_language_processing'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-filter-node-images_computer_vision')).toBeInTheDocument();
    });

    it('expands node to show children when expand button clicked', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);

      const expandBtn = screen.getByTestId('taxonomy-filter-expand-natural_language_processing');
      fireEvent.click(expandBtn);

      // Should now show child nodes with composite slug
      expect(
        screen.getByTestId(
          'taxonomy-filter-node-natural_language_processing/natural_language_understanding',
        ),
      ).toBeInTheDocument();
    });

    it('collapses node when expand button clicked again', () => {
      render(<TaxonomyFilter type="skill" selected={[]} onChange={() => {}} defaultExpanded />);

      const expandBtn = screen.getByTestId('taxonomy-filter-expand-natural_language_processing');
      fireEvent.click(expandBtn);
      fireEvent.click(expandBtn);

      expect(
        screen.queryByTestId(
          'taxonomy-filter-node-natural_language_processing/natural_language_understanding',
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe('domain type', () => {
    it('renders domain categories', () => {
      render(<TaxonomyFilter type="domain" selected={[]} onChange={() => {}} defaultExpanded />);
      expect(screen.getByTestId('taxonomy-filter-node-technology')).toBeInTheDocument();
      expect(screen.getByTestId('taxonomy-filter-node-healthcare')).toBeInTheDocument();
    });
  });
});
