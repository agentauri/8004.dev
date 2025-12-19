import { describe, expect, it } from 'vitest';
import {
  CHAINS,
  DEFAULT_CHAIN_ID,
  getChainConfig,
  getExplorerAddressUrl,
  getExplorerTxUrl,
  isSupportedChain,
  SUPPORTED_CHAIN_IDS,
  SUPPORTED_CHAINS,
} from './chains';

describe('chains constants', () => {
  describe('CHAINS', () => {
    it('contains Ethereum Sepolia', () => {
      expect(CHAINS[11155111]).toEqual({
        id: 11155111,
        name: 'Ethereum Sepolia',
        shortName: 'Sepolia',
        rpcEnvVar: 'SEPOLIA_RPC_URL',
        color: '#fc5454',
        glowColor: 'rgba(252, 84, 84, 0.4)',
        explorerUrl: 'https://sepolia.etherscan.io',
      });
    });

    it('contains Base Sepolia', () => {
      expect(CHAINS[84532]).toEqual({
        id: 84532,
        name: 'Base Sepolia',
        shortName: 'Base',
        rpcEnvVar: 'BASE_SEPOLIA_RPC_URL',
        color: '#5c94fc',
        glowColor: 'rgba(92, 148, 252, 0.4)',
        explorerUrl: 'https://sepolia.basescan.org',
      });
    });

    it('contains Polygon Amoy', () => {
      expect(CHAINS[80002]).toEqual({
        id: 80002,
        name: 'Polygon Amoy',
        shortName: 'Polygon',
        rpcEnvVar: 'POLYGON_AMOY_RPC_URL',
        color: '#9c54fc',
        glowColor: 'rgba(156, 84, 252, 0.4)',
        explorerUrl: 'https://www.oklink.com/amoy',
      });
    });

    it('has exactly 3 chains', () => {
      expect(Object.keys(CHAINS)).toHaveLength(3);
    });
  });

  describe('SUPPORTED_CHAIN_IDS', () => {
    it('contains all chain IDs as numbers', () => {
      expect(SUPPORTED_CHAIN_IDS).toContain(11155111);
      expect(SUPPORTED_CHAIN_IDS).toContain(84532);
      expect(SUPPORTED_CHAIN_IDS).toContain(80002);
    });

    it('has correct length', () => {
      expect(SUPPORTED_CHAIN_IDS).toHaveLength(3);
    });

    it('contains only numbers', () => {
      SUPPORTED_CHAIN_IDS.forEach((id) => {
        expect(typeof id).toBe('number');
      });
    });
  });

  describe('SUPPORTED_CHAINS', () => {
    it('contains all chains with correct format', () => {
      expect(SUPPORTED_CHAINS).toHaveLength(3);

      const sepolia = SUPPORTED_CHAINS.find((c) => c.chainId === 11155111);
      expect(sepolia).toEqual({
        chainId: 11155111,
        name: 'Ethereum Sepolia',
        shortName: 'Sepolia',
        explorerUrl: 'https://sepolia.etherscan.io',
      });

      const base = SUPPORTED_CHAINS.find((c) => c.chainId === 84532);
      expect(base).toEqual({
        chainId: 84532,
        name: 'Base Sepolia',
        shortName: 'Base',
        explorerUrl: 'https://sepolia.basescan.org',
      });

      const polygon = SUPPORTED_CHAINS.find((c) => c.chainId === 80002);
      expect(polygon).toEqual({
        chainId: 80002,
        name: 'Polygon Amoy',
        shortName: 'Polygon',
        explorerUrl: 'https://www.oklink.com/amoy',
      });
    });

    it('does not include internal properties', () => {
      SUPPORTED_CHAINS.forEach((chain) => {
        expect(chain).not.toHaveProperty('rpcEnvVar');
        expect(chain).not.toHaveProperty('color');
        expect(chain).not.toHaveProperty('glowColor');
        expect(chain).not.toHaveProperty('id');
      });
    });
  });

  describe('DEFAULT_CHAIN_ID', () => {
    it('is Sepolia', () => {
      expect(DEFAULT_CHAIN_ID).toBe(11155111);
    });
  });

  describe('getChainConfig', () => {
    it('returns config for valid chain ID', () => {
      const config = getChainConfig(11155111);
      expect(config).toBeDefined();
      expect(config?.name).toBe('Ethereum Sepolia');
    });

    it('returns config for Base Sepolia', () => {
      const config = getChainConfig(84532);
      expect(config).toBeDefined();
      expect(config?.name).toBe('Base Sepolia');
    });

    it('returns config for Polygon Amoy', () => {
      const config = getChainConfig(80002);
      expect(config).toBeDefined();
      expect(config?.name).toBe('Polygon Amoy');
    });

    it('returns undefined for invalid chain ID', () => {
      expect(getChainConfig(999999)).toBeUndefined();
    });

    it('returns undefined for 0', () => {
      expect(getChainConfig(0)).toBeUndefined();
    });

    it('returns undefined for negative numbers', () => {
      expect(getChainConfig(-1)).toBeUndefined();
    });
  });

  describe('isSupportedChain', () => {
    it('returns true for Sepolia', () => {
      expect(isSupportedChain(11155111)).toBe(true);
    });

    it('returns true for Base Sepolia', () => {
      expect(isSupportedChain(84532)).toBe(true);
    });

    it('returns true for Polygon Amoy', () => {
      expect(isSupportedChain(80002)).toBe(true);
    });

    it('returns false for mainnet', () => {
      expect(isSupportedChain(1)).toBe(false);
    });

    it('returns false for random ID', () => {
      expect(isSupportedChain(123456)).toBe(false);
    });

    it('returns false for 0', () => {
      expect(isSupportedChain(0)).toBe(false);
    });
  });

  describe('getExplorerTxUrl', () => {
    const testTxHash = '0x1234567890abcdef1234567890abcdef12345678';

    it('returns correct URL for Sepolia', () => {
      const url = getExplorerTxUrl(11155111, testTxHash);
      expect(url).toBe(`https://sepolia.etherscan.io/tx/${testTxHash}`);
    });

    it('returns correct URL for Base Sepolia', () => {
      const url = getExplorerTxUrl(84532, testTxHash);
      expect(url).toBe(`https://sepolia.basescan.org/tx/${testTxHash}`);
    });

    it('returns correct URL for Polygon Amoy', () => {
      const url = getExplorerTxUrl(80002, testTxHash);
      expect(url).toBe(`https://www.oklink.com/amoy/tx/${testTxHash}`);
    });

    it('returns undefined for unsupported chain', () => {
      expect(getExplorerTxUrl(999999, testTxHash)).toBeUndefined();
    });
  });

  describe('getExplorerAddressUrl', () => {
    const testAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

    it('returns correct URL for Sepolia', () => {
      const url = getExplorerAddressUrl(11155111, testAddress);
      expect(url).toBe(`https://sepolia.etherscan.io/address/${testAddress}`);
    });

    it('returns correct URL for Base Sepolia', () => {
      const url = getExplorerAddressUrl(84532, testAddress);
      expect(url).toBe(`https://sepolia.basescan.org/address/${testAddress}`);
    });

    it('returns correct URL for Polygon Amoy', () => {
      const url = getExplorerAddressUrl(80002, testAddress);
      expect(url).toBe(`https://www.oklink.com/amoy/address/${testAddress}`);
    });

    it('returns undefined for unsupported chain', () => {
      expect(getExplorerAddressUrl(999999, testAddress)).toBeUndefined();
    });
  });
});
