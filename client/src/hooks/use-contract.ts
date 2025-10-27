import { useState, useCallback } from "react";
import {
  approveUSDT,
  depositInvestment,
  claimRewards as web3ClaimRewards,
  withdrawReferral as web3WithdrawReferral,
  getUserData,
  getUSDTBalance,
  getUSDTAllowance,
  claimFaucet as web3ClaimFaucet,
} from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

export function useContract(address: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleError = useCallback(
    (error: any, defaultMessage: string) => {
      console.error(error);
      const message = error?.reason || error?.message || defaultMessage;
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: message,
      });
    },
    [toast]
  );

  const handleSuccess = useCallback(
    (title: string, description?: string) => {
      toast({
        title,
        description: description || "Transaction completed successfully",
      });
    },
    [toast]
  );

  const approve = useCallback(
    async (amount: string) => {
      setIsLoading(true);
      try {
        const receipt = await approveUSDT(amount);
        handleSuccess("Approval Successful", `Approved ${amount} USDT for staking`);
        return receipt;
      } catch (error) {
        handleError(error, "Failed to approve USDT");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleSuccess, handleError]
  );

  const deposit = useCallback(
    async (amount: string, referrer: string) => {
      setIsLoading(true);
      try {
        const receipt = await depositInvestment(amount, referrer);
        handleSuccess("Deposit Successful", `Deposited ${amount} USDT`);
        return receipt;
      } catch (error) {
        handleError(error, "Failed to deposit");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleSuccess, handleError]
  );

  const claimRewards = useCallback(async () => {
    setIsLoading(true);
    try {
      const receipt = await web3ClaimRewards();
      handleSuccess("Rewards Claimed", "Your rewards have been claimed successfully");
      return receipt;
    } catch (error) {
      handleError(error, "Failed to claim rewards");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccess, handleError]);

  const withdrawReferral = useCallback(async () => {
    setIsLoading(true);
    try {
      const receipt = await web3WithdrawReferral();
      handleSuccess("Withdrawal Successful", "Referral balance withdrawn successfully");
      return receipt;
    } catch (error) {
      handleError(error, "Failed to withdraw referral balance");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccess, handleError]);

  const fetchUserData = useCallback(async () => {
    if (!address) return null;
    try {
      return await getUserData(address);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  }, [address]);

  const fetchUSDTBalance = useCallback(async () => {
    if (!address) return "0";
    try {
      return await getUSDTBalance(address);
    } catch (error) {
      console.error("Failed to fetch USDT balance:", error);
      return "0";
    }
  }, [address]);

  const checkAllowance = useCallback(async () => {
    if (!address) return "0";
    try {
      return await getUSDTAllowance(address);
    } catch (error) {
      console.error("Failed to check allowance:", error);
      return "0";
    }
  }, [address]);

  const claimFaucet = useCallback(async () => {
    setIsLoading(true);
    try {
      const receipt = await web3ClaimFaucet();
      handleSuccess("Faucet Claimed", "Received 10,000 test USDT");
      return receipt;
    } catch (error) {
      handleError(error, "Failed to claim faucet");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccess, handleError]);

  return {
    isLoading,
    approve,
    deposit,
    claimRewards,
    withdrawReferral,
    fetchUserData,
    fetchUSDTBalance,
    checkAllowance,
    claimFaucet,
  };
}
