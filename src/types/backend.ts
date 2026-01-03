/**
 * Backend API type definitions
 *
 * These types match the backend API response structure.
 * Use mapping functions to convert to frontend types when needed.
 */

/**
 * OASF skill/domain with confidence score.
 * Shared between frontend and backend.
 */
export interface OASFItem {
  slug: string;
  confidence: number;
  reasoning?: string;
}

/**
 * Full OASF classification from backend
 */
export interface BackendOASFClassification {
  skills: OASFItem[];
  domains: OASFItem[];
  confidence: number;
  classifiedAt: string;
  modelVersion: string;
}

/**
 * OASF source indicating how the classification was obtained
 */
export type OASFSource = 'creator-defined' | 'llm-classification' | 'none';

/**
 * Backend endpoint structure
 */
export interface BackendEndpoint {
  url: string;
  version: string;
}

/**
 * Backend endpoints object
 */
export interface BackendEndpoints {
  mcp?: BackendEndpoint;
  a2a?: BackendEndpoint;
  agentWallet?: string;
}

/**
 * Backend registration data
 */
export interface BackendRegistration {
  chainId: number;
  tokenId: string;
  contractAddress: string;
  metadataUri: string;
  owner: string;
  registeredAt: string;
}

/**
 * Agent from backend API
 */
export interface BackendAgent {
  id: string;
  chainId: number;
  tokenId: string;
  name: string;
  description: string;
  image?: string;
  /** Active status - null when not set in registration file */
  active: boolean | null;
  /** Has MCP endpoint - null when not set in registration file */
  hasMcp: boolean | null;
  /** Has A2A endpoint - null when not set in registration file */
  hasA2a: boolean | null;
  /** Supports x402 payments - null when not set in registration file */
  x402Support: boolean | null;
  supportedTrust: string[];
  oasf?: BackendOASFClassification;
  oasfSource?: OASFSource;
  operators?: string[];
  ens?: string;
  did?: string;
  walletAddress?: string;
  /** @deprecated Use registration.owner and registration.registeredAt instead */
  metadata?: {
    owner: string;
    createdAt: string;
  };
  /** Registration data from backend */
  registration?: BackendRegistration;
  /** Endpoint URLs from backend */
  endpoints?: BackendEndpoints;
  /** ISO timestamp of last on-chain update */
  lastUpdatedAt?: string;
  /** Agent warnings/alerts */
  warnings?: BackendAgentWarning[];
  /** Aggregated health score */
  healthScore?: BackendHealthScore;
}

/**
 * Agent with search score from semantic search
 */
export interface BackendSearchResult extends BackendAgent {
  searchScore: number;
  /** Match reasons explaining why this result matched */
  matchReasons?: string[];
}

/**
 * Validation type for ERC-8004 agents.
 * Shared between frontend and backend.
 */
export type ValidationType = 'tee' | 'zkml' | 'stake' | 'none';

/**
 * Validation status.
 * Shared between frontend and backend.
 */
export type ValidationStatus = 'valid' | 'pending' | 'expired' | 'none';

/**
 * Backend validation entry from the Validation Registry
 */
export interface BackendValidation {
  type: ValidationType;
  status: ValidationStatus;
  validatorAddress?: string;
  attestationId?: string;
  timestamp?: string;
  expiresAt?: string;
}

/**
 * Backend reputation response
 */
export interface BackendReputation {
  agentId: string;
  reputation: {
    count: number;
    averageScore: number;
    distribution: {
      low: number;
      medium: number;
      high: number;
    };
  };
  recentFeedback: BackendFeedback[];
}

/**
 * Backend feedback entry
 */
export interface BackendFeedback {
  id: string;
  score: number;
  tags: string[];
  context?: string;
  submitter: string;
  easUid?: string;
  submittedAt: string;
  /** Transaction hash for block explorer link */
  transactionHash?: string;
}

/**
 * Warning severity level
 */
export type WarningSeverity = 'low' | 'medium' | 'high';

/**
 * Warning type categories
 */
export type WarningType = 'metadata' | 'endpoint' | 'reputation';

/**
 * Agent warning from backend
 */
export interface BackendAgentWarning {
  type: WarningType;
  message: string;
  severity: WarningSeverity;
}

/**
 * Health check status
 */
export type HealthCheckStatus = 'pass' | 'warning' | 'fail';

/**
 * Health check category
 */
export type HealthCheckCategory = 'metadata' | 'endpoints' | 'reputation';

/**
 * Individual health check from backend
 */
