/**
 * Core agent type definitions
 */

import type {
  BackendMcpCapabilities,
  BackendMcpPrompt,
  BackendMcpPromptArgument,
  BackendMcpResource,
  BackendMcpTool,
  HealthCheckCategory,
  HealthCheckStatus,
  OASFItem,
  OASFSource,
  ValidationStatus,
  ValidationType,
  WarningSeverity,
  WarningType,
} from './backend';

// Re-export shared types for consumers
export type {
  HealthCheckCategory,
  HealthCheckStatus,
  OASFItem,
  OASFSource,
  ValidationStatus,
  ValidationType,
  WarningSeverity,
  WarningType,
};

/**
 * Agent registration information from the blockchain
 */
export interface AgentRegistration {
  chainId: number;
  tokenId: string;
  contractAddress: string;
  metadataUri: string;
  owner: string;
  registeredAt: string;
}

/**
 * Agent endpoints for connectivity
 */
export interface AgentEndpoints {
  mcp?: {
    url: string;
    version: string;
  };
  a2a?: {
    url: string;
    version: string;
  };
  ens?: string;
  did?: string;
  agentWallet?: string;
}

// OASFItem is now imported from './backend' and re-exported above

/**
 * OASF taxonomy data
 */
export interface AgentOASF {
  skills: OASFItem[];
  domains: OASFItem[];
}

/**
 * Agent reputation summary
 */
export interface AgentReputation {
  count: number;
  averageScore: number;
  distribution: {
    low: number;
    medium: number;
    high: number;
  };
}

/**
 * Individual feedback entry
 */
export interface AgentFeedback {
  id: string;
  score: number;
  tags: string[];
  context?: string;
  feedbackUri?: string;
  submitter: string;
  timestamp: string;
  /** Transaction hash for block explorer link */
  transactionHash?: string;
}

/**
 * Agent warning for quality/health issues
 */
export interface AgentWarning {
  type: WarningType;
  message: string;
  severity: WarningSeverity;
}

/**
 * Individual health check result
 */
export interface HealthCheck {
  category: HealthCheckCategory;
  status: HealthCheckStatus;
  score: number;
  message: string;
}

/**
 * Aggregated health score for an agent
 */
export interface AgentHealthScore {
  overallScore: number;
  checks: HealthCheck[];
}

// ValidationType and ValidationStatus are now imported from './backend' and re-exported above

/**
 * Agent validation entry from the Validation Registry
 */
export interface AgentValidation {
  type: ValidationType;
  status: ValidationStatus;
  validatorAddress?: string;
  attestationId?: string;
  timestamp?: string;
  expiresAt?: string;
}

/**
 * Reputation trend data point
 */
export interface ReputationTrendPoint {
  date: string;
  score: number;
}

/**
 * Trend direction for reputation changes
 */
export type TrendDirection = 'up' | 'down' | 'stable';

// ============================================================================
// MCP Capabilities Types (mirrored from backend)
// ============================================================================

/**
 * MCP Tool with full details from endpoint crawl
 */
export interface McpTool {
  /** Tool name (identifier) */
  name: string;
  /** Human-readable description */
  description?: string;
  /** JSON Schema for input parameters */
  inputSchema?: Record<string, unknown>;
}

/**
 * MCP Prompt argument
 */
export interface McpPromptArgument {
  /** Argument name */
  name: string;
  /** Argument description */
  description?: string;
  /** Whether this argument is required */
  required?: boolean;
}

/**
 * MCP Prompt with full details from endpoint crawl
 */
export interface McpPrompt {
  /** Prompt name (identifier) */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Prompt arguments */
  arguments?: McpPromptArgument[];
}

/**
 * MCP Resource with full details from endpoint crawl
 */
export interface McpResource {
  /** Resource URI */
  uri: string;
  /** Resource name */
  name: string;
  /** Human-readable description */
  description?: string;
  /** MIME type of the resource content */
  mimeType?: string;
}

/**
 * Full MCP capabilities from endpoint crawl
 */
export interface McpCapabilities {
  /** Detailed tools with descriptions and schemas */
  tools: McpTool[];
  /** Detailed prompts with descriptions and arguments */
  prompts: McpPrompt[];
  /** Detailed resources with URIs and MIME types */
  resources: McpResource[];
  /** When capabilities were last fetched */
  fetchedAt?: string;
  /** Error message if fetch failed */
  error?: string;
}

/**
 * Map backend MCP tool to frontend McpTool
 */
export function mapMcpTool(tool: BackendMcpTool): McpTool {
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  };
}

/**
 * Map backend MCP prompt argument to frontend McpPromptArgument
 */
export function mapMcpPromptArgument(arg: BackendMcpPromptArgument): McpPromptArgument {
  return {
    name: arg.name,
    description: arg.description,
    required: arg.required,
  };
}

