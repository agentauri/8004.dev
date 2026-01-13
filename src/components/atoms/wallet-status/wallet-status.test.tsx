import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WalletStatus } from './wallet-status';

describe('WalletStatus', () => {
  describe('disconnected state', () => {
    it('shows disconnected status', () => {
      render(<WalletStatus address={null} status="disconnected" />);
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('has gray indicator dot', () => {
      const { container } = render(<WalletStatus address={null} status="disconnected" />);
      const dot = container.querySelector('span.bg-pixel-gray-500');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('connecting state', () => {
    it('shows connecting status', () => {
      render(<WalletStatus address={null} status="connecting" />);
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });

    it('has gold animated indicator', () => {
      const { container } = render(<WalletStatus address={null} status="connecting" />);
      const dot = container.querySelector('span.bg-pixel-gold-coin.animate-pulse');
      expect(dot).toBeInTheDocument();
    });

    it('shows connecting for reconnecting status', () => {
      render(<WalletStatus address={null} status="reconnecting" />);
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });

  describe('connected state', () => {
    const testAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;

    it('shows truncated address', () => {
      render(<WalletStatus address={testAddress} status="connected" />);
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('has green indicator when on correct network', () => {
      const { container } = render(
        <WalletStatus address={testAddress} status="connected" isCorrectNetwork={true} />,
      );
      const dot = container.querySelector('span.bg-pixel-green-pipe');
      expect(dot).toBeInTheDocument();
    });

    it('has red indicator when on wrong network', () => {
      const { container } = render(
        <WalletStatus address={testAddress} status="connected" isCorrectNetwork={false} />,
      );
      const dot = container.querySelector('span.bg-pixel-red-fire');
      expect(dot).toBeInTheDocument();
    });

    it('shows wrong network warning', () => {
      render(<WalletStatus address={testAddress} status="connected" isCorrectNetwork={false} />);
      expect(screen.getByText('(Wrong Network)')).toBeInTheDocument();
    });

    it('shows Connected when address is null but status is connected', () => {
      render(<WalletStatus address={null} status="connected" />);
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <WalletStatus address={null} status="disconnected" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
