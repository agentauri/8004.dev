import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AgentValidation } from '@/types/agent';
import { ValidationSection } from './validation-section';

describe('ValidationSection', () => {
  const validTeeValidation: AgentValidation = {
    type: 'tee',
    status: 'valid',
    attestationId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    validatorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: '2024-01-15T10:30:00Z',
    expiresAt: '2025-01-15T10:30:00Z',
  };

  const zkmlValidation: AgentValidation = {
    type: 'zkml',
    status: 'valid',
    attestationId: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    timestamp: '2024-02-20T14:00:00Z',
  };

  const pendingStakeValidation: AgentValidation = {
    type: 'stake',
    status: 'pending',
    validatorAddress: '0x9876543210fedcba9876543210fedcba98765432',
    timestamp: '2024-03-01T09:00:00Z',
  };

  it('renders with validations', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    expect(screen.getByTestId('validation-section')).toBeInTheDocument();
    expect(screen.getByText('Validations (1)')).toBeInTheDocument();
  });

  it('shows empty state when no validations', () => {
    render(<ValidationSection validations={[]} />);

    expect(screen.getByTestId('validation-section')).toHaveAttribute('data-empty', 'true');
    expect(screen.getByText('No validations registered for this agent')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ValidationSection validations={[]} isLoading={true} />);

    expect(screen.getByTestId('validation-section')).toHaveAttribute('data-loading', 'true');
  });

  it('renders TEE validation correctly', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    expect(screen.getByTestId('validation-item-tee')).toBeInTheDocument();
    expect(screen.getByText('TEE Attestation')).toBeInTheDocument();
    expect(screen.getByText(/Hardware-based Trusted Execution Environment/)).toBeInTheDocument();
  });

  it('renders zkML validation correctly', () => {
    render(<ValidationSection validations={[zkmlValidation]} agentId="11155111:42" />);

    expect(screen.getByTestId('validation-item-zkml')).toBeInTheDocument();
    expect(screen.getByText('zkML Proof')).toBeInTheDocument();
    expect(screen.getByText(/Zero-knowledge machine learning proof/)).toBeInTheDocument();
  });

  it('renders stake validation correctly', () => {
    render(<ValidationSection validations={[pendingStakeValidation]} agentId="11155111:42" />);

    expect(screen.getByTestId('validation-item-stake')).toBeInTheDocument();
    expect(screen.getByText('Economic Stake')).toBeInTheDocument();
    expect(screen.getByText(/Economic security through staked collateral/)).toBeInTheDocument();
  });

  it('shows multiple validations', () => {
    render(
      <ValidationSection
        validations={[validTeeValidation, zkmlValidation, pendingStakeValidation]}
        agentId="11155111:42"
      />,
    );

    expect(screen.getByText('Validations (3)')).toBeInTheDocument();
    expect(screen.getByTestId('validation-item-tee')).toBeInTheDocument();
    expect(screen.getByTestId('validation-item-zkml')).toBeInTheDocument();
    expect(screen.getByTestId('validation-item-stake')).toBeInTheDocument();
  });

  it('displays valid status correctly', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByTestId('validation-status-badge')).toBeInTheDocument();
  });

  it('displays pending status correctly', () => {
    render(<ValidationSection validations={[pendingStakeValidation]} agentId="11155111:42" />);

    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByTestId('validation-status-badge')).toBeInTheDocument();
  });

  it('displays expired status correctly', () => {
    const expiredValidation: AgentValidation = {
      type: 'tee',
      status: 'expired',
      attestationId: '0x000',
      timestamp: '2023-01-01T00:00:00Z',
    };

    render(<ValidationSection validations={[expiredValidation]} agentId="11155111:42" />);

    expect(screen.getByText('EXPIRED')).toBeInTheDocument();
    expect(screen.getByTestId('validation-status-badge')).toBeInTheDocument();
  });

  it('displays attestation ID truncated', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    // Should show truncated version
    expect(screen.getByText('0x12345678...90abcdef')).toBeInTheDocument();
  });

  it('displays validator address truncated', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    // Should show truncated version (first 10 chars ... last 8 chars)
    // Address: 0xabcdef1234567890abcdef1234567890abcdef12
    // First 10: 0xabcdef12, Last 8: abcdef12
    expect(screen.getByText('0xabcdef12...abcdef12')).toBeInTheDocument();
  });

  it('displays timestamps', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    expect(screen.getByText(/Registered:/)).toBeInTheDocument();
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
  });

  it('renders explorer link when agentId and attestationId provided', () => {
    render(<ValidationSection validations={[validTeeValidation]} agentId="11155111:42" />);

    const link = screen.getByTestId('validation-explorer-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('8004scan.io'));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render explorer link without attestationId', () => {
    const validationWithoutAttestation: AgentValidation = {
      type: 'stake',
      status: 'pending',
    };

    render(
      <ValidationSection validations={[validationWithoutAttestation]} agentId="11155111:42" />,
    );

    expect(screen.queryByTestId('validation-explorer-link')).not.toBeInTheDocument();
  });

  it('does not render explorer link without agentId', () => {
    render(<ValidationSection validations={[validTeeValidation]} />);

    expect(screen.queryByTestId('validation-explorer-link')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ValidationSection validations={[validTeeValidation]} className="custom-class" />);

    expect(screen.getByTestId('validation-section')).toHaveClass('custom-class');
  });

  it('handles validation without optional fields', () => {
    const minimalValidation: AgentValidation = {
      type: 'tee',
      status: 'valid',
    };

    render(<ValidationSection validations={[minimalValidation]} agentId="11155111:42" />);

    expect(screen.getByTestId('validation-item-tee')).toBeInTheDocument();
    // Should not show timestamps or attestation details
    expect(screen.queryByText(/Registered:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Attestation ID:/)).not.toBeInTheDocument();
  });

  it('handles invalid date gracefully', () => {
    const validationWithBadDate: AgentValidation = {
      type: 'tee',
      status: 'valid',
      timestamp: 'invalid-date-string',
    };

    render(<ValidationSection validations={[validationWithBadDate]} agentId="11155111:42" />);

    expect(screen.getByText(/Registered:/)).toBeInTheDocument();
    // Should handle invalid date without crashing
  });

  it('renders ValidationBadge for each validation', () => {
    render(
      <ValidationSection
        validations={[validTeeValidation, zkmlValidation]}
        agentId="11155111:42"
      />,
    );

    // ValidationBadge components should be present
    const badges = screen.getAllByTestId('validation-badge');
    expect(badges).toHaveLength(2);
  });

  it('uses unique keys for validations', () => {
    const duplicateTypeValidations: AgentValidation[] = [
      { type: 'tee', status: 'valid', attestationId: '0x111' },
      { type: 'tee', status: 'expired', attestationId: '0x222' },
    ];

    // Should not throw warning about duplicate keys
    expect(() => {
      render(<ValidationSection validations={duplicateTypeValidations} agentId="11155111:42" />);
    }).not.toThrow();

    // Both should render
    const teeItems = screen.getAllByTestId('validation-item-tee');
    expect(teeItems).toHaveLength(2);
  });
});