/**
 * Map backend MCP prompt to frontend McpPrompt
 */
export function mapMcpPrompt(prompt: BackendMcpPrompt): McpPrompt {
  return {
    name: prompt.name,
    description: prompt.description,
    arguments: prompt.arguments?.map(mapMcpPromptArgument),
  };
}

/**
 * Map backend MCP resource to frontend McpResource
 */
export function mapMcpResource(resource: BackendMcpResource): McpResource {
  return {
    uri: resource.uri,
    name: resource.name,
    description: resource.description,
    mimeType: resource.mimeType,
  };
}

/**
 * Map backend MCP capabilities to frontend McpCapabilities
 */
export function mapMcpCapabilities(caps?: BackendMcpCapabilities): McpCapabilities | undefined {
  if (!caps) return undefined;
  return {
    tools: caps.tools?.map(mapMcpTool) ?? [],
    prompts: caps.prompts?.map(mapMcpPrompt) ?? [],
    resources: caps.resources?.map(mapMcpResource) ?? [],
    fetchedAt: caps.fetchedAt,
    error: caps.error,
  };
}

/**
 * Full agent data
 */
export interface Agent {
  id: string; // Format: "chainId:tokenId"
  chainId: number;
  tokenId: string;
  name: string;
  description: string;
  image?: string;
  endpoints: AgentEndpoints;
  oasf?: AgentOASF;
  /** OASF source indicating how the classification was obtained */
  oasfSource?: OASFSource;
  /** OASF skills declared by agent in registration file */
  declaredOasfSkills?: string[];
  /** OASF domains declared by agent in registration file */
  declaredOasfDomains?: string[];
  supportedTrust: string[];
  active: boolean;
  x402support: boolean;
  registration: AgentRegistration;
  reputation?: AgentReputation;
  /** ISO timestamp of last on-chain update */
  lastUpdatedAt?: string;
  /** Agent warnings/alerts */
  warnings?: AgentWarning[];
  /** Aggregated health score */
  healthScore?: AgentHealthScore;
  /** MCP capabilities with full details from endpoint crawl */
  mcpCapabilities?: McpCapabilities;
}

/**
 * Agent summary for list view
 */
export interface AgentSummary {
  id: string;
  chainId: number;
  tokenId: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
  x402support: boolean;
  hasMcp: boolean;
  hasA2a: boolean;
  supportedTrust: string[];
  oasf?: AgentOASF;
  oasfSource?: OASFSource;
  operators?: string[];
  ens?: string;
  did?: string;
  walletAddress?: string;
  reputationScore?: number;
  reputationCount?: number;
  /** Relevance score from semantic search (0-100) */
  relevanceScore?: number;
  /** Match reasons from semantic search */
  matchReasons?: string[];
  /** Primary validation status */
  validation?: AgentValidation;
  /** Reputation trend direction */
  reputationTrend?: TrendDirection;
  /** Reputation change percentage */
  reputationChange?: number;
  // ============================================================================
  // Gap 1-6 Fields
  // ============================================================================
  /** Trust score from PageRank (0-100) */
  trustScore?: number;
  /** ERC-8004 spec version */
  erc8004Version?: 'v0.4' | 'v1.0';
  /** MCP protocol version */
  mcpVersion?: string;
  /** A2A protocol version */
  a2aVersion?: string;
  /** Curator wallet addresses who gave STAR feedback */
  curatedBy?: string[];
  /** Whether agent is curated */
  isCurated?: boolean;
  /** OASF skills declared by agent in registration file */
  declaredOasfSkills?: string[];
  /** OASF domains declared by agent in registration file */
  declaredOasfDomains?: string[];
  /** Email contact endpoint */
  emailEndpoint?: string;
  /** OASF API endpoint */
  oasfEndpoint?: string;
  /** OASF API version */
  oasfVersion?: string;
  /** Last MCP reachability check timestamp */
  lastReachabilityCheckMcp?: string;
  /** Last A2A reachability check timestamp */
  lastReachabilityCheckA2a?: string;
  /** Wallet address of reachability attestor */
  reachabilityAttestor?: string;
  /** MCP endpoint reachability status */
  isReachableMcp?: boolean;
  /** A2A endpoint reachability status */
  isReachableA2a?: boolean;
  /** Input modes derived from MCP prompts */
  inputModes?: string[];
  /** Output modes derived from MCP resources */
  outputModes?: string[];
}

/**
 * Agent detail response with full data
 */
export interface AgentDetailResponse {
  agent: Agent;
  reputation: AgentReputation;
  recentFeedback: AgentFeedback[];
  /** Validation entries for this agent */
  validations: AgentValidation[];
}

/**
 * Similar agent with similarity metrics
 */
