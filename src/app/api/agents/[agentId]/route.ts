/**
 * API route for getting agent details
 * GET /api/agents/:agentId
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapAgentDetailResponse } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import { validateAgentId } from '@/lib/api/validation';
import type { BackendAgent, BackendReputation, BackendValidation } from '@/types/backend';

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

    // Use the full reputation response, or create default values
    const reputationData: BackendReputation = reputationResponse?.data ?? {
      agentId,
      reputation: {
        count: 0,
        averageScore: 0,
        distribution: { low: 0, medium: 0, high: 0 },
      },
      recentFeedback: [],
    };

    // Map to frontend format (validations may be null if endpoint doesn't exist)
    const validations = validationsResponse?.data ?? [];
    const result = mapAgentDetailResponse(agentResponse.data, reputationData, validations);

    return successResponse(result);
  } catch (error) {
    // Special handling for not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Agent not found', 'AGENT_NOT_FOUND', 404);
    }
    return handleRouteError(error, 'Failed to fetch agent details', 'FETCH_ERROR');
  }
}
