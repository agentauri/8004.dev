import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Agent } from '@/types/agent';
import { AgentMetadata } from './agent-metadata';

const mockAgent: Agent = {
  id: '11155111:42',
  chainId: 11155111,
  tokenId: '42',
  name: 'Test Agent',
  description: 'A test agent',
  active: true,
  x402support: true,
  supportedTrust: ['reputation', 'stake'],
  oasf: {
    skills: [{ slug: 'natural_language_processing', confidence: 0.9, reasoning: 'Test' }],
    domains: [{ slug: 'software_development', confidence: 0.95 }],
  },
  endpoints: {
    mcp: { url: 'https://mcp.example.com', version: '1.0' },
    a2a: { url: 'https://a2a.example.com', version: '1.0' },
    ens: 'testagent.eth',
    did: 'did:web:example.com',
    agentWallet: '0x1234567890abcdef1234567890abcdef12345678',
  },
  registration: {
    chainId: 11155111,
    tokenId: '42',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadataUri: 'https://example.com/metadata.json',
    owner: '0x9876543210fedcba9876543210fedcba98765432',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const minimalAgent: Agent = {
  id: '84532:1',
  chainId: 84532,
  tokenId: '1',
  name: 'Minimal Agent',
  description: '',
  active: false,
  x402support: false,
  supportedTrust: [],
  endpoints: {},
  registration: {
    chainId: 84532,
    tokenId: '1',
    contractAddress: '',
    metadataUri: '',
    owner: '0x1111111111111111111111111111111111111111',
    registeredAt: '',
  },
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('AgentMetadata', () => {
  describe('rendering', () => {
    it('renders with agent data', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByTestId('agent-metadata')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<AgentMetadata agent={mockAgent} className="custom-class" />);
      expect(screen.getByTestId('agent-metadata')).toHaveClass('custom-class');
    });
  });

  describe('identifiers section', () => {
    it('shows identifiers section by default', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('Identifiers')).toBeInTheDocument();
      expect(screen.getByText('11155111:42')).toBeInTheDocument(); // Agent ID
    });

    it('shows chain ID and token ID', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('11155111')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('shows metadata URI when available', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('https://example.com/metadata.json')).toBeInTheDocument();
    });
  });

  describe('endpoints section', () => {
    it('shows endpoints section', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('Endpoints')).toBeInTheDocument();
    });

    it('shows ENS name', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('testagent.eth')).toBeInTheDocument();
    });

    it('shows DID', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('did:web:example.com')).toBeInTheDocument();
    });

    it('shows agent wallet', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('0x1234567890abcdef1234567890abcdef12345678')).toBeInTheDocument();
    });

    it('shows MCP and A2A endpoints', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('https://mcp.example.com')).toBeInTheDocument();
      expect(screen.getByText('https://a2a.example.com')).toBeInTheDocument();
    });

    it('shows empty state when no endpoints', () => {
      // Create agent with truly empty endpoints
      const agentWithNoEndpoints = {
        ...minimalAgent,
        endpoints: {},
      };
      render(<AgentMetadata agent={agentWithNoEndpoints} />);
      // Endpoints section is defaultOpen
      expect(screen.getByText('No endpoints configured')).toBeInTheDocument();
    });
  });

  describe('supported trust section', () => {
    it('shows supported trust models', () => {
      render(<AgentMetadata agent={mockAgent} />);
      // Click to expand section
      fireEvent.click(screen.getByText('Supported Trust'));
      expect(screen.getByText('reputation')).toBeInTheDocument();
      expect(screen.getByText('stake')).toBeInTheDocument();
    });

    it('shows empty state when no trust models', () => {
      render(<AgentMetadata agent={minimalAgent} />);
      fireEvent.click(screen.getByText('Supported Trust'));
      expect(screen.getByText('No trust models configured')).toBeInTheDocument();
    });
  });

  describe('registration section', () => {
    it('shows registration information', () => {
      render(<AgentMetadata agent={mockAgent} />);
      fireEvent.click(screen.getByText('Registration'));
      expect(screen.getByText('0x9876543210fedcba9876543210fedcba98765432')).toBeInTheDocument();
    });

    it('shows contract address when available', () => {
      render(<AgentMetadata agent={mockAgent} />);
      fireEvent.click(screen.getByText('Registration'));
      expect(screen.getByText('0xabcdef1234567890abcdef1234567890abcdef12')).toBeInTheDocument();
    });

    it('shows active status', () => {
      render(<AgentMetadata agent={mockAgent} />);
      fireEvent.click(screen.getByText('Registration'));
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });

    it('shows inactive status', () => {
      render(<AgentMetadata agent={minimalAgent} />);
      fireEvent.click(screen.getByText('Registration'));
      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });
  });

  describe('OASF section', () => {
    it('shows OASF classification when available', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('OASF Classification')).toBeInTheDocument();
    });

    it('does not show OASF section when not available', () => {
      render(<AgentMetadata agent={minimalAgent} />);
      expect(screen.queryByText('OASF Classification')).not.toBeInTheDocument();
    });

    it('displays OASF data as JSON', () => {
      render(<AgentMetadata agent={mockAgent} />);
      fireEvent.click(screen.getByText('OASF Classification'));
      expect(screen.getByText(/"natural_language_processing"/)).toBeInTheDocument();
    });
  });

  describe('raw data section', () => {
    it('shows raw data section', () => {
      render(<AgentMetadata agent={mockAgent} />);
      expect(screen.getByText('Raw Data')).toBeInTheDocument();
    });

    it('displays complete agent data as JSON', () => {
      render(<AgentMetadata agent={mockAgent} />);
      fireEvent.click(screen.getByText('Raw Data'));
      expect(screen.getByText(/"name": "Test Agent"/)).toBeInTheDocument();
    });
  });

  describe('copy functionality', () => {
    it('copies value to clipboard when copy button clicked', async () => {
      render(<AgentMetadata agent={mockAgent} />);

      const copyButtons = screen.getAllByRole('button', { name: /copy/i });
      fireEvent.click(copyButtons[0]); // Copy Agent ID

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('11155111:42');
    });
  });

  describe('collapsible sections', () => {
    it('toggles section when clicked', () => {
      render(<AgentMetadata agent={mockAgent} />);

      // Registration starts collapsed
      const registrationButton = screen.getByText('Registration');
      expect(screen.queryByText('Owner')).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(registrationButton);
      expect(screen.getByText('Owner')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(registrationButton);
      expect(screen.queryByText('Owner')).not.toBeInTheDocument();
    });
  });
});
