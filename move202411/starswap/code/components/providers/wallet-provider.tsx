"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { WalletProvider as SuietWalletProvider, useWallet as useSuietWallet } from '@suiet/wallet-kit';
import { toast } from "sonner";
import '@suiet/wallet-kit/style.css';
import { type SuiSignAndExecuteTransactionBlockInput } from '@mysten/sui.js/client';

interface WalletContextType {
  address: string | null;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  signAndExecuteTransaction: (input: SuiSignAndExecuteTransactionBlockInput) => Promise<any>;
  signMessage: (message: string) => Promise<{ signature: string; signedMessage: string; }>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  isConnecting: false,
  signAndExecuteTransaction: async () => {},
  signMessage: async () => ({ signature: '', signedMessage: '' }),
});

export const useWallet = () => useContext(WalletContext);

export function WalletProviderInner({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const wallet = useSuietWallet();

  useEffect(() => {
    if (wallet.connected && wallet.account) {
      setAddress(wallet.account.address);
      setPublicKey(wallet.account.publicKey);
      toast.success("Wallet connected successfully!");
    } else {
      setAddress(null);
      setPublicKey(null);
    }
  }, [wallet.connected, wallet.account]);

  const connect = async () => {
    if (wallet.connecting) return;
    
    try {
      await wallet.select();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const disconnect = () => {
    try {
      wallet.disconnect();
      toast.success("Wallet disconnected successfully!");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet. Please try again.");
    }
  };

  const signAndExecuteTransaction = async (input: SuiSignAndExecuteTransactionBlockInput) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      return await wallet.signAndExecuteTransaction(input);
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed. Please try again.');
      throw error;
    }
  };

  const signMessage = async (message: string) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedMessage = await wallet.signPersonalMessage({
        message: new TextEncoder().encode(message)
      });
      return {
        signature: Buffer.from(signedMessage.signature).toString('hex'),
        signedMessage: message
      };
    } catch (error) {
      console.error('Message signing failed:', error);
      toast.error('Failed to sign message. Please try again.');
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      address,
      publicKey,
      connect, 
      disconnect,
      isConnected: wallet.connected,
      isConnecting: wallet.connecting,
      signAndExecuteTransaction,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <SuietWalletProvider>
      <WalletProviderInner>
        {children}
      </WalletProviderInner>
    </SuietWalletProvider>
  );
}