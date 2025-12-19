import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentEndpoints } from './agent-endpoints';

describe('AgentEndpoints', () => {
  describe('rendering', () => {
    it('renders endpoints container', () => {
      render(<AgentEndpoints endpoints={{}} />);
      expect(screen.getByTestId('agent-endpoints')).toBeInTheDocument();
    });

    it('displays section title', () => {
      render(<AgentEndpoints endpoints={{}} />);
      expect(screen.getByText('ENDPOINTS & CAPABILITIES')).toBeInTheDocument();
    });

    it('displays no endpoints message when empty', () => {
      render(<AgentEndpoints endpoints={{}} />);
      expect(screen.getByText('No endpoints configured')).toBeInTheDocument();
    });
  });

  describe('MCP endpoint', () => {
    it('displays MCP endpoint when provided', () => {
      render(
        <AgentEndpoints endpoints={{ mcp: { url: 'https://mcp.example.com', version: '1.0' } }} />,
      );
      expect(screen.getByText('MCP Endpoint (v1.0)')).toBeInTheDocument();
      expect(screen.getByText('https://mcp.example.com')).toBeInTheDocument();
    });

    it('displays MCP capability tag', () => {
      render(
        <AgentEndpoints endpoints={{ mcp: { url: 'https://mcp.example.com', version: '1.0' } }} />,
      );
      expect(screen.getByText('MCP')).toBeInTheDocument();
    });

    it('renders external link for MCP URL', () => {
      render(
        <AgentEndpoints endpoints={{ mcp: { url: 'https://mcp.example.com', version: '1.0' } }} />,
      );
      const link = screen.getByLabelText('Open MCP Endpoint (v1.0) in new tab');
      expect(link).toHaveAttribute('href', 'https://mcp.example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('A2A endpoint', () => {
    it('displays A2A endpoint when provided', () => {
      render(
        <AgentEndpoints endpoints={{ a2a: { url: 'https://a2a.example.com', version: '2.0' } }} />,
      );
      expect(screen.getByText('A2A Endpoint (v2.0)')).toBeInTheDocument();
      expect(screen.getByText('https://a2a.example.com')).toBeInTheDocument();
    });

    it('displays A2A capability tag', () => {
      render(
        <AgentEndpoints endpoints={{ a2a: { url: 'https://a2a.example.com', version: '1.0' } }} />,
      );
      expect(screen.getByText('A2A')).toBeInTheDocument();
    });
  });

  describe('other endpoints', () => {
    it('displays ENS name when provided', () => {
      render(<AgentEndpoints endpoints={{ ens: 'agent.eth' }} />);
      expect(screen.getByText('ENS Name')).toBeInTheDocument();
      expect(screen.getByText('agent.eth')).toBeInTheDocument();
    });

    it('displays DID when provided', () => {
      render(<AgentEndpoints endpoints={{ did: 'did:web:example.com' }} />);
      expect(screen.getByText('DID')).toBeInTheDocument();
      expect(screen.getByText('did:web:example.com')).toBeInTheDocument();
    });

    it('displays agent wallet when provided', () => {
      render(<AgentEndpoints endpoints={{ agentWallet: '0x1234...5678' }} />);
      expect(screen.getByText('Agent Wallet')).toBeInTheDocument();
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });
  });

  describe('x402 support', () => {
    it('displays x402 capability tag when supported', () => {
      render(<AgentEndpoints endpoints={{}} x402Support={true} />);
      expect(screen.getByText('x402')).toBeInTheDocument();
    });

    it('does not display x402 tag when not supported', () => {
      render(<AgentEndpoints endpoints={{}} x402Support={false} />);
      expect(screen.queryByText('x402')).not.toBeInTheDocument();
    });
  });

  describe('copy buttons', () => {
    it('renders copy buttons for each endpoint', () => {
      render(
        <AgentEndpoints
          endpoints={{
            mcp: { url: 'https://mcp.example.com', version: '1.0' },
            ens: 'agent.eth',
          }}
        />,
      );
      const copyButtons = screen.getAllByTestId('copy-button');
      expect(copyButtons).toHaveLength(2);
    });
  });

  describe('multiple endpoints', () => {
    it('displays all endpoints when provided', () => {
      render(
        <AgentEndpoints
          endpoints={{
            mcp: { url: 'https://mcp.example.com', version: '1.0' },
            a2a: { url: 'https://a2a.example.com', version: '1.0' },
            ens: 'agent.eth',
            did: 'did:web:example.com',
            agentWallet: '0x1234',
          }}
          x402Support={true}
        />,
      );

      expect(screen.getByText('MCP Endpoint (v1.0)')).toBeInTheDocument();
      expect(screen.getByText('A2A Endpoint (v1.0)')).toBeInTheDocument();
      expect(screen.getByText('ENS Name')).toBeInTheDocument();
      expect(screen.getByText('DID')).toBeInTheDocument();
      expect(screen.getByText('Agent Wallet')).toBeInTheDocument();
    });

    it('displays all capability tags', () => {
      render(
        <AgentEndpoints
          endpoints={{
            mcp: { url: 'https://mcp.example.com', version: '1.0' },
            a2a: { url: 'https://a2a.example.com', version: '1.0' },
          }}
          x402Support={true}
        />,
      );

      expect(screen.getByText('MCP')).toBeInTheDocument();
      expect(screen.getByText('A2A')).toBeInTheDocument();
      expect(screen.getByText('x402')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<AgentEndpoints endpoints={{}} className="custom-class" />);
      expect(screen.getByTestId('agent-endpoints')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<AgentEndpoints endpoints={{}} className="custom-class" />);
      const container = screen.getByTestId('agent-endpoints');
      expect(container).toHaveClass('p-4');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('empty URL handling', () => {
    it('displays "Not available" when MCP URL is empty', () => {
      render(<AgentEndpoints endpoints={{ mcp: { url: '', version: '1.0' } }} />);
      expect(screen.getByText('MCP Endpoint (v1.0)')).toBeInTheDocument();
      expect(screen.getByText('Not available')).toBeInTheDocument();
    });

    it('does not show external link when URL is empty', () => {
      render(<AgentEndpoints endpoints={{ mcp: { url: '', version: '1.0' } }} />);
      expect(
        screen.queryByLabelText('Open MCP Endpoint (v1.0) in new tab'),
      ).not.toBeInTheDocument();
    });

    it('does not show copy button when URL is empty', () => {
      render(<AgentEndpoints endpoints={{ mcp: { url: '', version: '1.0' } }} />);
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });

    it('displays "Not available" when A2A URL is empty', () => {
      render(<AgentEndpoints endpoints={{ a2a: { url: '', version: '2.0' } }} />);
      expect(screen.getByText('A2A Endpoint (v2.0)')).toBeInTheDocument();
      expect(screen.getByText('Not available')).toBeInTheDocument();
    });

    it('handles whitespace-only URL as empty', () => {
      render(<AgentEndpoints endpoints={{ mcp: { url: '   ', version: '1.0' } }} />);
      expect(screen.getByText('Not available')).toBeInTheDocument();
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });
  });
});