export interface BackendHealthCheck {
  category: HealthCheckCategory;
  status: HealthCheckStatus;
  score: number;
  message: string;
}

/**
 * Aggregated health score from backend
 */
export interface BackendHealthScore {
  overallScore: number;
  checks: BackendHealthCheck[];
}

/**
 * Similar agent from backend with similarity metrics
 */
export interface BackendSimilarAgent extends BackendAgent {
  /** Similarity score (0-100) based on OASF overlap */
  similarityScore: number;
  /** Skills in common with target agent */
  matchedSkills: string[];
  /** Domains in common with target agent */
  matchedDomains: string[];
}

/**
 * Backend platform stats
 */
export interface BackendPlatformStats {
  /** All agents registered on-chain (including those without metadata) */
  totalAgents: number;
  /** Agents with metadata (registrationFile) */
  withRegistrationFile: number;
  /** Active agents with metadata */
  activeAgents: number;
  chainBreakdown: BackendChainStats[];
}

/**
 * Backend chain stats
 */
export interface BackendChainStats {
  chainId: number;
  name: string;
  shortName: string;
  explorerUrl: string;
  /** All agents on this chain (including without metadata) */
  totalCount: number;
  /** Agents with metadata on this chain */
  withRegistrationFileCount: number;
  /** Active agents with metadata on this chain */
  activeCount: number;
  status: 'ok' | 'error' | 'cached';
}

/**
 * Backend taxonomy response
 */
export interface BackendTaxonomy {
  version: string;
  skills: BackendTaxonomyNode[];
  domains: BackendTaxonomyNode[];
}

/**
 * Backend taxonomy node (hierarchical)
 */
export interface BackendTaxonomyNode {
  slug: string;
  name: string;
  children?: BackendTaxonomyNode[];
}

/**
 * Backend classification status
 */
export interface BackendClassificationStatus {
  status: 'pending' | 'processing' | 'completed';
  estimatedTime?: string;
}

/**
 * Backend search request
 */
export interface BackendSearchRequest {
  query: string;
  limit?: number;
  minScore?: number;
  filters?: {
    chainIds?: number[];
    active?: boolean;
    mcp?: boolean;
  };
}

/**
 * Backend health check response
 */
export interface BackendHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'ok' | 'error';
    cache: 'ok' | 'error';
    search: 'ok' | 'error';
  };
}

// ============================================================================
// Streaming Search Types
// ============================================================================

/**
 * Stream event types for real-time search results
 */
export type BackendStreamEventType = 'result' | 'metadata' | 'error' | 'done';

/**
 * Metadata about the streaming search session
 */
export interface BackendStreamMetadata {
  /** HyDE-generated query used for semantic search */
  hydeQuery: string;
  /** Total number of expected results */
  totalExpected: number;
  /** Model used for reranking results */
  rerankerModel: string;
}

/**
 * Error that occurred during streaming search
 */
export interface BackendStreamError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Individual event from a streaming search response.
 * Uses discriminated union for type-safe event handling.
 */
export type BackendStreamEvent =
  | { type: 'result'; data: BackendSearchResult }
  | { type: 'metadata'; data: BackendStreamMetadata }
  | { type: 'error'; data: BackendStreamError }
  | { type: 'done'; data: null };

// ============================================================================
// Evaluation Types
// ============================================================================

/**
 * Evaluation status lifecycle
 */
export type BackendEvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Benchmark result categories
 */
export type BackendBenchmarkCategory = 'safety' | 'capability' | 'reliability' | 'performance';

/**
 * Individual benchmark result from an evaluation
 */
export interface BackendBenchmarkResult {
  /** Benchmark name identifier */
  name: string;
  /** Category this benchmark belongs to */
  category: BackendBenchmarkCategory;
  /** Achieved score */
  score: number;
  /** Maximum possible score for this benchmark */
  maxScore: number;
  /** Optional details about the benchmark result */
  details?: string;
}

/**
 * Aggregated scores across all benchmarks
 */
export interface BackendEvaluationScores {
  /** Safety-related benchmark scores (0-100) */
  safety: number;
  /** Capability benchmark scores (0-100) */
  capability: number;
  /** Reliability benchmark scores (0-100) */
  reliability: number;
  /** Performance benchmark scores (0-100) */
  performance: number;
}

/**
 * Full evaluation result for an agent
 */
