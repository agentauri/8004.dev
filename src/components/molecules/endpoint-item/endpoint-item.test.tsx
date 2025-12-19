import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EndpointItem } from './endpoint-item';

describe('EndpointItem', () => {
  const testUrl = 'https://api.example.com/v1/agent';

  describe('rendering', () => {
    it('renders with url', () => {
      render(<EndpointItem url={testUrl} />);
      expect(screen.getByTestId('endpoint-item')).toBeInTheDocument();
      expect(screen.getByTestId('endpoint-url')).toHaveTextContent(testUrl);
    });

    it('applies custom className', () => {
      render(<EndpointItem url={testUrl} className="custom-class" />);
      expect(screen.getByTestId('endpoint-item')).toHaveClass('custom-class');
    });

    it('has title attribute for full URL on hover', () => {
      render(<EndpointItem url={testUrl} />);
      expect(screen.getByTestId('endpoint-url')).toHaveAttribute('title', testUrl);
    });
  });

  describe('endpoint types', () => {
    it('renders http type by default', () => {
      render(<EndpointItem url={testUrl} />);
      expect(screen.getByTestId('endpoint-item')).toHaveAttribute('data-type', 'http');
      expect(screen.getByText('HTTP')).toBeInTheDocument();
    });

    it('renders websocket type', () => {
      render(<EndpointItem url="wss://ws.example.com" type="websocket" />);
      expect(screen.getByTestId('endpoint-item')).toHaveAttribute('data-type', 'websocket');
      expect(screen.getByText('WS')).toBeInTheDocument();
    });

    it('renders webhook type', () => {
      render(<EndpointItem url="https://hooks.example.com" type="webhook" />);
      expect(screen.getByTestId('endpoint-item')).toHaveAttribute('data-type', 'webhook');
      expect(screen.getByText('HOOK')).toBeInTheDocument();
    });
  });

  describe('custom label', () => {
    it('uses custom label when provided', () => {
      render(<EndpointItem url={testUrl} label="API" />);
      expect(screen.getByText('API')).toBeInTheDocument();
    });

    it('overrides type label with custom label', () => {
      render(<EndpointItem url={testUrl} type="websocket" label="STREAM" />);
      expect(screen.getByText('STREAM')).toBeInTheDocument();
      expect(screen.queryByText('WS')).not.toBeInTheDocument();
    });
  });

  describe('copy button', () => {
    it('shows copy button by default', () => {
      render(<EndpointItem url={testUrl} />);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('hides copy button when showCopy is false', () => {
      render(<EndpointItem url={testUrl} showCopy={false} />);
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });

    it('copy button has correct aria-label', () => {
      render(<EndpointItem url={testUrl} type="websocket" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('aria-label', 'Copy WS URL');
    });
  });

  describe('truncation', () => {
    it('truncates by default', () => {
      render(<EndpointItem url={testUrl} />);
      expect(screen.getByTestId('endpoint-url')).toHaveClass('truncate');
    });

    it('does not truncate when truncate is false', () => {
      render(<EndpointItem url={testUrl} truncate={false} />);
      expect(screen.getByTestId('endpoint-url')).not.toHaveClass('truncate');
    });
  });

  describe('icons', () => {
    it('renders globe icon for http', () => {
      render(<EndpointItem url={testUrl} type="http" />);
      const container = screen.getByTestId('endpoint-item');
      expect(container.querySelector('.lucide-globe')).toBeInTheDocument();
    });

    it('renders server icon for websocket', () => {
      render(<EndpointItem url="wss://ws.example.com" type="websocket" />);
      const container = screen.getByTestId('endpoint-item');
      expect(container.querySelector('.lucide-server')).toBeInTheDocument();
    });

    it('renders webhook icon for webhook', () => {
      render(<EndpointItem url="https://hooks.example.com" type="webhook" />);
      const container = screen.getByTestId('endpoint-item');
      expect(container.querySelector('.lucide-webhook')).toBeInTheDocument();
    });
  });
});
