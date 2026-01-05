/**
 * Type mappers from Backend API types to Frontend types
 *
 * These functions convert the backend API response format to the
 * frontend types used by components and hooks.
 */

import type {
  Agent,
  AgentClassifiedEvent,
  AgentCreatedEvent,
  AgentDetailResponse,
  AgentFeedback,
  AgentHealthScore,
  AgentOASF,
  AgentReputation,
  AgentSummary,
  AgentUpdatedEvent,
  AgentValidation,
  AgentWarning,
  BenchmarkResult,
  Evaluation,
  EvaluationCompletedEvent,
  EvaluationScores,
  HealthCheck,
  IntentTemplate,
  RealtimeEvent,
  ReputationChangedEvent,
  SimilarAgent,
  StreamError,
  StreamEvent,
  StreamMetadata,
  TeamComposition,
  TeamMember,
  WorkflowStep,
} from '@/types/agent';
import type {
  BackendAgent,
  BackendAgentClassifiedEvent,
  BackendAgentCreatedEvent,
  BackendAgentUpdatedEvent,
  BackendAgentWarning,
  BackendBenchmarkResult,
  BackendEvaluation,
  BackendEvaluationCompletedEvent,
  BackendEvaluationScores,
  BackendFeedback,
  BackendHealthCheck,
  BackendHealthScore,
  BackendIntentTemplate,
  BackendOASFClassification,
  BackendRealtimeEvent,
  BackendReputation,
  BackendReputationChangedEvent,
  BackendSearchResult,
  BackendSimilarAgent,
  BackendStreamError,
  BackendStreamEvent,
  BackendStreamMetadata,
  BackendTeamComposition,
  BackendTeamMember,
  BackendValidation,
  BackendWorkflowStep,
} from '@/types/backend';

/**
 * Map backend OASF classification to frontend OASF format
 * Preserves slug, confidence, and reasoning for display
 */
export function mapOASF(oasf?: BackendOASFClassification): AgentOASF | undefined {
  if (!oasf) return undefined;

  return {
    skills: oasf.skills.map((s) => ({
      slug: s.slug,
      confidence: s.confidence,
      reasoning: s.reasoning,
    })),
    domains: oasf.domains.map((d) => ({
      slug: d.slug,
      confidence: d.confidence,
      reasoning: d.reasoning,
    })),
  };
}

/**
 * Get display name with fallback
 * Returns the agent name if available, otherwise "Agent #{tokenId}"
 */
function getDisplayName(name: string | undefined, tokenId: string): string {
  if (name?.trim()) return name;
  return `Agent #${tokenId}`;
}

/**
 * Map backend agent to frontend AgentSummary
 * Used for list views and search results
 *
 * Note: Backend may return null for boolean fields when not set in registration file.
 * We convert null to false for frontend consistency.
 */
export function mapAgentToSummary(agent: BackendAgent): AgentSummary {
  return {
    id: `${agent.chainId}:${agent.tokenId}`,
    chainId: agent.chainId,
    tokenId: agent.tokenId,
    name: getDisplayName(agent.name, agent.tokenId),
    description: agent.description,
    image: agent.image,
    active: agent.active ?? false,
    x402support: agent.x402Support ?? false, // Note: case difference
    hasMcp: agent.hasMcp ?? false,
    hasA2a: agent.hasA2a ?? false,
    supportedTrust: agent.supportedTrust,
    oasf: mapOASF(agent.oasf),
    oasfSource: agent.oasfSource,
    operators: agent.operators,
    ens: agent.ens,
    did: agent.did,
    walletAddress: agent.walletAddress,
    // Reputation is not included in basic agent response
    reputationScore: undefined,
    reputationCount: undefined,
  };
}

/**
 * Map backend search result to frontend AgentSummary
 * Includes search score mapped to relevanceScore for display
 */
export function mapSearchResultToSummary(result: BackendSearchResult): AgentSummary {
  return {
    ...mapAgentToSummary(result),
    // Relevance score from semantic search (0-100)
    relevanceScore: Math.round(result.searchScore * 100),
    // Match reasons explaining why this result matched
    matchReasons: result.matchReasons,
  };
}

/**
 * Map backend validation to frontend AgentValidation
 */
export function mapValidation(validation?: BackendValidation): AgentValidation | undefined {
  if (!validation) return undefined;

  return {
    type: validation.type,
    status: validation.status,
    validatorAddress: validation.validatorAddress,
    attestationId: validation.attestationId,
    timestamp: validation.timestamp,
    expiresAt: validation.expiresAt,
  };
}

