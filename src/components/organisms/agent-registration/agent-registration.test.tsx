import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentRegistration } from './agent-registration';

describe('AgentRegistration', () => {
  const defaultProps = {
    registration: {
      chainId: 11155111,
      tokenId: '123',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmXYZ',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-15T10:30:00Z',
    },
  };

  describe('rendering', () => {
    it('renders registration container', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByTestId('agent-registration')).toBeInTheDocument();
    });

    it('displays section title', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('REGISTRATION INFO')).toBeInTheDocument();
    });
  });

  describe('registration fields', () => {
    it('displays owner field', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('Owner')).toBeInTheDocument();
    });

    it('displays truncated owner address', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('0xabcd...ef12')).toBeInTheDocument();
    });

    it('displays contract field', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('Contract')).toBeInTheDocument();
    });

    it('displays truncated contract address', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('displays token ID field', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('Token ID')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('displays registration date', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('Registered')).toBeInTheDocument();
      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    });
  });

  describe('explorer links', () => {
    it('renders explorer link for owner on Sepolia', () => {
      render(<AgentRegistration {...defaultProps} />);
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      const ownerLink = links.find((link) =>
        link.getAttribute('href')?.includes('sepolia.etherscan.io'),
      );
      expect(ownerLink).toHaveAttribute(
        'href',
        'https://sepolia.etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef12',
      );
    });

    it('renders explorer link for contract', () => {
      render(<AgentRegistration {...defaultProps} />);
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it('opens links in new tab', () => {
      render(<AgentRegistration {...defaultProps} />);
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      for (const link of links) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  describe('chain-specific explorers', () => {
    it('uses Base Sepolia explorer for Base chain', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            chainId: 84532,
          }}
        />,
      );
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      expect(links[0]).toHaveAttribute('href', expect.stringContaining('sepolia.basescan.org'));
    });

    it('uses Polygon Amoy explorer for Polygon chain', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            chainId: 80002,
          }}
        />,
      );
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      expect(links[0]).toHaveAttribute('href', expect.stringContaining('amoy.polygonscan.com'));
    });

    it('uses default etherscan for unknown chain', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            chainId: 999999,
          }}
        />,
      );
      const links = screen.getAllByLabelText(/View .* on block explorer/);
      expect(links[0]).toHaveAttribute('href', expect.stringContaining('etherscan.io'));
    });
  });

  describe('date formatting', () => {
    it('handles invalid date showing Invalid Date string', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            registeredAt: 'invalid-date',
          }}
        />,
      );
      // Invalid date string produces "Invalid Date" from toLocaleDateString
      expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    });
  });

  describe('copy buttons', () => {
    it('renders copy buttons for addresses and URIs', () => {
      render(<AgentRegistration {...defaultProps} />);
      const copyButtons = screen.getAllByTestId('copy-button');
      // Owner, Contract, and Agent URI have copy buttons
      expect(copyButtons.length).toBe(3);
    });
  });

  describe('Agent URI field', () => {
    it('displays Agent URI field', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('Agent URI')).toBeInTheDocument();
    });

    it('displays metadataUri value', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.getByText('ipfs://QmXYZ')).toBeInTheDocument();
    });

    it('renders external link for Agent URI', () => {
      render(<AgentRegistration {...defaultProps} />);
      const link = screen.getByLabelText('Open Agent URI in new tab');
      expect(link).toHaveAttribute('href', 'ipfs://QmXYZ');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('empty value handling', () => {
    it('displays "Not available" when owner is empty', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            owner: '',
          }}
        />,
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getAllByText('Not available').length).toBeGreaterThanOrEqual(1);
    });

    it('does not show explorer link when owner is empty', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            owner: '',
            contractAddress: '',
          }}
        />,
      );
      expect(screen.queryByLabelText(/View .* on block explorer/)).not.toBeInTheDocument();
    });

    it('does not show copy button when address is empty', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            owner: '',
            contractAddress: '',
            metadataUri: '',
          }}
        />,
      );
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });

    it('displays "Not available" when metadataUri is empty', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            metadataUri: '',
          }}
        />,
      );
      expect(screen.getAllByText('Not available').length).toBeGreaterThanOrEqual(1);
    });

    it('does not show external link when metadataUri is empty', () => {
      render(
        <AgentRegistration
          registration={{
            ...defaultProps.registration,
            metadataUri: '',
          }}
        />,
      );
      expect(screen.queryByLabelText('Open Agent URI in new tab')).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<AgentRegistration {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('agent-registration')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<AgentRegistration {...defaultProps} className="custom-class" />);
      const container = screen.getByTestId('agent-registration');
      expect(container).toHaveClass('p-4');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('lastUpdatedAt prop', () => {
    it('displays Last Updated field when provided', () => {
      render(<AgentRegistration {...defaultProps} lastUpdatedAt="2024-06-20T14:30:00Z" />);
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
      expect(screen.getByText('Jun 20, 2024')).toBeInTheDocument();
    });

    it('does not display Last Updated field when not provided', () => {
      render(<AgentRegistration {...defaultProps} />);
      expect(screen.queryByText('Last Updated')).not.toBeInTheDocument();
    });

    it('shows Last Updated alongside Registered', () => {
      render(<AgentRegistration {...defaultProps} lastUpdatedAt="2025-11-25T23:31:12.000Z" />);
      // Both dates should be visible
      expect(screen.getByText('Registered')).toBeInTheDocument();
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });
  });
});
