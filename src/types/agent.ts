/**
 * Core agent type definitions
 */

import type {
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
