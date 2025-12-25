import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

/**
 * Default OG image for Agent Explorer
 * Uses 80s retro pixel art aesthetic matching the site design
 *
 * @see https://vercel.com/docs/functions/og-image-generation
 */
export async function GET() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        backgroundImage:
          'linear-gradient(rgba(92, 148, 252, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(92, 148, 252, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        position: 'relative',
      }}
    >
      {/* Top border glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FC5454, #5C94FC, #9C54FC, #00D800)',
        }}
      />

      {/* Main content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* ERC-8004 Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1A1A1A',
            border: '2px solid #5C94FC',
            borderRadius: '8px',
            padding: '12px 24px',
            marginBottom: '40px',
            boxShadow: '0 0 20px rgba(92, 148, 252, 0.3)',
          }}
        >
          <span
            style={{
              color: '#5C94FC',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            ERC-8004
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(92, 148, 252, 0.5)',
              letterSpacing: '-2px',
            }}
          >
            Agent Explorer
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '60px',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              color: '#888888',
              fontFamily: 'monospace',
            }}
          >
            Discover Autonomous AI Agents
          </span>
        </div>

        {/* Chain badges */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {/* Sepolia */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #FC5454',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#FC5454',
              }}
            />
            <span style={{ color: '#FC5454', fontSize: '18px', fontFamily: 'monospace' }}>
              Sepolia
            </span>
          </div>

          {/* Base */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #5C94FC',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#5C94FC',
              }}
            />
            <span style={{ color: '#5C94FC', fontSize: '18px', fontFamily: 'monospace' }}>
              Base
            </span>
          </div>

          {/* Polygon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #9C54FC',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#9C54FC',
              }}
            />
            <span style={{ color: '#9C54FC', fontSize: '18px', fontFamily: 'monospace' }}>
              Polygon
            </span>
          </div>
        </div>
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#666666',
            fontSize: '20px',
            fontFamily: 'monospace',
          }}
        >
          www.8004.dev
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
