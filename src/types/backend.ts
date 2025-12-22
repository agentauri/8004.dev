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
