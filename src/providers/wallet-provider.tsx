'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import {
  type Config,
  createConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  WagmiProvider as WagmiProviderPrimitive,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { X402_CONFIG } from '@/lib/constants/x402';
import type { WalletConnectionStatus, WalletState } from '@/types/x402';

/**
 * Wagmi configuration for Base mainnet
 * Supports MetaMask (injected) and Coinbase Wallet
 */
export const wagmiConfig: Config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'Agent Explorer',
      appLogoUrl: 'https://8004.dev/logo.png',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

/**
 * Wallet context value
 */
export interface WalletContextValue extends WalletState {
  /** Connect to a wallet */
  connect: (connectorId?: string) => Promise<void>;
  /** Disconnect from wallet */
  disconnect: () => Promise<void>;
  /** Switch to Base mainnet */
  switchToBase: () => Promise<void>;
  /** Check if wallet is ready for payments */
  isReadyForPayment: boolean;
  /** Available wallet connectors */
  connectors: readonly { id: string; name: string }[];
}

const WalletContext = createContext<WalletContextValue | null>(null);

interface WagmiWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper that provides wagmi config to the app.
 * Must be used inside QueryClientProvider.
 *
 * @example
 * ```tsx
 * <QueryClientProvider client={queryClient}>
 *   <WagmiWrapper>
 *     <WalletStateProvider>
 *       <App />
 *     </WalletStateProvider>
 *   </WagmiWrapper>
 * </QueryClientProvider>
 * ```
 */
export function WagmiWrapper({ children }: WagmiWrapperProps) {
  return <WagmiProviderPrimitive config={wagmiConfig}>{children}</WagmiProviderPrimitive>;
}

interface WalletStateProviderProps {
  children: ReactNode;
}

/**
 * Provider for wallet connection state.
 * Must be used inside WagmiWrapper.
 *
 * Features:
 * - Connects to MetaMask or Coinbase Wallet
 * - Tracks connection status
 * - Checks for correct network (Base mainnet)
 * - Provides USDC balance (when implemented)
 *
 * @example
 * ```tsx
 * <WagmiWrapper>
 *   <WalletStateProvider>
 *     <App />
 *   </WalletStateProvider>
 * </WagmiWrapper>
 * ```
 */
export function WalletStateProvider({ children }: WalletStateProviderProps) {
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { connectAsync, connectors, error: connectError } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const status: WalletConnectionStatus = useMemo(() => {
    if (isConnecting) return 'connecting';
    if (connectError) return 'error';
    if (isConnected && address) return 'connected';
    return 'disconnected';
  }, [isConnecting, connectError, isConnected, address]);

  const isCorrectNetwork = chainId === X402_CONFIG.chainId;

  const connect = async (connectorId?: string) => {
    const connector = connectorId ? connectors.find((c) => c.id === connectorId) : connectors[0];

    if (!connector) {
      throw new Error('No wallet connector available');
    }

    await connectAsync({ connector });
  };

  const disconnect = async () => {
    await disconnectAsync();
  };

  const switchToBase = async () => {
    await switchChainAsync({ chainId: X402_CONFIG.chainId });
  };

  const availableConnectors = useMemo(
    () => connectors.map((c) => ({ id: c.id, name: c.name })),
    [connectors],
  );

  const value: WalletContextValue = {
    status,
    address: address ?? null,
    chainId: chainId ?? null,
    isCorrectNetwork,
    usdcBalance: null, // TODO: Implement USDC balance fetching
    error: connectError?.message ?? null,
    connect,
    disconnect,
    switchToBase,
    isReadyForPayment: status === 'connected' && isCorrectNetwork,
    connectors: availableConnectors,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

/**
 * Combined WalletProvider that wraps both WagmiWrapper and WalletStateProvider.
 * Use this for simpler setup.
 *
 * @example
 * ```tsx
 * <QueryClientProvider client={queryClient}>
 *   <WalletProvider>
 *     <App />
 *   </WalletProvider>
 * </QueryClientProvider>
 * ```
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiWrapper>
      <WalletStateProvider>{children}</WalletStateProvider>
    </WagmiWrapper>
  );
}

/**
 * Hook to access wallet context.
 * Must be used within a WalletProvider.
 *
 * @throws Error if used outside of WalletProvider
 *
 * @example
 * ```tsx
 * function WalletButton() {
 *   const { status, address, connect, disconnect } = useWalletContext();
 *
 *   if (status === 'connected') {
 *     return <button onClick={disconnect}>{address}</button>;
 *   }
 *
 *   return <button onClick={() => connect()}>Connect Wallet</button>;
 * }
 * ```
 */
export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }

  return context;
}

/**
 * Truncate address for display (e.g., "0x1234...5678")
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
