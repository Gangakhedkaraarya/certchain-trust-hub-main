
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface Web3ContextType {
  account: string | null;
  isIssuer: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isIssuer, setIsIssuer] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // For demo, we'll consider first few accounts as issuers
          setIsIssuer(['0x123', '0x456', '0x789'].includes(accounts[0].toLowerCase()) || Math.random() > 0.5);
          
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
          setChainId(parseInt(chainIdHex, 16));
        }
      } else {
        console.log("Please install MetaMask");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsIssuer(['0x123', '0x456', '0x789'].includes(accounts[0].toLowerCase()) || Math.random() > 0.5);
        } else {
          setAccount(null);
          setIsIssuer(false);
        }
      });
      
      window.ethereum.on('chainChanged', (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask to use this app.");
        return;
      }
      
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        // In a real app, you would check against your contract or backend
        // For demo purposes, some random addresses are issuers
        setIsIssuer(['0x123', '0x456', '0x789'].includes(accounts[0].toLowerCase()) || Math.random() > 0.5);
        
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(parseInt(chainIdHex, 16));
        
        toast.success("Wallet connected successfully!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsIssuer(false);
    setChainId(null);
    toast.info("Wallet disconnected");
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isIssuer,
        connectWallet,
        disconnectWallet,
        isConnecting,
        chainId
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

// Add a type declaration for the window.ethereum object
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}
