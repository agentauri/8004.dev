/**
 * API route for agent OASF classification
 * GET /api/agents/:agentId/classify - Get existing classification
 * POST /api/agents/:agentId/classify - Request new classification
 */

import { NextResponse } from 'next/server';
import { BackendError, backendFetch } from '@/lib/api/backend';
import { validateAgentId } from '@/lib/api/validation';
import type { BackendClassificationStatus, BackendOASFClassification } from '@/types/backend';

interface RouteParams {
  params: Promise<{ agentId: string }>;
}

/**
 * GET - Retrieve existing classification
 * Returns 200 if classification exists, 202 if pending, 404 if not available
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params;

    // Validate agent ID format with strict validation
    const validation = validateAgentId(agentId);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          code: validation.code,
        },
        { status: 400 },
      );
    }

    const response = await backendFetch<BackendOASFClassification | BackendClassificationStatus>(
      `/api/v1/agents/${agentId}/classify`,
      {
        next: { revalidate: 60 },
      },
    );

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Classification GET error:', error);

    if (error instanceof BackendError) {
      // 202 means classification is pending/processing
      if (error.status === 202) {
        return NextResponse.json(
          {
            success: true,
            status: 'pending',
            estimatedTime: '30s',
          },
          { status: 202 },
        );
      }

      // 404 means no classification available
      if (error.status === 404 || error.code === 'NOT_FOUND') {
        return NextResponse.json(
          {
            success: false,
            error: 'No classification available',
            code: 'NOT_FOUND',
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch classification',
        code: 'CLASSIFICATION_ERROR',
      },
      { status: 500 },
    );
  }
}

/**
 * POST - Request new classification
 * Body: { force?: boolean }
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params;

    // Validate agent ID format with strict validation
    const validation = validateAgentId(agentId);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          code: validation.code,
        },
        { status: 400 },
      );
    }

    // Parse optional body
    let body: { force?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional
    }

    const response = await backendFetch<{ status: string; agentId: string }>(
      `/api/v1/agents/${agentId}/classify`,
      {
        method: 'POST',
        body: body.force ? { force: true } : undefined,
      },
    );

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Classification POST error:', error);

    if (error instanceof BackendError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to request classification',
        code: 'CLASSIFICATION_ERROR',
      },
      { status: 500 },
    );
  }
}
