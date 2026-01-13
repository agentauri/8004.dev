/**
 * x402 Payment Protocol Configuration
 *
 * x402 is a payment protocol that enables micropayments for API calls.
 * Users pay with USDC on Base mainnet for premium endpoints.
 *
 * @see https://x402.org
 */

/**
 * x402 network and payment configuration
 */
export const X402_CONFIG = {
  /** Network identifier (EIP-155 format) */
  network: 'eip155:8453',
  /** Chain ID for Base mainnet */
  chainId: 8453,
  /** USDC token address on Base (CAIP-19 format) */
  asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  /** USDC token address on Base (raw address) */
  usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
  /** Payment recipient address */
  payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D' as const,
  /** USDC decimals */
  usdcDecimals: 6,
} as const;

/**
 * Endpoints that require x402 payment
 */
export const PAID_ENDPOINTS = ['/api/compose', '/api/evaluations', '/api/evaluate'] as const;

export type PaidEndpoint = (typeof PAID_ENDPOINTS)[number];

/**
 * Cost in USD for each paid endpoint
 */
export const ENDPOINT_COSTS: Record<PaidEndpoint, number> = {
  '/api/compose': 0.05,
  '/api/evaluations': 0.05,
  '/api/evaluate': 0.05,
} as const;

/**
 * Cost in USDC micro-units (6 decimals) for each paid endpoint
 */
export const ENDPOINT_COSTS_MICRO: Record<PaidEndpoint, bigint> = {
  '/api/compose': 50000n, // 0.05 USDC = 50000 micro-units
  '/api/evaluations': 50000n,
  '/api/evaluate': 50000n,
} as const;

/**
 * Check if an endpoint requires payment
 */
export function isPaidEndpoint(pathname: string): boolean {
  return PAID_ENDPOINTS.some((endpoint) => pathname.startsWith(endpoint));
}

/**
 * Get the cost for an endpoint in USD
 */
export function getEndpointCost(pathname: string): number | undefined {
  const endpoint = PAID_ENDPOINTS.find((ep) => pathname.startsWith(ep));
  return endpoint ? ENDPOINT_COSTS[endpoint] : undefined;
}

/**
 * Format USDC amount for display (e.g., 50000 -> "$0.05")
 */
export function formatUSDC(microUnits: bigint | number): string {
  const amount = typeof microUnits === 'bigint' ? Number(microUnits) : microUnits;
  const usd = amount / 10 ** X402_CONFIG.usdcDecimals;
  return `$${usd.toFixed(2)}`;
}

/**
 * Parse USDC amount from display format to micro-units
 */
export function parseUSDC(usd: number): bigint {
  return BigInt(Math.round(usd * 10 ** X402_CONFIG.usdcDecimals));
}
