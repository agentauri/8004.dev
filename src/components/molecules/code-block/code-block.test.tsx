import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from './code-block';

describe('CodeBlock', () => {
  const sampleCode = 'npm install package';

  it('renders code content', () => {
    render(<CodeBlock code={sampleCode} />);

    expect(screen.getByTestId('code-block')).toBeInTheDocument();
    expect(screen.getByText(sampleCode)).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<CodeBlock code={sampleCode} label="Installation" />);

    expect(screen.getByText('Installation')).toBeInTheDocument();
  });

  it('shows language indicator when label is present', () => {
    render(<CodeBlock code={sampleCode} label="Command" language="bash" />);

    expect(screen.getByText('BASH')).toBeInTheDocument();
  });

  it('renders JSON language indicator', () => {
    render(<CodeBlock code='{"key": "value"}' label="Config" language="json" />);

    expect(screen.getByText('JSON')).toBeInTheDocument();
  });

  it('renders TEXT language indicator by default', () => {
    render(<CodeBlock code={sampleCode} label="Output" />);

    expect(screen.getByText('TEXT')).toBeInTheDocument();
  });

  it('shows copy button by default', () => {
    render(<CodeBlock code={sampleCode} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides copy button when showCopy is false', () => {
    render(<CodeBlock code={sampleCode} showCopy={false} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CodeBlock code={sampleCode} className="custom-class" />);

    expect(screen.getByTestId('code-block')).toHaveClass('custom-class');
  });

  it('sets data-language attribute on code element', () => {
    render(<CodeBlock code={sampleCode} language="bash" />);

    const codeElement = screen.getByTestId('code-block-pre').querySelector('code');
    expect(codeElement).toHaveAttribute('data-language', 'bash');
  });

  it('renders multiline code correctly', () => {
    const multilineCode = `line 1
line 2
line 3`;
    render(<CodeBlock code={multilineCode} />);

    const codeElement = screen.getByTestId('code-block-pre').querySelector('code');
    expect(codeElement).toHaveTextContent('line 1');
    expect(codeElement).toHaveTextContent('line 2');
    expect(codeElement).toHaveTextContent('line 3');
  });

  it('renders JSON config correctly', () => {
    const jsonCode = JSON.stringify({ mcpServers: { test: {} } }, null, 2);
    render(<CodeBlock code={jsonCode} language="json" />);

    const codeElement = screen.getByTestId('code-block-pre').querySelector('code');
    expect(codeElement).toHaveTextContent('mcpServers');
    expect(codeElement).toHaveTextContent('test');
  });
});
