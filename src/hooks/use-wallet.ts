/**
 * Hook for wallet connection and state management.
 *
 * Provides access to wallet state and actions for connecting,
 * disconnecting, and switching networks.
 */

import {
  truncateAddress,
  useWalletContext,
  type WalletContextValue,
} from '@/providers/wallet-provider';

export type { WalletContextValue };
export { truncateAddress };

/**
 * Hook to access wallet state and actions.
 * Must be used within a WalletProvider.
 *
 * @throws Error if used outside of WalletProvider
 *
 * @example
 * ```tsx
 * function WalletStatus() {
 *   const { status, address, connect, disconnect, isReadyForPayment } = useWallet();
 *
 *   if (status === 'disconnected') {
 *     return <button onClick={() => connect()}>Connect Wallet</button>;
 *   }
 *
 *   return (
 *     <div>
 *       <span>{truncateAddress(address!)}</span>
 *       {!isReadyForPayment && <span>Switch to Base</span>}
 *       <button onClick={disconnect}>Disconnect</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWallet(): WalletContextValue {
  return useWalletContext();
}
