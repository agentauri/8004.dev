/**
 * API route for getting agent details
 * GET /api/agents/:agentId
 */

import { BackendError, backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { mapAgentDetailResponse } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import { validateAgentId } from '@/lib/api/validation';
import type { BackendAgent, BackendReputation, BackendValidation } from '@/types/backend';

/**
 * Generate mock agent data for development/testing when backend is not available
 */
function getMockAgent(agentId: string, chainId: number, tokenId: string): BackendAgent {
  return {
    id: agentId,
    chainId,
    tokenId,
    name: `Mock Agent ${tokenId}`,
    description:
      'This is a mock agent for development/testing purposes. The backend API is not available.',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
    supportedTrust: [],
  };
}

interface RouteParams {
  params: Promise<{ agentId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params;

    // Validate agent ID format (chainId:tokenId) with strict validation
    const validation = validateAgentId(agentId);
    if (!validation.valid) {
      return errorResponse(validation.error, validation.code, 400);
    }

    let agentData: BackendAgent;
    let reputationData: BackendReputation;
    let validations: BackendValidation[] = [];

    try {
      // Fetch agent, reputation, and validations in parallel
      const [agentResponse, reputationResponse, validationsResponse] = await Promise.all([
        backendFetch<BackendAgent>(`/api/v1/agents/${agentId}`, {
          next: { revalidate: 60 },
        }),
        backendFetch<BackendReputation>(`/api/v1/agents/${agentId}/reputation`, {
          next: { revalidate: 60 },
        }).catch(() => null), // Reputation is optional, don't fail if missing
        backendFetch<BackendValidation[]>(`/api/v1/agents/${agentId}/validations`, {
          next: { revalidate: 60 },
        }).catch(() => null), // Validations are optional, don't fail if missing
      ]);

      agentData = agentResponse.data;
      reputationData = reputationResponse?.data ?? {
        agentId,
        reputation: {
          count: 0,
          averageScore: 0,
          distribution: { low: 0, medium: 0, high: 0 },
        },
        recentFeedback: [],
      };
      validations = validationsResponse?.data ?? [];
    } catch (error) {
      // Fallback to mock data if backend not configured or endpoint not available
      if (shouldUseMockData(error)) {
        console.warn(`Backend /api/v1/agents/${agentId} not available, using mock data`);
        agentData = getMockAgent(agentId, validation.chainId!, validation.tokenId!);
        reputationData = {
          agentId,
          reputation: {
            count: 5,
            averageScore: 85,
            distribution: { low: 0, medium: 1, high: 4 },
          },
          recentFeedback: [],
        };
        validations = [];
      } else {
        throw error;
      }
    }

    // Map to frontend format
    const result = mapAgentDetailResponse(agentData, reputationData, validations);

    return successResponse(result);
  } catch (error) {
    // Special handling for not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Agent not found', 'AGENT_NOT_FOUND', 404);
    }
    return handleRouteError(error, 'Failed to fetch agent details', 'FETCH_ERROR');
  }
}
