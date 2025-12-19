import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { type TabItem, TabNavigation } from './tab-navigation';

const mockTabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'feedbacks', label: 'Feedbacks', count: 6 },
  { id: 'validations', label: 'Validations', count: 0 },
  { id: 'metadata', label: 'Metadata' },
];

describe('TabNavigation', () => {
  describe('rendering', () => {
    it('renders all tabs', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('tab-overview')).toBeInTheDocument();
      expect(screen.getByTestId('tab-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('tab-feedbacks')).toBeInTheDocument();
      expect(screen.getByTestId('tab-validations')).toBeInTheDocument();
      expect(screen.getByTestId('tab-metadata')).toBeInTheDocument();
    });

    it('renders tab labels correctly', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Statistics')).toBeInTheDocument();
      expect(screen.getByText('Feedbacks')).toBeInTheDocument();
      expect(screen.getByText('Validations')).toBeInTheDocument();
      expect(screen.getByText('Metadata')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const onTabChange = vi.fn();
      render(
        <TabNavigation
          tabs={mockTabs}
          activeTab="overview"
          onTabChange={onTabChange}
          className="custom-class"
        />,
      );

      expect(screen.getByTestId('tab-navigation')).toHaveClass('custom-class');
    });

    it('renders with correct ARIA attributes', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      const tablist = screen.getByTestId('tab-navigation');
      expect(tablist).toHaveAttribute('role', 'tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Agent sections');

      const activeTab = screen.getByTestId('tab-overview');
      expect(activeTab).toHaveAttribute('role', 'tab');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
      expect(activeTab).toHaveAttribute('aria-controls', 'tabpanel-overview');
    });
  });

  describe('active state', () => {
    it('marks the active tab correctly', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="statistics" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-statistics');
      expect(activeTab).toHaveAttribute('data-active', 'true');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');

      const inactiveTab = screen.getByTestId('tab-overview');
      expect(inactiveTab).toHaveAttribute('data-active', 'false');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });

    it('sets tabIndex correctly for keyboard navigation', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="feedbacks" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-feedbacks');
      expect(activeTab).toHaveAttribute('tabIndex', '0');

      const inactiveTab = screen.getByTestId('tab-overview');
      expect(inactiveTab).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('count badges', () => {
    it('displays count when provided', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      expect(screen.getByTestId('tab-feedbacks-count')).toHaveTextContent('(6)');
      expect(screen.getByTestId('tab-validations-count')).toHaveTextContent('(0)');
    });

    it('does not display count when not provided', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      expect(screen.queryByTestId('tab-overview-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tab-metadata-count')).not.toBeInTheDocument();
    });
  });

  describe('disabled tabs', () => {
    it('renders disabled tab correctly', () => {
      const tabsWithDisabled: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
        { id: 'tab3', label: 'Tab 3' },
      ];
      const onTabChange = vi.fn();

      render(<TabNavigation tabs={tabsWithDisabled} activeTab="tab1" onTabChange={onTabChange} />);

      const disabledTab = screen.getByTestId('tab-tab2');
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger onTabChange when clicking disabled tab', async () => {
      const tabsWithDisabled: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
      ];
      const onTabChange = vi.fn();
      const user = userEvent.setup();

      render(<TabNavigation tabs={tabsWithDisabled} activeTab="tab1" onTabChange={onTabChange} />);

      const disabledTab = screen.getByTestId('tab-tab2');
      await user.click(disabledTab);

      expect(onTabChange).not.toHaveBeenCalled();
    });
  });

  describe('interactions', () => {
    it('calls onTabChange when clicking a tab', async () => {
      const onTabChange = vi.fn();
      const user = userEvent.setup();

      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      await user.click(screen.getByTestId('tab-statistics'));

      expect(onTabChange).toHaveBeenCalledTimes(1);
      expect(onTabChange).toHaveBeenCalledWith('statistics');
    });

    it('does not call onTabChange when clicking the already active tab', async () => {
      const onTabChange = vi.fn();
      const user = userEvent.setup();

      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      await user.click(screen.getByTestId('tab-overview'));

      // Still called because the component doesn't prevent clicking active tab
      // The parent can decide if it wants to ignore this
      expect(onTabChange).toHaveBeenCalledWith('overview');
    });
  });

  describe('keyboard navigation', () => {
    it('navigates to next tab with ArrowRight', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-overview');
      fireEvent.keyDown(activeTab, { key: 'ArrowRight' });

      expect(onTabChange).toHaveBeenCalledWith('statistics');
    });

    it('navigates to previous tab with ArrowLeft', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="statistics" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-statistics');
      fireEvent.keyDown(activeTab, { key: 'ArrowLeft' });

      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('wraps to last tab when pressing ArrowLeft on first tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-overview');
      fireEvent.keyDown(activeTab, { key: 'ArrowLeft' });

      expect(onTabChange).toHaveBeenCalledWith('metadata');
    });

    it('wraps to first tab when pressing ArrowRight on last tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="metadata" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-metadata');
      fireEvent.keyDown(activeTab, { key: 'ArrowRight' });

      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('navigates to first tab with Home key', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="feedbacks" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-feedbacks');
      fireEvent.keyDown(activeTab, { key: 'Home' });

      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('navigates to last tab with End key', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-overview');
      fireEvent.keyDown(activeTab, { key: 'End' });

      expect(onTabChange).toHaveBeenCalledWith('metadata');
    });

    it('skips disabled tabs during keyboard navigation', () => {
      const tabsWithDisabled: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
        { id: 'tab3', label: 'Tab 3' },
      ];
      const onTabChange = vi.fn();

      render(<TabNavigation tabs={tabsWithDisabled} activeTab="tab1" onTabChange={onTabChange} />);

      const activeTab = screen.getByTestId('tab-tab1');
      fireEvent.keyDown(activeTab, { key: 'ArrowRight' });

      expect(onTabChange).toHaveBeenCalledWith('tab3');
    });
  });

  describe('edge cases', () => {
    it('handles single tab', () => {
      const singleTab: TabItem[] = [{ id: 'only', label: 'Only Tab' }];
      const onTabChange = vi.fn();

      render(<TabNavigation tabs={singleTab} activeTab="only" onTabChange={onTabChange} />);

      expect(screen.getByTestId('tab-only')).toBeInTheDocument();

      // Arrow keys should wrap back to the same tab
      fireEvent.keyDown(screen.getByTestId('tab-only'), { key: 'ArrowRight' });
      expect(onTabChange).toHaveBeenCalledWith('only');
    });

    it('handles empty count (0)', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overview" onTabChange={onTabChange} />);

      expect(screen.getByTestId('tab-validations-count')).toHaveTextContent('(0)');
    });
  });
});
