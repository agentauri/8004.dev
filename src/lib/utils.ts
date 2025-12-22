import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Truncates an Ethereum address for display
 * @example truncateAddress('0x1234567890123456789012345678901234567890') => '0x1234...7890'
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a chain ID to its display name
 */
export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    11155111: 'Sepolia',
    84532: 'Base Sepolia',
    80002: 'Polygon Amoy',
  };
  return chains[chainId] || `Chain ${chainId}`;
}

/**
 * Gets the chain key for styling purposes
 */
export function getChainKey(chainId: number): 'sepolia' | 'base' | 'polygon' | 'unknown' {
  const chainKeys: Record<number, 'sepolia' | 'base' | 'polygon'> = {
    11155111: 'sepolia',
    84532: 'base',
    80002: 'polygon',
  };
  return chainKeys[chainId] || 'unknown';
}

/**
 * Determines trust level based on score (0-100)
 */
export function getTrustLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Formats a timestamp to a human-readable date
 */
export function formatDate(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Checks if a date value is valid
 */
export function isValidDate(value: unknown): boolean {
  if (!value) return false;
  const date = new Date(value as string | number | Date);
  return !Number.isNaN(date.getTime());
}

/**
 * Formats a timestamp to a full date and time string, returns null for invalid dates
 */
export function formatDateTimeSafe(
  timestamp: number | string | Date | undefined | null,
): string | null {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to copy to clipboard:', error);
    }
    return false;
  }
}

/**
 * Parses an agent ID in format "chainId:tokenId"
 */
export function parseAgentId(agentId: string): { chainId: number; tokenId: string } | null {
  const parts = agentId.split(':');
  if (parts.length !== 2) return null;

  const chainId = Number.parseInt(parts[0], 10);
  const tokenId = parts[1];

  if (Number.isNaN(chainId) || !tokenId) return null;

  return { chainId, tokenId };
}

/**
 * Creates an agent ID from chain ID and token ID
 */
export function createAgentId(chainId: number, tokenId: string): string {
  return `${chainId}:${tokenId}`;
}
