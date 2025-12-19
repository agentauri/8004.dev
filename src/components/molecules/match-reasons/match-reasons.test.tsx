import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MatchReasons } from './match-reasons';

describe('MatchReasons', () => {
  describe('Rendering', () => {
    it('renders reasons correctly', () => {
      render(<MatchReasons reasons={['Reason 1', 'Reason 2']} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('Matched: Reason 1, Reason 2');
    });

    it('renders single reason without comma', () => {
      render(<MatchReasons reasons={['Single reason']} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('Matched: Single reason');
      expect(container.textContent).not.toContain(',');
    });

    it('renders "Matched:" label in gold color', () => {
      render(<MatchReasons reasons={['Test']} />);

      const goldSpan = screen.getByText('Matched:');
      expect(goldSpan).toHaveClass('text-pixel-gold-coin');
    });
  });

  describe('Truncation', () => {
    it('limits visible reasons to maxVisible (default 2)', () => {
      render(<MatchReasons reasons={['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4']} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('Reason 1');
      expect(container).toHaveTextContent('Reason 2');
      expect(container).not.toHaveTextContent('Reason 3');
      expect(container).not.toHaveTextContent('Reason 4');
    });

    it('shows "+N more" when reasons exceed maxVisible', () => {
      render(
        <MatchReasons reasons={['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4']} maxVisible={2} />,
      );

      expect(screen.getByText(/\+2 more/)).toBeInTheDocument();
    });

    it('respects custom maxVisible value', () => {
      render(<MatchReasons reasons={['R1', 'R2', 'R3', 'R4', 'R5']} maxVisible={3} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('R1');
      expect(container).toHaveTextContent('R2');
      expect(container).toHaveTextContent('R3');
      expect(container).not.toHaveTextContent('R4');
      expect(screen.getByText(/\+2 more/)).toBeInTheDocument();
    });

    it('does not show "+N more" when reasons <= maxVisible', () => {
      render(<MatchReasons reasons={['Reason 1', 'Reason 2']} maxVisible={2} />);

      const container = screen.getByTestId('match-reasons');
      expect(container.textContent).not.toContain('more');
    });

    it('shows all reasons when maxVisible exceeds reasons length', () => {
      render(<MatchReasons reasons={['R1', 'R2']} maxVisible={10} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('R1');
      expect(container).toHaveTextContent('R2');
      expect(container.textContent).not.toContain('more');
    });
  });

  describe('Query Highlighting', () => {
    it('highlights query terms in reasons', () => {
      render(<MatchReasons reasons={['Matches trading in description']} query="trading" />);

      const highlighted = screen.getByText('trading');
      expect(highlighted).toHaveClass('text-pixel-gold-coin');
      expect(highlighted).toHaveClass('font-medium');
    });

    it('highlights multiple occurrences of query term', () => {
      render(<MatchReasons reasons={['trading bot for trading automation']} query="trading" />);

      const highlighted = screen.getAllByText('trading');
      expect(highlighted).toHaveLength(2);
      highlighted.forEach((element) => {
        expect(element).toHaveClass('text-pixel-gold-coin');
      });
    });

    it('highlights multiple query terms', () => {
      render(<MatchReasons reasons={['Matches trading bot capabilities']} query="trading bot" />);

      expect(screen.getByText('trading')).toHaveClass('text-pixel-gold-coin');
      expect(screen.getByText('bot')).toHaveClass('text-pixel-gold-coin');
    });

    it('performs case-insensitive highlighting', () => {
      render(<MatchReasons reasons={['TRADING Bot Trading']} query="trading" />);

      const highlighted = screen.getAllByText(/trading/i);
      // Should find "TRADING" and "Trading"
      expect(highlighted.length).toBeGreaterThanOrEqual(2);
    });

    it('does not highlight when query is empty', () => {
      render(<MatchReasons reasons={['trading bot']} query="" />);

      const container = screen.getByTestId('match-reasons');
      // "Matched:" label is gold, but reasons should not be highlighted
      const goldElements = container.querySelectorAll('.text-pixel-gold-coin');
      // Only the "Matched:" label should be gold
      expect(goldElements).toHaveLength(1);
      expect(goldElements[0]).toHaveTextContent('Matched:');
    });

    it('does not highlight when query is undefined', () => {
      render(<MatchReasons reasons={['trading bot']} />);

      const container = screen.getByTestId('match-reasons');
      const goldElements = container.querySelectorAll('.text-pixel-gold-coin');
      // Only the "Matched:" label should be gold
      expect(goldElements).toHaveLength(1);
    });

    it('handles special regex characters in query', () => {
      render(<MatchReasons reasons={['Matches $price in description']} query="$price" />);

      const highlighted = screen.getByText('$price');
      expect(highlighted).toHaveClass('text-pixel-gold-coin');
    });

    it('highlights query in multiple reasons', () => {
      render(
        <MatchReasons
          reasons={['trading capabilities', 'bot trading support']}
          query="trading"
          maxVisible={2}
        />,
      );

      const highlighted = screen.getAllByText('trading');
      expect(highlighted).toHaveLength(2);
    });

    it('handles query with only whitespace that results in no valid terms', () => {
      // After trim().split(/\s+/).filter(), this becomes empty array
      render(<MatchReasons reasons={['some reason text']} query="    " />);

      const container = screen.getByTestId('match-reasons');
      // Should not highlight anything, only "Matched:" should be gold
      const goldElements = container.querySelectorAll('.text-pixel-gold-coin');
      expect(goldElements).toHaveLength(1);
      expect(goldElements[0]).toHaveTextContent('Matched:');
      expect(container).toHaveTextContent('some reason text');
    });

    it('handles query with empty strings after split', () => {
      // Query that creates empty strings when split
      render(<MatchReasons reasons={['description text']} query="   \t   \n   " />);

      const container = screen.getByTestId('match-reasons');
      // No highlighting should occur
      const goldElements = container.querySelectorAll('.text-pixel-gold-coin');
      expect(goldElements).toHaveLength(1);
      expect(container).toHaveTextContent('description text');
    });
  });

  describe('Empty State', () => {
    it('returns null when reasons array is empty', () => {
      const { container } = render(<MatchReasons reasons={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when reasons is undefined', () => {
      const { container } = render(<MatchReasons reasons={undefined as unknown as string[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<MatchReasons reasons={['Test']} className="custom-class text-lg" />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('text-lg');
    });

    it('preserves default classes when custom className is provided', () => {
      render(<MatchReasons reasons={['Test']} className="custom-class" />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveClass('text-xs');
      expect(container).toHaveClass('text-pixel-gray-500');
      expect(container).toHaveClass('custom-class');
    });

    it('renders without className prop', () => {
      render(<MatchReasons reasons={['Test']} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveClass('text-xs');
      expect(container).toHaveClass('text-pixel-gray-500');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long reason text', () => {
      const longReason =
        'This is an extremely long match reason that contains a lot of text and should still render correctly without breaking the layout or causing any issues';

      render(<MatchReasons reasons={[longReason]} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent(longReason);
    });

    it('handles reasons with special characters', () => {
      render(<MatchReasons reasons={['Special chars: @#$%^&*()[]{}|\\/<>?']} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('Special chars: @#$%^&*()[]{}|\\/<>?');
    });

    it('handles maxVisible of 1', () => {
      render(<MatchReasons reasons={['R1', 'R2', 'R3']} maxVisible={1} />);

      const container = screen.getByTestId('match-reasons');
      expect(container).toHaveTextContent('R1');
      expect(container).not.toHaveTextContent('R2');
      expect(screen.getByText(/\+2 more/)).toBeInTheDocument();
    });

    it('handles whitespace in query', () => {
      render(<MatchReasons reasons={['trading bot capabilities']} query="  trading   bot  " />);

      expect(screen.getByText('trading')).toHaveClass('text-pixel-gold-coin');
      expect(screen.getByText('bot')).toHaveClass('text-pixel-gold-coin');
    });
  });
});