/**
 * Map backend warning to frontend AgentWarning
 */
export function mapWarning(warning: BackendAgentWarning): AgentWarning {
  return {
    type: warning.type,
    message: warning.message,
    severity: warning.severity,
  };
}

/**
 * Map backend warnings array to frontend AgentWarning array
 */
export function mapWarnings(warnings?: BackendAgentWarning[]): AgentWarning[] {
  if (!warnings) return [];
  return warnings.map(mapWarning);
}

/**
 * Map backend health check to frontend HealthCheck
 */
export function mapHealthCheck(check: BackendHealthCheck): HealthCheck {
  return {
    category: check.category,
    status: check.status,
    score: check.score,
    message: check.message,
  };
}

/**
 * Map backend health score to frontend AgentHealthScore
 */
export function mapHealthScore(healthScore?: BackendHealthScore): AgentHealthScore | undefined {
  if (!healthScore) return undefined;
  return {
    overallScore: healthScore.overallScore,
    checks: healthScore.checks.map(mapHealthCheck),
  };
}

/**
 * Map backend agent to full frontend Agent
 * Used for detail views
 *
 * Note: Backend may return null for boolean fields when not set in registration file.
 * We convert null to false for frontend consistency.
 */
export function mapAgentToFull(agent: BackendAgent): Agent {
  return {
    id: `${agent.chainId}:${agent.tokenId}`,
    chainId: agent.chainId,
    tokenId: agent.tokenId,
    name: getDisplayName(agent.name, agent.tokenId),
    description: agent.description,
    image: agent.image,
    active: agent.active ?? false,
    x402support: agent.x402Support ?? false,
    supportedTrust: agent.supportedTrust,
    oasf: mapOASF(agent.oasf),
    endpoints: {
      // Use actual endpoint data from backend, fall back to flags for presence indication
      mcp: agent.endpoints?.mcp ?? (agent.hasMcp ? { url: '', version: '' } : undefined),
      a2a: agent.endpoints?.a2a ?? (agent.hasA2a ? { url: '', version: '' } : undefined),
      ens: agent.ens,
      did: agent.did,
      agentWallet: agent.endpoints?.agentWallet ?? agent.walletAddress,
    },
    registration: {
      chainId: agent.chainId,
      tokenId: agent.tokenId,
      contractAddress: agent.registration?.contractAddress ?? '',
      metadataUri: agent.registration?.metadataUri ?? '',
      // Use registration fields first, fall back to deprecated metadata fields
      owner: agent.registration?.owner ?? agent.metadata?.owner ?? '',
      registeredAt: agent.registration?.registeredAt ?? agent.metadata?.createdAt ?? '',
    },
    lastUpdatedAt: agent.lastUpdatedAt,
    warnings: mapWarnings(agent.warnings),
    healthScore: mapHealthScore(agent.healthScore),
  };
}

/**
 * Map backend feedback to frontend AgentFeedback
 */
export function mapFeedback(feedback: BackendFeedback): AgentFeedback {
  return {
    id: feedback.id,
    score: feedback.score,
    tags: feedback.tags,
    context: feedback.context,
    submitter: feedback.submitter,
    timestamp: feedback.submittedAt, // Note: field name difference
    feedbackUri: feedback.easUid
      ? `https://sepolia.easscan.org/attestation/view/${feedback.easUid}`
      : undefined,
    transactionHash: feedback.transactionHash,
  };
}

/**
 * Map backend reputation to frontend AgentReputation
 */
export function mapReputation(rep: BackendReputation): AgentReputation {
  return {
    count: rep.reputation.count,
    averageScore: rep.reputation.averageScore,
    distribution: rep.reputation.distribution ?? { low: 0, medium: 0, high: 0 },
  };
}

/**
 * Map backend validations array to frontend AgentValidation array
 */
export function mapValidations(validations?: BackendValidation[]): AgentValidation[] {
  if (!validations) return [];
  return validations.map(mapValidation).filter((v): v is AgentValidation => v !== undefined);
}

/**
 * Combine backend agent and reputation into AgentDetailResponse
 */
export function mapAgentDetailResponse(
  agent: BackendAgent,
  reputation: BackendReputation,
  validations?: BackendValidation[],
): AgentDetailResponse {
  const mappedAgent = mapAgentToFull(agent);

  return {
    agent: {
      ...mappedAgent,
      reputation: mapReputation(reputation),
    },
    reputation: mapReputation(reputation),
    recentFeedback: reputation.recentFeedback.map(mapFeedback),
    validations: mapValidations(validations),
  };
}