export interface BackendEvaluation {
  /** Unique evaluation identifier */
  id: string;
  /** Agent being evaluated (format: "chainId:tokenId") */
  agentId: string;
  /** Current evaluation status */
  status: BackendEvaluationStatus;
  /** Individual benchmark results */
  benchmarks: BackendBenchmarkResult[];
  /** Aggregated scores by category */
  scores: BackendEvaluationScores;
  /** ISO timestamp when evaluation was created */
  createdAt: string;
  /** ISO timestamp when evaluation completed (if finished) */
  completedAt?: string;
}

// ============================================================================
// Team Composition Types
// ============================================================================

/**
 * Individual team member in a composed team
 */
export interface BackendTeamMember {
  /** Agent identifier (format: "chainId:tokenId") */
  agentId: string;
  /** Role this agent plays in the team */
  role: string;
  /** Description of how this agent contributes to the task */
  contribution: string;
  /** Compatibility score with other team members (0-100) */
  compatibilityScore: number;
}

/**
 * AI-composed team for a specific task
 */
export interface BackendTeamComposition {
  /** Unique team composition identifier */
  id: string;
  /** Task description the team is composed for */
  task: string;
  /** Team members with their roles and contributions */
  team: BackendTeamMember[];
  /** Overall fitness score for this team (0-100) */
  fitnessScore: number;
  /** AI reasoning for this team composition */
  reasoning: string;
  /** ISO timestamp when team was composed */
  createdAt: string;
}

// ============================================================================
// Intent Template Types
// ============================================================================

/**
 * Individual step in a workflow template
 */
export interface BackendWorkflowStep {
  /** Step order in the workflow (1-based) */
  order: number;
  /** Step name identifier */
  name: string;
  /** Description of what this step does */
  description: string;
  /** Role required to execute this step */
  requiredRole: string;
  /** Input data/artifacts needed for this step */
  inputs: string[];
  /** Output data/artifacts produced by this step */
  outputs: string[];
}

/**
 * Predefined intent template for common tasks
 */
export interface BackendIntentTemplate {
  /** Unique template identifier */
  id: string;
  /** Template display name */
  name: string;
  /** Description of what this template accomplishes */
  description: string;
  /** Category for organizing templates */
  category: string;
  /** Ordered workflow steps */
  steps: BackendWorkflowStep[];
  /** Roles required to execute this template */
  requiredRoles: string[];
  /** Agent IDs that match the required roles (when resolved) */
  matchedAgents?: string[];
}

// ============================================================================
// Real-time Event Types
// ============================================================================

/**
 * Event types for real-time updates via WebSocket/SSE
 */
export type BackendEventType =
  | 'agent.created'
  | 'agent.updated'
  | 'agent.classified'
  | 'reputation.changed'
  | 'evaluation.completed';

/**
 * Real-time event payload for agent creation
 */
export interface BackendAgentCreatedEvent {
  agentId: string;
  chainId: number;
  tokenId: string;
  name: string;
}

/**
 * Real-time event payload for agent updates
 */
export interface BackendAgentUpdatedEvent {
  agentId: string;
  changedFields: string[];
}

/**
 * Real-time event payload for OASF classification
 */
export interface BackendAgentClassifiedEvent {
  agentId: string;
  skills: string[];
  domains: string[];
  confidence: number;
}

/**
 * Real-time event payload for reputation changes
 */
export interface BackendReputationChangedEvent {
  agentId: string;
  previousScore: number;
  newScore: number;
  feedbackId: string;
}

/**
 * Real-time event payload for completed evaluations
 */
export interface BackendEvaluationCompletedEvent {
  evaluationId: string;
  agentId: string;
  overallScore: number;
  status: 'completed' | 'failed';
}

/**
 * Union type for all real-time event data payloads
 */
export type BackendRealtimeEventData =
  | BackendAgentCreatedEvent
  | BackendAgentUpdatedEvent
  | BackendAgentClassifiedEvent
  | BackendReputationChangedEvent
  | BackendEvaluationCompletedEvent;

/**
 * Real-time event from WebSocket/SSE connection.
 * Uses discriminated union for type-safe event handling.
 */
export type BackendRealtimeEvent =
  | { type: 'agent.created'; timestamp: string; data: BackendAgentCreatedEvent }
  | { type: 'agent.updated'; timestamp: string; data: BackendAgentUpdatedEvent }
  | { type: 'agent.classified'; timestamp: string; data: BackendAgentClassifiedEvent }
  | { type: 'reputation.changed'; timestamp: string; data: BackendReputationChangedEvent }
  | { type: 'evaluation.completed'; timestamp: string; data: BackendEvaluationCompletedEvent };
