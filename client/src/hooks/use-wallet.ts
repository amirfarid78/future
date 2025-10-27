import { useState, useEffect, useCallback } from "react";
import { connectWallet as web3Connect, disconnectWallet as web3Disconnect } from "@/lib/web3";

export function useWallet() {
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      const result = await web3Connect();
      setAddress(result.address);
      setChainId(result.chainId);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    web3Disconnect();
    setAddress("");
    setChainId(0);
    setIsConnected(false);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Check if already connected
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          window.ethereum.request({ method: "eth_chainId" }).then((chainIdHex: string) => {
            setChainId(parseInt(chainIdHex, 16));
          });
        }
      });

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address, disconnectWallet]);

  return {
    address,
    chainId,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}
