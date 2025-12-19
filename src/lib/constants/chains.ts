/**
 * Supported blockchain networks
 */
export interface ChainConfig {
  id: number;
  name: string;
  shortName: string;
  rpcEnvVar: string;
  color: string;
  glowColor: string;
  explorerUrl: string;
}

export const CHAINS: Record<number, ChainConfig> = {
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'Sepolia',
    rpcEnvVar: 'SEPOLIA_RPC_URL',
    color: '#fc5454',
    glowColor: 'rgba(252, 84, 84, 0.4)',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'Base',
    rpcEnvVar: 'BASE_SEPOLIA_RPC_URL',
    color: '#5c94fc',
    glowColor: 'rgba(92, 148, 252, 0.4)',
    explorerUrl: 'https://sepolia.basescan.org',
  },
  80002: {
    id: 80002,
    name: 'Polygon Amoy',
    shortName: 'Polygon',
    rpcEnvVar: 'POLYGON_AMOY_RPC_URL',
    color: '#9c54fc',
    glowColor: 'rgba(156, 84, 252, 0.4)',
    explorerUrl: 'https://www.oklink.com/amoy',
  },
} as const;

export const SUPPORTED_CHAIN_IDS = Object.keys(CHAINS).map(Number);

/**
 * Array of supported chain configs for iteration
 */
export const SUPPORTED_CHAINS = Object.values(CHAINS).map((chain) => ({
  chainId: chain.id,
  name: chain.name,
  shortName: chain.shortName,
  explorerUrl: chain.explorerUrl,
}));

export const DEFAULT_CHAIN_ID = 11155111; // Sepolia

/**
 * Get chain config by ID
 */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAINS[chainId];
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId in CHAINS;
}

/**
 * Get transaction explorer URL for a chain
 */
export function getExplorerTxUrl(chainId: number, txHash: string): string | undefined {
  const chain = CHAINS[chainId];
  if (!chain) return undefined;
  return `${chain.explorerUrl}/tx/${txHash}`;
}

/**
 * Get address explorer URL for a chain
 */
export function getExplorerAddressUrl(chainId: number, address: string): string | undefined {
  const chain = CHAINS[chainId];
  if (!chain) return undefined;
  return `${chain.explorerUrl}/address/${address}`;
}