export interface SimilarAgent extends AgentSummary {
  /** Similarity score (0-100) based on OASF overlap */
  similarityScore: number;
  /** Skills in common with target agent */
  matchedSkills: string[];
  /** Domains in common with target agent */
  matchedDomains: string[];
}

// ============================================================================
// Streaming Search Types
// ============================================================================

/**
 * Stream event types for real-time search results
 */
export type StreamEventType = 'result' | 'metadata' | 'error' | 'done';

/**
 * Metadata about the streaming search session
 */
export interface StreamMetadata {
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
export interface StreamError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Individual event from a streaming search response.
 * Uses discriminated union for type-safe event handling.
 */
export type StreamEvent =
  | { type: 'result'; data: AgentSummary }
  | { type: 'metadata'; data: StreamMetadata }
  | { type: 'error'; data: StreamError }
  | { type: 'done'; data: null };

// ============================================================================
// Evaluation Types
// ============================================================================

/**
 * Evaluation status lifecycle
 */
export type EvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Benchmark result categories
 */
export type BenchmarkCategory = 'safety' | 'capability' | 'reliability' | 'performance';

/**
 * Individual benchmark result from an evaluation
 */
export interface BenchmarkResult {
  /** Benchmark name identifier */
  name: string;
  /** Category this benchmark belongs to */
  category: BenchmarkCategory;
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
export interface EvaluationScores {
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
export interface Evaluation {
  /** Unique evaluation identifier */
  id: string;
  /** Agent being evaluated (format: "chainId:tokenId") */
  agentId: string;
  /** Current evaluation status */
  status: EvaluationStatus;
  /** Individual benchmark results */
  benchmarks: BenchmarkResult[];
  /** Aggregated scores by category */
  scores: EvaluationScores;
  /** Date when evaluation was created */
  createdAt: Date;
  /** Date when evaluation completed (if finished) */
  completedAt?: Date;
}

// ============================================================================
// Team Composition Types
// ============================================================================

/**
 * Individual team member in a composed team
 */
export interface TeamMember {
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
export interface TeamComposition {
  /** Unique team composition identifier */
  id: string;
  /** Task description the team is composed for */
  task: string;
  /** Team members with their roles and contributions */
  team: TeamMember[];
  /** Overall fitness score for this team (0-100) */
  fitnessScore: number;
  /** AI reasoning for this team composition */
  reasoning: string;
  /** Date when team was composed */
  createdAt: Date;
}

// ============================================================================
// Intent Template Types
// ============================================================================

/**
 * Individual step in a workflow template
 */
export interface WorkflowStep {
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
export interface IntentTemplate {
  /** Unique template identifier */
  id: string;
  /** Template display name */
  name: string;
  /** Description of what this template accomplishes */
  description: string;
  /** Category for organizing templates */
  category: string;
  /** Ordered workflow steps */
  steps: WorkflowStep[];
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
export type RealtimeEventType =
  | 'agent.created'
  | 'agent.updated'
  | 'agent.classified'
  | 'reputation.changed'
  | 'evaluation.completed';

/**
 * Real-time event payload for agent creation
 */
export interface AgentCreatedEvent {
  agentId: string;
  chainId: number;
  tokenId: string;
  name: string;
}

/**
 * Real-time event payload for agent updates
 */
export interface AgentUpdatedEvent {
  agentId: string;
  changedFields: string[];
}

/**
 * Real-time event payload for OASF classification
 */
export interface AgentClassifiedEvent {
  agentId: string;
  skills: string[];
  domains: string[];
  confidence: number;
}

/**
 * Real-time event payload for reputation changes
 */
export interface ReputationChangedEvent {
  agentId: string;
  previousScore: number;
  newScore: number;
  feedbackId: string;
}

/**
 * Real-time event payload for completed evaluations
 */
export interface EvaluationCompletedEvent {
  evaluationId: string;
  agentId: string;
  overallScore: number;
  status: 'completed' | 'failed';
}

/**
 * Union type for all real-time event data payloads
 */
export type RealtimeEventData =
  | AgentCreatedEvent
  | AgentUpdatedEvent
  | AgentClassifiedEvent
  | ReputationChangedEvent
  | EvaluationCompletedEvent;

/**
 * Real-time event from WebSocket/SSE connection.
 * Uses discriminated union for type-safe event handling.
 */
export type RealtimeEvent =
  | { type: 'agent.created'; timestamp: Date; data: AgentCreatedEvent }
  | { type: 'agent.updated'; timestamp: Date; data: AgentUpdatedEvent }
  | { type: 'agent.classified'; timestamp: Date; data: AgentClassifiedEvent }
  | { type: 'reputation.changed'; timestamp: Date; data: ReputationChangedEvent }
  | { type: 'evaluation.completed'; timestamp: Date; data: EvaluationCompletedEvent };
