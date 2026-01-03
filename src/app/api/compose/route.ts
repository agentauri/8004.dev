/**
 * API route for team composition
 * POST /api/compose - Find optimal agent team for a task
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendTeamComposition } from '@/types/backend';

/** Request body for composing a team */
interface ComposeTeamRequest {
  /** Task description to compose a team for */
  task: string;
  /** Maximum number of team members (2-10, default: 5) */
  maxTeamSize?: number;
  /** Required capabilities for team members */
  requiredCapabilities?: string[];
}

/** Valid capability values */
const VALID_CAPABILITIES = ['mcp', 'a2a', 'x402'];

/**
 * Maps backend team composition to frontend format
 */
function mapTeamComposition(backend: BackendTeamComposition): {
  id: string;
  task: string;
  team: Array<{
    agentId: string;
    role: string;
    contribution: string;
    compatibilityScore: number;
  }>;
  fitnessScore: number;
  reasoning: string;
  createdAt: Date;
} {
  return {
    id: backend.id,
    task: backend.task,
    team: backend.team.map((member) => ({
      agentId: member.agentId,
      role: member.role,
      contribution: member.contribution,
      compatibilityScore: member.compatibilityScore,
    })),
    fitnessScore: backend.fitnessScore,
    reasoning: backend.reasoning,
    createdAt: new Date(backend.createdAt),
  };
}

/**
 * POST /api/compose
 * Find optimal agent team for a task
 *
 * Body:
 * - task: Task description (required, 1-1000 characters)
 * - maxTeamSize: Maximum team members (optional, 2-10, default: 5)
 * - requiredCapabilities: Required capabilities (optional, array of mcp/a2a/x402)
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = (await request.json()) as ComposeTeamRequest;

    // Validate task
    if (!body.task) {
      return errorResponse('task is required', 'MISSING_TASK', 400);
    }

    if (typeof body.task !== 'string') {
      return errorResponse('task must be a string', 'INVALID_TASK', 400);
    }

    const task = body.task.trim();

    if (task.length === 0) {
      return errorResponse('task cannot be empty', 'EMPTY_TASK', 400);
    }

    if (task.length > 1000) {
      return errorResponse('task must be 1000 characters or less', 'TASK_TOO_LONG', 400);
    }

    // Validate maxTeamSize
    let maxTeamSize = 5; // default
    if (body.maxTeamSize !== undefined) {
      if (typeof body.maxTeamSize !== 'number' || !Number.isInteger(body.maxTeamSize)) {
        return errorResponse('maxTeamSize must be an integer', 'INVALID_MAX_TEAM_SIZE', 400);
      }
      if (body.maxTeamSize < 2 || body.maxTeamSize > 10) {
        return errorResponse('maxTeamSize must be between 2 and 10', 'INVALID_MAX_TEAM_SIZE', 400);
      }
      maxTeamSize = body.maxTeamSize;
    }

    // Validate requiredCapabilities
    let requiredCapabilities: string[] | undefined;
    if (body.requiredCapabilities !== undefined) {
      if (!Array.isArray(body.requiredCapabilities)) {
        return errorResponse('requiredCapabilities must be an array', 'INVALID_CAPABILITIES', 400);
      }
      for (const cap of body.requiredCapabilities) {
        if (typeof cap !== 'string') {
          return errorResponse('requiredCapabilities must be strings', 'INVALID_CAPABILITIES', 400);
        }
        if (!VALID_CAPABILITIES.includes(cap.toLowerCase())) {
          return errorResponse(
            `Invalid capability: ${cap}. Valid values: ${VALID_CAPABILITIES.join(', ')}`,
            'INVALID_CAPABILITY',
            400,
          );
        }
      }
      if (body.requiredCapabilities.length > 0) {
        requiredCapabilities = body.requiredCapabilities.map((c) => c.toLowerCase());
      }
    }

    // Build request payload
    const payload: {
      task: string;
      maxTeamSize: number;
      requiredCapabilities?: string[];
    } = {
      task,
      maxTeamSize,
    };

    if (requiredCapabilities && requiredCapabilities.length > 0) {
      payload.requiredCapabilities = requiredCapabilities;
    }

    // Call backend API
    const response = await backendFetch<BackendTeamComposition>('/api/v1/compose', {
      method: 'POST',
      body: payload,
      cache: 'no-store',
    });

    // Map to frontend format
    const composition = mapTeamComposition(response.data);

    return successResponse(composition, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    // Handle specific error cases
    if (error instanceof BackendError) {
      if (error.code === 'NO_SUITABLE_AGENTS') {
        return errorResponse('No suitable agents found for this task', 'NO_SUITABLE_AGENTS', 404);
      }
      if (error.code === 'TASK_TOO_COMPLEX') {
        return errorResponse('Task is too complex to compose a team', 'TASK_TOO_COMPLEX', 422);
      }
    }
    return handleRouteError(error, 'Failed to compose team', 'COMPOSE_TEAM_ERROR');
  }
}
