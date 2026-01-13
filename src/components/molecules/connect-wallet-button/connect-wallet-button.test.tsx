import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectWalletButton, DisconnectButton } from './connect-wallet-button';

describe('ConnectWalletButton', () => {
  describe('disconnected state', () => {
    it('shows Connect Wallet text', () => {
      render(<ConnectWalletButton address={null} status="disconnected" />);
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('shows wallet icon', () => {
      const { container } = render(<ConnectWalletButton address={null} status="disconnected" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<ConnectWalletButton address={null} status="disconnected" onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const onClick = vi.fn();
      render(
        <ConnectWalletButton address={null} status="disconnected" onClick={onClick} disabled />,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('connecting state', () => {
    it('shows Connecting... text', () => {
      render(<ConnectWalletButton address={null} status="connecting" />);
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });

    it('disables button while connecting', () => {
      render(<ConnectWalletButton address={null} status="connecting" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has pulse animation', () => {
      render(<ConnectWalletButton address={null} status="connecting" />);
      expect(screen.getByRole('button')).toHaveClass('animate-pulse');
    });

    it('handles reconnecting status', () => {
      render(<ConnectWalletButton address={null} status="reconnecting" />);
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });

  describe('connected state', () => {
    const testAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;

    it('shows truncated address', () => {
      render(<ConnectWalletButton address={testAddress} status="connected" />);
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('shows chevron icon for dropdown', () => {
      const { container } = render(
        <ConnectWalletButton address={testAddress} status="connected" />,
      );
      // ChevronDown icon
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(1);
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<ConnectWalletButton address={testAddress} status="connected" onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows wrong network state', () => {
      render(
        <ConnectWalletButton address={testAddress} status="connected" isCorrectNetwork={false} />,
      );
      expect(screen.getByText('(Wrong Network)')).toBeInTheDocument();
    });

    it('applies red border when on wrong network', () => {
      render(
        <ConnectWalletButton address={testAddress} status="connected" isCorrectNetwork={false} />,
      );
      expect(screen.getByRole('button').className).toContain('border-[var(--pixel-red-fire)]');
    });
  });

  describe('size variants', () => {
    it('applies small size', () => {
      render(<ConnectWalletButton address={null} status="disconnected" size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('h-8');
    });

    it('applies medium size by default', () => {
      render(<ConnectWalletButton address={null} status="disconnected" />);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('applies large size', () => {
      render(<ConnectWalletButton address={null} status="disconnected" size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      render(<ConnectWalletButton address={null} status="disconnected" className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });
});

describe('DisconnectButton', () => {
  it('renders disconnect text', () => {
    render(<DisconnectButton />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DisconnectButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const onClick = vi.fn();
    render(<DisconnectButton onClick={onClick} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has red text color', () => {
    render(<DisconnectButton />);
    expect(screen.getByRole('button').className).toContain('text-[var(--pixel-red-fire)]');
  });

  it('applies custom className', () => {
    render(<DisconnectButton className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
