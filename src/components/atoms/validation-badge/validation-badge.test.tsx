import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ValidationBadge, type ValidationStatus, type ValidationType } from './validation-badge';

describe('ValidationBadge', () => {
  describe('Rendering', () => {
    it('renders with TEE type', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      expect(screen.getByTestId('validation-badge')).toBeInTheDocument();
      expect(screen.getByText('TEE')).toBeInTheDocument();
    });

    it('renders with zkML type', () => {
      render(<ValidationBadge type="zkml" status="valid" />);
      expect(screen.getByText('ZKML')).toBeInTheDocument();
    });

    it('renders with stake type', () => {
      render(<ValidationBadge type="stake" status="valid" />);
      expect(screen.getByText('STAKE')).toBeInTheDocument();
    });

    it('renders with none type', () => {
      render(<ValidationBadge type="none" status="none" />);
      expect(screen.getByText('NONE')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders ShieldCheck icon for TEE', () => {
      const { container } = render(<ValidationBadge type="tee" status="valid" />);
      const badge = container.querySelector('[data-testid="validation-badge"]');
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Lock icon for zkML', () => {
      const { container } = render(<ValidationBadge type="zkml" status="valid" />);
      const badge = container.querySelector('[data-testid="validation-badge"]');
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Coins icon for stake', () => {
      const { container } = render(<ValidationBadge type="stake" status="valid" />);
      const badge = container.querySelector('[data-testid="validation-badge"]');
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders ShieldOff icon for none', () => {
      const { container } = render(<ValidationBadge type="none" status="none" />);
      const badge = container.querySelector('[data-testid="validation-badge"]');
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Status Colors', () => {
    it('applies green color for valid status', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('text-[var(--pixel-green-pipe)]');
      expect(badge).toHaveClass('shadow-[0_0_8px_var(--glow-green)]');
    });

    it('applies gold color for pending status', () => {
      render(<ValidationBadge type="tee" status="pending" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('text-[var(--pixel-gold-coin)]');
      expect(badge).toHaveClass('shadow-[0_0_8px_var(--glow-gold)]');
    });

    it('applies gray color for expired status', () => {
      render(<ValidationBadge type="tee" status="expired" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('text-[var(--pixel-gray-400)]');
      expect(badge).not.toHaveClass('shadow-[0_0_8px');
    });

    it('applies dark gray color for none status', () => {
      render(<ValidationBadge type="none" status="none" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('text-[var(--pixel-gray-700)]');
      expect(badge).not.toHaveClass('shadow-[0_0_8px');
    });
  });

  describe('Data Attributes', () => {
    it('sets correct data-type attribute', () => {
      const types: ValidationType[] = ['tee', 'zkml', 'stake', 'none'];
      types.forEach((type) => {
        const { unmount } = render(<ValidationBadge type={type} status="valid" />);
        const badge = screen.getByTestId('validation-badge');
        expect(badge).toHaveAttribute('data-type', type);
        unmount();
      });
    });

    it('sets correct data-status attribute', () => {
      const statuses: ValidationStatus[] = ['valid', 'pending', 'expired', 'none'];
      statuses.forEach((status) => {
        const { unmount } = render(<ValidationBadge type="tee" status={status} />);
        const badge = screen.getByTestId('validation-badge');
        expect(badge).toHaveAttribute('data-status', status);
        unmount();
      });
    });

    it('sets data-attestation attribute when provided', () => {
      const attestationId = '0x1234567890abcdef';
      render(<ValidationBadge type="tee" status="valid" attestationId={attestationId} />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveAttribute('data-attestation', attestationId);
    });

    it('does not set data-attestation when not provided', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge.getAttribute('data-attestation')).toBeNull();
    });
  });

  describe('Attestation ID', () => {
    it('sets title attribute with attestation ID when provided', () => {
      const attestationId = '0xabcdef123456';
      render(<ValidationBadge type="tee" status="valid" attestationId={attestationId} />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveAttribute('title', `Attestation: ${attestationId}`);
    });

    it('does not set title attribute when attestation ID not provided', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge.getAttribute('title')).toBeNull();
    });
  });

  describe('Custom ClassName', () => {
    it('merges custom className with default classes', () => {
      render(<ValidationBadge type="tee" status="valid" className="custom-class" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('badge-pixel');
    });

    it('allows className override', () => {
      render(<ValidationBadge type="tee" status="valid" className="m-4 p-2" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('m-4');
      expect(badge).toHaveClass('p-2');
    });
  });

  describe('All Type/Status Combinations', () => {
    const types: ValidationType[] = ['tee', 'zkml', 'stake', 'none'];
    const statuses: ValidationStatus[] = ['valid', 'pending', 'expired', 'none'];

    types.forEach((type) => {
      statuses.forEach((status) => {
        it(`renders ${type} with ${status} status`, () => {
          render(<ValidationBadge type={type} status={status} />);
          const badge = screen.getByTestId('validation-badge');
          expect(badge).toHaveAttribute('data-type', type);
          expect(badge).toHaveAttribute('data-status', status);
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('marks icon as aria-hidden', () => {
      const { container } = render(<ValidationBadge type="tee" status="valid" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('provides accessible text label', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      expect(screen.getByText('TEE')).toBeInTheDocument();
    });
  });

  describe('Background Classes', () => {
    it('applies valid background class', () => {
      render(<ValidationBadge type="tee" status="valid" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('bg-[rgba(0,216,0,0.1)]');
    });

    it('applies pending background class', () => {
      render(<ValidationBadge type="tee" status="pending" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('bg-[rgba(252,192,60,0.1)]');
    });

    it('applies expired background class', () => {
      render(<ValidationBadge type="tee" status="expired" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('bg-[rgba(136,136,136,0.1)]');
    });

    it('applies none background class', () => {
      render(<ValidationBadge type="none" status="none" />);
      const badge = screen.getByTestId('validation-badge');
      expect(badge).toHaveClass('bg-[rgba(58,58,58,0.1)]');
    });
  });
});