/**
 * Map backend agents array to frontend AgentSummary array
 */
export function mapAgentsToSummaries(agents: BackendAgent[]): AgentSummary[] {
  return agents.map(mapAgentToSummary);
}

/**
 * Map backend search results to frontend AgentSummary array
 */
export function mapSearchResultsToSummaries(results: BackendSearchResult[]): AgentSummary[] {
  return results.map(mapSearchResultToSummary);
}

/**
 * Map backend similar agent to frontend SimilarAgent
 */
export function mapSimilarAgent(agent: BackendSimilarAgent): SimilarAgent {
  return {
    ...mapAgentToSummary(agent),
    similarityScore: agent.similarityScore,
    matchedSkills: agent.matchedSkills,
    matchedDomains: agent.matchedDomains,
  };
}

/**
 * Map backend similar agents array to frontend SimilarAgent array
 */
export function mapSimilarAgents(agents: BackendSimilarAgent[]): SimilarAgent[] {
  return agents.map(mapSimilarAgent);
}

// ============================================================================
// Streaming Search Mappers
// ============================================================================

/**
 * Map backend stream metadata to frontend StreamMetadata
 */
export function mapStreamMetadata(metadata: BackendStreamMetadata): StreamMetadata {
  return {
    hydeQuery: metadata.hydeQuery,
    totalExpected: metadata.totalExpected,
    rerankerModel: metadata.rerankerModel,
  };
}

/**
 * Map backend stream error to frontend StreamError
 */
export function mapStreamError(error: BackendStreamError): StreamError {
  return {
    code: error.code,
    message: error.message,
  };
}

/**
 * Map backend stream event to frontend StreamEvent.
 * Handles discriminated union mapping for type-safe event processing.
 */
export function mapStreamEvent(event: BackendStreamEvent): StreamEvent {
  switch (event.type) {
    case 'result':
      return {
        type: 'result',
        data: mapSearchResultToSummary(event.data),
      };
    case 'metadata':
      return {
        type: 'metadata',
        data: mapStreamMetadata(event.data),
      };
    case 'error':
      return {
        type: 'error',
        data: mapStreamError(event.data),
      };
    case 'done':
      return {
        type: 'done',
        data: null,
      };
  }
}

// ============================================================================
// Evaluation Mappers
// ============================================================================

/**
 * Map backend benchmark result to frontend BenchmarkResult
 */
export function mapBenchmarkResult(result: BackendBenchmarkResult): BenchmarkResult {
  return {
    name: result.name,
    category: result.category,
    score: result.score,
    maxScore: result.maxScore,
    details: result.details,
  };
}

/**
 * Map backend evaluation scores to frontend EvaluationScores
 */
export function mapEvaluationScores(scores?: BackendEvaluationScores): EvaluationScores {
  return {
    safety: scores?.safety ?? 0,
    capability: scores?.capability ?? 0,
    reliability: scores?.reliability ?? 0,
    performance: scores?.performance ?? 0,
  };
}

/**
 * Map backend evaluation to frontend Evaluation.
 * Converts ISO timestamp strings to Date objects.
 */
export function mapEvaluation(evaluation: BackendEvaluation): Evaluation {
  return {
    id: evaluation.id,
    agentId: evaluation.agentId,
    status: evaluation.status ?? 'pending',
    benchmarks: (evaluation.benchmarks ?? []).map(mapBenchmarkResult),
    scores: mapEvaluationScores(evaluation.scores),
    createdAt: new Date(evaluation.createdAt ?? Date.now()),
    completedAt: evaluation.completedAt ? new Date(evaluation.completedAt) : undefined,
  };
}

/**
 * Map backend evaluations array to frontend Evaluation array
 */
export function mapEvaluations(evaluations: BackendEvaluation[]): Evaluation[] {
  return evaluations.map(mapEvaluation);
}

// ============================================================================
// Team Composition Mappers
// ============================================================================

/**
 * Map backend team member to frontend TeamMember
 */
export function mapTeamMember(member: BackendTeamMember): TeamMember {
  return {
    agentId: member.agentId,
    role: member.role,
    contribution: member.contribution,
    compatibilityScore: member.compatibilityScore,
  };
}

/**
 * Map backend team composition to frontend TeamComposition.
 * Converts ISO timestamp string to Date object.
 */
