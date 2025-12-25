/**
 * API Input Validation Utilities
 *
 * Provides strict validation for API inputs to prevent injection attacks
 * and ensure data integrity.
 */

/** Valid chain IDs for the platform */
export const VALID_CHAIN_IDS = [11155111, 84532, 80002] as const;
export type ValidChainId = (typeof VALID_CHAIN_IDS)[number];

/** Agent ID format: chainId:tokenId */
const AGENT_ID_PATTERN = /^(\d+):([a-zA-Z0-9]+)$/;

/** Maximum token ID length to prevent DoS */
const MAX_TOKEN_ID_LENGTH = 100;

/** Search query allowed characters (alphanumeric, spaces, common punctuation) */
const SAFE_QUERY_PATTERN = /^[\p{L}\p{N}\s\-_.,!?'"()@#$%&*+=/\\:;<>[\]{}|~`]+$/u;

interface AgentIdValidationResult {
  valid: true;
  chainId: ValidChainId;
  tokenId: string;
}

interface AgentIdValidationError {
  valid: false;
  error: string;
  code: string;
}

/**
 * Validate agent ID format and chain ID
 *
 * @param agentId - Agent ID in format "chainId:tokenId"
 * @returns Validation result with parsed values or error
 */
export function validateAgentId(
  agentId: string | undefined,
): AgentIdValidationResult | AgentIdValidationError {
  if (!agentId || typeof agentId !== 'string') {
    return {
      valid: false,
      error: 'Agent ID is required',
      code: 'MISSING_AGENT_ID',
    };
  }

  const match = agentId.match(AGENT_ID_PATTERN);
  if (!match) {
    return {
      valid: false,
      error: 'Invalid agent ID format. Expected: chainId:tokenId',
      code: 'INVALID_AGENT_ID_FORMAT',
    };
  }

  const [, chainIdStr, tokenId] = match;
  const chainId = parseInt(chainIdStr, 10);

  if (!VALID_CHAIN_IDS.includes(chainId as ValidChainId)) {
    return {
      valid: false,
      error: `Invalid chain ID: ${chainId}. Supported chains: ${VALID_CHAIN_IDS.join(', ')}`,
      code: 'INVALID_CHAIN_ID',
    };
  }

  if (tokenId.length > MAX_TOKEN_ID_LENGTH) {
    return {
      valid: false,
      error: `Token ID too long. Maximum length: ${MAX_TOKEN_ID_LENGTH}`,
      code: 'TOKEN_ID_TOO_LONG',
    };
  }

  return {
    valid: true,
    chainId: chainId as ValidChainId,
    tokenId,
  };
}

interface QueryValidationResult {
  valid: true;
  query: string;
}

interface QueryValidationError {
  valid: false;
  error: string;
  code: string;
}

/** Maximum query length */
const MAX_QUERY_LENGTH = 1000;

/** Minimum query length */
const MIN_QUERY_LENGTH = 1;

/**
 * Validate and sanitize search query
 *
 * @param query - Search query string
 * @returns Validation result with sanitized query or error
 */
export function validateSearchQuery(query: unknown): QueryValidationResult | QueryValidationError {
  if (!query || typeof query !== 'string') {
    return {
      valid: false,
      error: 'Query is required',
      code: 'MISSING_QUERY',
    };
  }

  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Query must be at least ${MIN_QUERY_LENGTH} character`,
      code: 'QUERY_TOO_SHORT',
    };
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Query must be at most ${MAX_QUERY_LENGTH} characters`,
      code: 'QUERY_TOO_LONG',
    };
  }

  if (!SAFE_QUERY_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: 'Query contains invalid characters',
      code: 'INVALID_QUERY_CHARACTERS',
    };
  }

  return {
    valid: true,
    query: trimmed,
  };
}

/**
 * Validate pagination limit
 *
 * @param limit - Requested limit
 * @param maxLimit - Maximum allowed limit
 * @param defaultLimit - Default limit if not provided
 * @returns Validated limit value
 */
export function validateLimit(
  limit: unknown,
  maxLimit: number = 100,
  defaultLimit: number = 20,
): number {
  if (limit === undefined || limit === null) {
    return defaultLimit;
  }

  const parsed = typeof limit === 'number' ? limit : parseInt(String(limit), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultLimit;
  }

  return Math.min(parsed, maxLimit);
}
