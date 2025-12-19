'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          color: '#e4e4e7',
          fontFamily: 'monospace',
        }}
      >
        <main
          style={{
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '500px',
          }}
          data-testid="global-error-page"
        >
          {/* Error Title */}
          <h1
            style={{
              fontSize: '1.5rem',
              color: '#ef4444',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Critical System Error
          </h1>

          {/* Error Message */}
          <p
            style={{
              fontSize: '0.875rem',
              color: '#a1a1aa',
              marginBottom: '2rem',
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                backgroundColor: '#111118',
                border: '2px solid #ef4444',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'left',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  wordBreak: 'break-all',
                  margin: 0,
                }}
              >
                {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#71717a',
                    marginTop: '0.5rem',
                    marginBottom: 0,
                  }}
                >
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: '2px solid #3b82f6',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: 'transparent',
                color: '#e4e4e7',
                border: '2px solid #27272a',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Go Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