export function mapTeamComposition(composition: BackendTeamComposition): TeamComposition {
  return {
    id: composition.id,
    task: composition.task,
    team: composition.team.map(mapTeamMember),
    fitnessScore: composition.fitnessScore,
    reasoning: composition.reasoning,
    createdAt: new Date(composition.createdAt),
  };
}

/**
 * Map backend team compositions array to frontend TeamComposition array
 */
export function mapTeamCompositions(compositions: BackendTeamComposition[]): TeamComposition[] {
  return compositions.map(mapTeamComposition);
}

// ============================================================================
// Intent Template Mappers
// ============================================================================

/**
 * Map backend workflow step to frontend WorkflowStep
 */
export function mapWorkflowStep(step: BackendWorkflowStep): WorkflowStep {
  return {
    order: step.order ?? 0,
    name: step.name ?? '',
    description: step.description ?? '',
    requiredRole: step.requiredRole ?? '',
    inputs: step.inputs ?? [],
    outputs: step.outputs ?? [],
  };
}

/**
 * Map backend intent template to frontend IntentTemplate
 * Handles missing/undefined data with sensible defaults
 */
export function mapIntentTemplate(template: BackendIntentTemplate): IntentTemplate {
  return {
    id: template.id ?? '',
    name: template.name ?? 'Unnamed Template',
    description: template.description ?? '',
    category: template.category ?? 'general',
    steps: (template.steps ?? []).map(mapWorkflowStep),
    requiredRoles: template.requiredRoles ?? [],
    matchedAgents: template.matchedAgents,
  };
}

/**
 * Map backend intent templates array to frontend IntentTemplate array
 */
export function mapIntentTemplates(templates: BackendIntentTemplate[]): IntentTemplate[] {
  return templates.map(mapIntentTemplate);
}

// ============================================================================
// Real-time Event Mappers
// ============================================================================

/**
 * Map backend agent created event to frontend AgentCreatedEvent
 */
export function mapAgentCreatedEvent(event: BackendAgentCreatedEvent): AgentCreatedEvent {
  return {
    agentId: event.agentId,
    chainId: event.chainId,
    tokenId: event.tokenId,
    name: event.name,
  };
}

/**
 * Map backend agent updated event to frontend AgentUpdatedEvent
 */
export function mapAgentUpdatedEvent(event: BackendAgentUpdatedEvent): AgentUpdatedEvent {
  return {
    agentId: event.agentId,
    changedFields: event.changedFields,
  };
}

/**
 * Map backend agent classified event to frontend AgentClassifiedEvent
 */
export function mapAgentClassifiedEvent(event: BackendAgentClassifiedEvent): AgentClassifiedEvent {
  return {
    agentId: event.agentId,
    skills: event.skills,
    domains: event.domains,
    confidence: event.confidence,
  };
}

/**
 * Map backend reputation changed event to frontend ReputationChangedEvent
 */
export function mapReputationChangedEvent(
  event: BackendReputationChangedEvent,
): ReputationChangedEvent {
  return {
    agentId: event.agentId,
    previousScore: event.previousScore,
    newScore: event.newScore,
    feedbackId: event.feedbackId,
  };
}

/**
 * Map backend evaluation completed event to frontend EvaluationCompletedEvent
 */
export function mapEvaluationCompletedEvent(
  event: BackendEvaluationCompletedEvent,
): EvaluationCompletedEvent {
  return {
    evaluationId: event.evaluationId,
    agentId: event.agentId,
    overallScore: event.overallScore,
    status: event.status,
  };
}

/**
 * Map backend realtime event to frontend RealtimeEvent.
 * Handles discriminated union mapping and converts timestamp to Date.
 */
export function mapRealtimeEvent(event: BackendRealtimeEvent): RealtimeEvent {
  const timestamp = new Date(event.timestamp);

  switch (event.type) {
    case 'agent.created':
      return {
        type: 'agent.created',
        timestamp,
        data: mapAgentCreatedEvent(event.data),
      };
    case 'agent.updated':
      return {
        type: 'agent.updated',
        timestamp,
        data: mapAgentUpdatedEvent(event.data),
      };
    case 'agent.classified':
      return {
        type: 'agent.classified',
        timestamp,
        data: mapAgentClassifiedEvent(event.data),
      };
    case 'reputation.changed':
      return {
        type: 'reputation.changed',
        timestamp,
        data: mapReputationChangedEvent(event.data),
      };
    case 'evaluation.completed':
      return {
        type: 'evaluation.completed',
        timestamp,
        data: mapEvaluationCompletedEvent(event.data),
      };
  }
}
