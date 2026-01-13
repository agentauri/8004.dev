import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { X402PaymentDetails } from '@/types/x402';
import { PaymentModal } from './payment-modal';

const mockPaymentDetails: X402PaymentDetails = {
  x402Version: 1,
  accepts: [
    {
      scheme: 'exact',
      network: 'eip155:8453',
      maxAmountRequired: '50000', // 0.05 USDC
      asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
    },
  ],
};

describe('PaymentModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    paymentDetails: mockPaymentDetails,
    operationName: 'Compose Team',
    usdcBalance: BigInt(1000000), // 1 USDC
    isWalletConnected: true,
    isCorrectNetwork: true,
    onConfirm: vi.fn(),
    onSwitchNetwork: vi.fn(),
    onConnectWallet: vi.fn(),
  };

  describe('basic rendering', () => {
    it('renders payment required title', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('Payment Required')).toBeInTheDocument();
    });

    it('renders operation name', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('Compose Team')).toBeInTheDocument();
    });

    it('renders cost from payment details', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('$0.05')).toBeInTheDocument();
    });

    it('renders balance when connected', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('Your Balance')).toBeInTheDocument();
      expect(screen.getByText('$1.00')).toBeInTheDocument();
    });
  });

  describe('wallet not connected', () => {
    it('shows connect wallet button', () => {
      render(<PaymentModal {...defaultProps} isWalletConnected={false} />);
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('calls onConnectWallet when button clicked', () => {
      const onConnectWallet = vi.fn();
      render(
        <PaymentModal
          {...defaultProps}
          isWalletConnected={false}
          onConnectWallet={onConnectWallet}
        />,
      );
      fireEvent.click(screen.getByText('Connect Wallet'));
      expect(onConnectWallet).toHaveBeenCalledTimes(1);
    });

    it('hides balance when not connected', () => {
      render(<PaymentModal {...defaultProps} isWalletConnected={false} />);
      expect(screen.queryByText('Your Balance')).not.toBeInTheDocument();
    });
  });

  describe('wrong network', () => {
    it('shows switch network button', () => {
      render(<PaymentModal {...defaultProps} isCorrectNetwork={false} />);
      expect(screen.getByText('Switch to Base Network')).toBeInTheDocument();
    });

    it('calls onSwitchNetwork when button clicked', () => {
      const onSwitchNetwork = vi.fn();
      render(
        <PaymentModal
          {...defaultProps}
          isCorrectNetwork={false}
          onSwitchNetwork={onSwitchNetwork}
        />,
      );
      fireEvent.click(screen.getByText('Switch to Base Network'));
      expect(onSwitchNetwork).toHaveBeenCalledTimes(1);
    });

    it('shows network warning message', () => {
      render(<PaymentModal {...defaultProps} isCorrectNetwork={false} />);
      expect(screen.getByText('Please switch to Base network to continue')).toBeInTheDocument();
    });
  });

  describe('insufficient balance', () => {
    it('shows insufficient balance button when balance too low', () => {
      render(<PaymentModal {...defaultProps} usdcBalance={BigInt(10000)} />); // 0.01 USDC
      expect(screen.getByText('Insufficient Balance')).toBeInTheDocument();
    });

    it('disables button when insufficient balance', () => {
      render(<PaymentModal {...defaultProps} usdcBalance={BigInt(10000)} />);
      expect(screen.getByText('Insufficient Balance').closest('button')).toBeDisabled();
    });

    it('shows warning message', () => {
      render(<PaymentModal {...defaultProps} usdcBalance={BigInt(10000)} />);
      expect(screen.getByText(/Insufficient USDC balance/)).toBeInTheDocument();
    });

    it('shows Get USDC link', () => {
      render(<PaymentModal {...defaultProps} usdcBalance={BigInt(10000)} />);
      const link = screen.getByTestId('get-usdc-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        'https://www.coinbase.com/onramp/buy?asset=USDC&chain=base',
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('confirm payment', () => {
    it('shows confirm button when ready', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('Confirm Payment')).toBeInTheDocument();
    });

    it('calls onConfirm when button clicked', () => {
      const onConfirm = vi.fn();
      render(<PaymentModal {...defaultProps} onConfirm={onConfirm} />);
      fireEvent.click(screen.getByText('Confirm Payment'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('processing state', () => {
    it('shows processing text', () => {
      render(<PaymentModal {...defaultProps} isProcessing />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables confirm button while processing', () => {
      render(<PaymentModal {...defaultProps} isProcessing />);
      expect(screen.getByText('Processing...').closest('button')).toBeDisabled();
    });

    it('disables cancel button while processing', () => {
      render(<PaymentModal {...defaultProps} isProcessing />);
      expect(screen.getByText('Cancel')).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('shows error message', () => {
      render(<PaymentModal {...defaultProps} error="Payment failed" />);
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
    });

    it('shows retry button when error is retryable', () => {
      const onRetry = vi.fn();
      render(
        <PaymentModal {...defaultProps} error="Network error" isErrorRetryable onRetry={onRetry} />,
      );
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('calls onRetry when retry button clicked', () => {
      const onRetry = vi.fn();
      render(
        <PaymentModal {...defaultProps} error="Network error" isErrorRetryable onRetry={onRetry} />,
      );
      fireEvent.click(screen.getByTestId('retry-button'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('does not show retry button when error is not retryable', () => {
      render(<PaymentModal {...defaultProps} error="User rejected" isErrorRetryable={false} />);
      expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
    });

    it('does not show retry button when onRetry not provided', () => {
      render(<PaymentModal {...defaultProps} error="Network error" isErrorRetryable />);
      expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
    });
  });

  describe('cancel', () => {
    it('shows cancel button', () => {
      render(<PaymentModal {...defaultProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onOpenChange with false when cancel clicked', () => {
      const onOpenChange = vi.fn();
      render(<PaymentModal {...defaultProps} onOpenChange={onOpenChange} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('edge cases', () => {
    it('handles null payment details', () => {
      render(<PaymentModal {...defaultProps} paymentDetails={null} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles null balance', () => {
      render(<PaymentModal {...defaultProps} usdcBalance={null} />);
      // Should still render, just with 0 balance
      expect(screen.getByText('Your Balance')).toBeInTheDocument();
    });
  });
});
