import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExportDialog } from './export-dialog';

// Mock the export utilities
vi.mock('@/lib/export', () => ({
  downloadCsv: vi.fn(),
  downloadJson: vi.fn(),
  CSV_PRESETS: {
    bookmarks: { columns: ['agentId', 'name'], columnLabels: {} },
    agents: { columns: ['id', 'name'], columnLabels: {} },
    agentDetails: { columns: ['id', 'name', 'description'], columnLabels: {} },
  },
  JSON_PRESETS: {
    bookmarks: { wrapperKey: 'bookmarks', metadata: { version: '1.0' } },
    agents: { wrapperKey: 'agents', metadata: { version: '1.0' } },
    agentDetails: { wrapperKey: 'agent', metadata: { version: '1.0' } },
  },
}));

import { downloadCsv, downloadJson } from '@/lib/export';

const mockDownloadCsv = downloadCsv as ReturnType<typeof vi.fn>;
const mockDownloadJson = downloadJson as ReturnType<typeof vi.fn>;

describe('ExportDialog', () => {
  const mockData = [
    { id: '1', name: 'Agent A', chainId: 11155111 },
    { id: '2', name: 'Agent B', chainId: 84532 },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    data: mockData,
    filename: 'test-export',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByTestId('export-dialog')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<ExportDialog {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('export-dialog')).not.toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<ExportDialog {...defaultProps} title="Export Agents" />);
      expect(screen.getByText('Export Agents')).toBeInTheDocument();
    });

    it('displays item count', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('items to export')).toBeInTheDocument();
    });

    it('renders format selection buttons', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByTestId('format-csv')).toBeInTheDocument();
      expect(screen.getByTestId('format-json')).toBeInTheDocument();
    });
  });

  describe('format selection', () => {
    it('selects CSV by default', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByTestId('format-csv')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('format-json')).toHaveAttribute('aria-pressed', 'false');
    });

    it('switches to JSON format', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('format-json'));
      expect(screen.getByTestId('format-json')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('format-csv')).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows CSV options when CSV is selected', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByTestId('include-headers-checkbox')).toBeInTheDocument();
      expect(screen.queryByTestId('pretty-print-checkbox')).not.toBeInTheDocument();
    });

    it('shows JSON options when JSON is selected', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('format-json'));
      expect(screen.getByTestId('pretty-print-checkbox')).toBeInTheDocument();
      expect(screen.queryByTestId('include-headers-checkbox')).not.toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('toggles include headers option', () => {
      render(<ExportDialog {...defaultProps} />);
      const checkbox = screen.getByTestId('include-headers-checkbox') as HTMLInputElement;

      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('toggles pretty print option', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('format-json'));
      const checkbox = screen.getByTestId('pretty-print-checkbox') as HTMLInputElement;

      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('export functionality', () => {
    it('calls downloadCsv when exporting CSV', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('export-dialog-download'));

      expect(mockDownloadCsv).toHaveBeenCalledTimes(1);
      expect(mockDownloadCsv).toHaveBeenCalledWith(
        mockData,
        expect.stringContaining('test-export'),
        expect.objectContaining({ includeHeaders: true }),
      );
    });

    it('calls downloadJson when exporting JSON', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('format-json'));
      fireEvent.click(screen.getByTestId('export-dialog-download'));

      expect(mockDownloadJson).toHaveBeenCalledTimes(1);
      expect(mockDownloadJson).toHaveBeenCalledWith(
        mockData,
        expect.stringContaining('test-export'),
        expect.objectContaining({ prettyPrint: true }),
      );
    });

    it('includes date in filename', () => {
      render(<ExportDialog {...defaultProps} />);
      fireEvent.click(screen.getByTestId('export-dialog-download'));

      const filenameArg = mockDownloadCsv.mock.calls[0][1];
      expect(filenameArg).toMatch(/test-export-\d{4}-\d{2}-\d{2}/);
    });

    it('uses bookmarks preset when specified', () => {
      render(<ExportDialog {...defaultProps} presetType="bookmarks" />);
      fireEvent.click(screen.getByTestId('export-dialog-download'));

      expect(mockDownloadCsv).toHaveBeenCalledWith(
        mockData,
        expect.any(String),
        expect.objectContaining({ columns: ['agentId', 'name'] }),
      );
    });

    it('closes dialog after export', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('export-dialog-download'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('disables download button when no data', () => {
      render(<ExportDialog {...defaultProps} data={[]} />);
      const downloadButton = screen.getByTestId('export-dialog-download');
      expect(downloadButton).toBeDisabled();
    });

    it('does not export when no data', () => {
      render(<ExportDialog {...defaultProps} data={[]} />);
      fireEvent.click(screen.getByTestId('export-dialog-download'));
      expect(mockDownloadCsv).not.toHaveBeenCalled();
      expect(mockDownloadJson).not.toHaveBeenCalled();
    });
  });

  describe('closing behavior', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('export-dialog-close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('export-dialog-cancel'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('export-dialog-backdrop'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when dialog content is clicked', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('export-dialog'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(<ExportDialog {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('body scroll lock', () => {
    it('locks body scroll when open', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body scroll when closed', () => {
      const { rerender } = render(<ExportDialog {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      rerender(<ExportDialog {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('');
    });

    it('unlocks body scroll on unmount', () => {
      const { unmount } = render(<ExportDialog {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has proper aria attributes', () => {
      render(<ExportDialog {...defaultProps} />);
      const dialog = screen.getByTestId('export-dialog');

      expect(dialog).toHaveAttribute('role', 'dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'export-dialog-title');
    });

    it('close button has aria-label', () => {
      render(<ExportDialog {...defaultProps} />);
      expect(screen.getByTestId('export-dialog-close')).toHaveAttribute(
        'aria-label',
        'Close dialog',
      );
    });
  });
});
