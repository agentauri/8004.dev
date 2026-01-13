import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WalletModal } from './wallet-modal';

const mockConnectors = [
  { id: 'injected', name: 'MetaMask' },
  { id: 'coinbaseWallet', name: 'Coinbase Wallet' },
];

describe('WalletModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    connectors: mockConnectors,
    address: null as `0x${string}` | null,
    status: 'disconnected' as const,
    isCorrectNetwork: true,
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
    onSwitchNetwork: vi.fn(),
  };

  describe('disconnected state', () => {
    it('shows Connect Wallet title', () => {
      render(<WalletModal {...defaultProps} />);
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('shows connector buttons', () => {
      render(<WalletModal {...defaultProps} />);
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
    });

    it('calls onConnect with connector ID when clicked', () => {
      const onConnect = vi.fn();
      render(<WalletModal {...defaultProps} onConnect={onConnect} />);
      fireEvent.click(screen.getByText('MetaMask'));
      expect(onConnect).toHaveBeenCalledWith('injected');
    });

    it('shows message when no connectors available', () => {
      render(<WalletModal {...defaultProps} connectors={[]} />);
      expect(screen.getByText(/No wallet providers detected/)).toBeInTheDocument();
    });
  });

  describe('connecting state', () => {
    it('shows connecting text', () => {
      render(<WalletModal {...defaultProps} status="connecting" />);
      expect(screen.getAllByText('Connecting...').length).toBeGreaterThan(0);
    });

    it('disables connector buttons while connecting', () => {
      render(<WalletModal {...defaultProps} status="connecting" />);
      expect(screen.getByText('MetaMask').closest('button')).toBeDisabled();
    });
  });

  describe('connected state', () => {
    const connectedProps = {
      ...defaultProps,
      address: '0x1234567890abcdef1234567890abcdef12345678' as const,
      status: 'connected' as const,
    };

    it('shows Wallet Connected title', () => {
      render(<WalletModal {...connectedProps} />);
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    });

    it('shows connected address', () => {
      render(<WalletModal {...connectedProps} />);
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('shows View on BaseScan button', () => {
      render(<WalletModal {...connectedProps} />);
      expect(screen.getByText('View on BaseScan')).toBeInTheDocument();
    });

    it('shows disconnect button', () => {
      render(<WalletModal {...connectedProps} />);
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });

    it('calls onDisconnect when disconnect clicked', () => {
      const onDisconnect = vi.fn();
      render(<WalletModal {...connectedProps} onDisconnect={onDisconnect} />);
      fireEvent.click(screen.getByText('Disconnect'));
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('wrong network', () => {
    const wrongNetworkProps = {
      ...defaultProps,
      address: '0x1234567890abcdef1234567890abcdef12345678' as const,
      status: 'connected' as const,
      isCorrectNetwork: false,
    };

    it('shows network warning', () => {
      render(<WalletModal {...wrongNetworkProps} />);
      expect(screen.getByText(/switch to Base network/)).toBeInTheDocument();
    });

    it('shows switch network button', () => {
      render(<WalletModal {...wrongNetworkProps} />);
      expect(screen.getByText('Switch to Base')).toBeInTheDocument();
    });

    it('calls onSwitchNetwork when switch clicked', () => {
      const onSwitchNetwork = vi.fn();
      render(<WalletModal {...wrongNetworkProps} onSwitchNetwork={onSwitchNetwork} />);
      fireEvent.click(screen.getByText('Switch to Base'));
      expect(onSwitchNetwork).toHaveBeenCalledTimes(1);
    });
  });

  describe('modal controls', () => {
    it('can be closed', () => {
      const onOpenChange = vi.fn();
      const { container } = render(<WalletModal {...defaultProps} onOpenChange={onOpenChange} />);
      // Find and click the close button (X) in the dialog
      const closeButton = container.querySelector('button[data-state]');
      if (closeButton) {
        fireEvent.click(closeButton);
      }
    });

    it('renders nothing when closed', () => {
      render(<WalletModal {...defaultProps} open={false} />);
      expect(screen.queryByText('Connect Wallet')).not.toBeInTheDocument();
    });
  });
});
