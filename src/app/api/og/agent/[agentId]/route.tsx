import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Chain configuration for styling
 */
const CHAIN_CONFIG: Record<number, { name: string; color: string }> = {
  11155111: { name: 'Sepolia', color: '#FC5454' },
  84532: { name: 'Base Sepolia', color: '#5C94FC' },
  80002: { name: 'Polygon Amoy', color: '#9C54FC' },
};

/**
 * Fetch agent data from backend
 */
async function fetchAgent(agentId: string): Promise<AgentData | null> {
  const apiUrl = process.env.BACKEND_API_URL;
  const apiKey = process.env.BACKEND_API_KEY;

  if (!apiUrl || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/agents/${agentId}`, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json.data as AgentData;
  } catch {
    return null;
  }
}

interface AgentData {
  id: string;
  chainId: number;
  tokenId: string;
  name?: string;
  description?: string;
  active?: boolean | null;
  hasMcp?: boolean | null;
  hasA2a?: boolean | null;
  x402Support?: boolean | null;
  oasf?: {
    skills: Array<{ slug: string; confidence: number }>;
    domains: Array<{ slug: string; confidence: number }>;
  };
}

/**
 * Truncate text to max length
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Dynamic OG image for individual agent pages
 * Shows agent details with chain-specific styling
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  const { agentId } = await params;

  const agent = await fetchAgent(agentId);

  // Fallback to default OG image if agent not found
  if (!agent) {
    return generateFallbackImage(agentId);
  }

  const chainConfig = CHAIN_CONFIG[agent.chainId] || { name: 'Unknown', color: '#666666' };
  const title = agent.name || `Agent #${agent.tokenId}`;
  const description = truncate(agent.description || 'AI Agent on ERC-8004', 120);

  // Build capabilities
  const capabilities: string[] = [];
  if (agent.hasMcp) capabilities.push('MCP');
  if (agent.hasA2a) capabilities.push('A2A');
  if (agent.x402Support) capabilities.push('x402');

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000000',
        backgroundImage:
          'linear-gradient(rgba(92, 148, 252, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(92, 148, 252, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        position: 'relative',
        padding: '48px',
      }}
    >
      {/* Top border glow with chain color */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: chainConfig.color,
          boxShadow: `0 0 20px ${chainConfig.color}`,
        }}
      />

      {/* Header with chain badge and status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        {/* Chain badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#1A1A1A',
            border: `2px solid ${chainConfig.color}`,
            borderRadius: '8px',
            padding: '12px 20px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: chainConfig.color,
            }}
          />
          <span
            style={{
              color: chainConfig.color,
              fontSize: '22px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            {chainConfig.name}
          </span>
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1A1A1A',
            border: `2px solid ${agent.active ? '#00D800' : '#FC5454'}`,
            borderRadius: '8px',
            padding: '12px 20px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: agent.active ? '#00D800' : '#FC5454',
            }}
          />
          <span
            style={{
              color: agent.active ? '#00D800' : '#FC5454',
              fontSize: '20px',
              fontFamily: 'monospace',
            }}
          >
            {agent.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Agent name */}
        <div
          style={{
            display: 'flex',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontFamily: 'monospace',
              textShadow: `0 0 30px ${chainConfig.color}40`,
            }}
          >
            {truncate(title, 35)}
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '26px',
              color: '#888888',
              fontFamily: 'monospace',
              lineHeight: 1.4,
            }}
          >
            {description}
          </span>
        </div>

        {/* Capabilities */}
        {capabilities.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {capabilities.map((cap) => (
              <div
                key={cap}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1A1A1A',
                  border: '2px solid #5C94FC',
                  borderRadius: '6px',
                  padding: '8px 16px',
                }}
              >
                <span
                  style={{
                    color: '#5C94FC',
                    fontSize: '18px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}
                >
                  {cap}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills (if available) */}
        {agent.oasf?.skills && agent.oasf.skills.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {agent.oasf.skills.slice(0, 4).map((skill) => (
              <div
                key={skill.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#2A2A2A',
                  border: '1px solid #3A3A3A',
                  borderRadius: '6px',
                  padding: '6px 12px',
                }}
              >
                <span
                  style={{
                    color: '#AAAAAA',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                  }}
                >
                  {skill.slug.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Agent ID */}
        <span
          style={{
            color: '#666666',
            fontSize: '18px',
            fontFamily: 'monospace',
          }}
        >
          ID: {agentId}
        </span>

        {/* Site URL */}
        <span
          style={{
            color: '#666666',
            fontSize: '18px',
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

/**
 * Generate fallback image when agent is not found
 */
function generateFallbackImage(agentId: string) {
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
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'monospace',
            marginBottom: '20px',
          }}
        >
          Agent Explorer
        </span>
        <span
          style={{
            fontSize: '24px',
            color: '#888888',
            fontFamily: 'monospace',
          }}
        >
          Agent {agentId}
        </span>
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: '24px',
          color: '#666666',
          fontSize: '18px',
          fontFamily: 'monospace',
        }}
      >
        www.8004.dev
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
