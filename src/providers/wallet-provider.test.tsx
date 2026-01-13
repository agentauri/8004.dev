import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { truncateAddress, useWalletContext, WalletProvider } from './wallet-provider';

// Mock wagmi hooks with default values that can be overridden per test
const mockUseAccount = vi.fn();
const mockUseConnect = vi.fn();
const mockUseDisconnect = vi.fn();
const mockUseSwitchChain = vi.fn();

// Mock wagmi
vi.mock('wagmi', () => ({
  createConfig: vi.fn(() => ({})),
  http: vi.fn(),
  WagmiProvider: ({ children }: { children: ReactNode }) => children,
  useAccount: () => mockUseAccount(),
  useConnect: () => mockUseConnect(),
  useDisconnect: () => mockUseDisconnect(),
  useSwitchChain: () => mockUseSwitchChain(),
}));

// Mock wagmi/chains
vi.mock('wagmi/chains', () => ({
  base: { id: 8453, name: 'Base' },
}));

// Mock wagmi/connectors
vi.mock('wagmi/connectors', () => ({
  coinbaseWallet: vi.fn(() => ({})),
  injected: vi.fn(() => ({})),
}));

describe('WalletProvider', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    // Reset mocks with default values
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      chainId: undefined,
    });

    mockUseConnect.mockReturnValue({
      connectAsync: vi.fn(),
      connectors: [{ id: 'injected', name: 'MetaMask' }],
      error: null,
    });

    mockUseDisconnect.mockReturnValue({
      disconnectAsync: vi.fn(),
    });

    mockUseSwitchChain.mockReturnValue({
      switchChainAsync: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <WalletProvider>{children}</WalletProvider>
        </QueryClientProvider>
      );
    };
  };

  describe('initial state', () => {
    it('provides disconnected status when not connected', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status).toBe('disconnected');
      expect(result.current.address).toBeNull();
      expect(result.current.chainId).toBeNull();
      expect(result.current.isReadyForPayment).toBe(false);
    });

    it('provides available connectors', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.connectors).toHaveLength(1);
      expect(result.current.connectors[0]).toEqual({
        id: 'injected',
        name: 'MetaMask',
      });
    });
  });

  describe('connected state', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        isConnected: true,
        isConnecting: false,
        chainId: 8453,
      });
    });

    it('provides connected status when wallet is connected', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status).toBe('connected');
      expect(result.current.address).toBe('0x1234567890123456789012345678901234567890');
      expect(result.current.chainId).toBe(8453);
    });

    it('indicates ready for payment on correct network', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCorrectNetwork).toBe(true);
      expect(result.current.isReadyForPayment).toBe(true);
    });
  });

  describe('wrong network', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        isConnected: true,
        isConnecting: false,
        chainId: 1, // Ethereum mainnet, not Base
      });
    });

    it('indicates wrong network when not on Base', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCorrectNetwork).toBe(false);
      expect(result.current.isReadyForPayment).toBe(false);
    });
  });

  describe('connecting state', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: true,
        chainId: undefined,
      });
    });

    it('provides connecting status while connecting', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status).toBe('connecting');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      mockUseConnect.mockReturnValue({
        connectAsync: vi.fn(),
        connectors: [],
        error: new Error('Connection rejected'),
      });
    });

    it('provides error status on connection error', () => {
      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Connection rejected');
    });
  });

  describe('connect action', () => {
    it('calls connectAsync with first connector by default', async () => {
      const mockConnectAsync = vi.fn();
      const mockConnector = { id: 'injected', name: 'MetaMask' };

      mockUseConnect.mockReturnValue({
        connectAsync: mockConnectAsync,
        connectors: [mockConnector],
        error: null,
      });

      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      await result.current.connect();

      expect(mockConnectAsync).toHaveBeenCalledWith({ connector: mockConnector });
    });

    it('calls connectAsync with specified connector', async () => {
      const mockConnectAsync = vi.fn();
      const injectedConnector = { id: 'injected', name: 'MetaMask' };
      const cbConnector = { id: 'coinbaseWallet', name: 'Coinbase Wallet' };

      mockUseConnect.mockReturnValue({
        connectAsync: mockConnectAsync,
        connectors: [injectedConnector, cbConnector],
        error: null,
      });

      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      await result.current.connect('coinbaseWallet');

      expect(mockConnectAsync).toHaveBeenCalledWith({ connector: cbConnector });
    });

    it('throws error when no connector available', async () => {
      mockUseConnect.mockReturnValue({
        connectAsync: vi.fn(),
        connectors: [],
        error: null,
      });

      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.connect()).rejects.toThrow('No wallet connector available');
    });
  });

  describe('disconnect action', () => {
    it('calls disconnectAsync', async () => {
      const mockDisconnectAsync = vi.fn();
      mockUseDisconnect.mockReturnValue({
        disconnectAsync: mockDisconnectAsync,
      });

      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      await result.current.disconnect();

      expect(mockDisconnectAsync).toHaveBeenCalled();
    });
  });

  describe('switchToBase action', () => {
    it('calls switchChainAsync with Base chain ID', async () => {
      const mockSwitchChainAsync = vi.fn();
      mockUseSwitchChain.mockReturnValue({
        switchChainAsync: mockSwitchChainAsync,
      });

      const { result } = renderHook(() => useWalletContext(), {
        wrapper: createWrapper(),
      });

      await result.current.switchToBase();

      expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 8453 });
    });
  });
});

describe('truncateAddress', () => {
  it('truncates address with default params', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(truncateAddress(address)).toBe('0x1234...7890');
  });

  it('truncates address with custom params', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(truncateAddress(address, 10, 6)).toBe('0x12345678...567890');
  });

  it('returns full address if shorter than start + end', () => {
    const address = '0x1234';
    expect(truncateAddress(address)).toBe('0x1234');
  });

  it('handles exactly startChars + endChars length', () => {
    const address = '0x12345678'; // 10 chars = 6 + 4
    expect(truncateAddress(address)).toBe('0x12345678');
  });

  it('handles empty string', () => {
    expect(truncateAddress('')).toBe('');
  });
});

describe('useWalletContext outside provider', () => {
  it('throws error when used outside WalletProvider', () => {
    expect(() => {
      renderHook(() => useWalletContext());
    }).toThrow('useWalletContext must be used within a WalletProvider');
  });
});
