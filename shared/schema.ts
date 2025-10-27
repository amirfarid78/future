import { z } from "zod";

// Investment Package Tiers
export const PACKAGE_TIERS = [
  { min: 5, max: 19, dailyROI: 1.0, name: "Starter" },
  { min: 20, max: 49, dailyROI: 1.5, name: "Bronze" },
  { min: 50, max: 499, dailyROI: 1.8, name: "Silver" },
  { min: 500, max: 999, dailyROI: 2.0, name: "Gold" },
  { min: 1000, max: 3000, dailyROI: 2.5, name: "Diamond" },
] as const;

// Referral levels and percentages
export const REFERRAL_LEVELS = [
  { level: 1, percentage: 15, color: "from-purple-500 to-pink-500" },
  { level: 2, percentage: 6, color: "from-blue-500 to-cyan-500" },
  { level: 3, percentage: 4, color: "from-green-500 to-emerald-500" },
  { level: 4, percentage: 3, color: "from-yellow-500 to-orange-500" },
  { level: 5, percentage: 2, color: "from-red-500 to-rose-500" },
] as const;

// Contract constants
export const MIN_DEPOSIT = 5;
export const MAX_DEPOSIT = 3000;
export const MIN_WITHDRAW = 5;
export const TOTAL_RETURN_CAP = 200; // 200% cap

// Investment schema
export const investmentSchema = z.object({
  id: z.string(),
  userAddress: z.string(),
  amount: z.number().min(MIN_DEPOSIT).max(MAX_DEPOSIT),
  packageTier: z.number().min(0).max(4),
  dailyROI: z.number(),
  startTime: z.number(),
  totalClaimed: z.number().default(0),
  active: z.boolean().default(true),
});

export type Investment = z.infer<typeof investmentSchema>;

// Referral schema
export const referralSchema = z.object({
  id: z.string(),
  referrer: z.string(),
  referee: z.string(),
  level: z.number().min(1).max(5),
  amount: z.number(),
  earned: z.number(),
  timestamp: z.number(),
});

export type Referral = z.infer<typeof referralSchema>;

// User stats schema
export const userStatsSchema = z.object({
  address: z.string(),
  totalInvested: z.number().default(0),
  totalWithdrawn: z.number().default(0),
  availableRewards: z.number().default(0),
  referralBalance: z.number().default(0),
  totalReferrals: z.number().default(0),
  referralsByLevel: z.array(z.number()).length(5).default([0, 0, 0, 0, 0]),
  activeInvestments: z.array(investmentSchema).default([]),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(["deposit", "withdraw", "claim", "referral"]),
  userAddress: z.string(),
  amount: z.number(),
  timestamp: z.number(),
  txHash: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Network configuration
export const NETWORK_CONFIG = {
  hardhat: {
    chainId: 31337,
    name: "Hardhat",
    rpcUrl: "http://127.0.0.1:8545",
  },
  bscTestnet: {
    chainId: 97,
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  mumbai: {
    chainId: 80001,
    name: "Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
  },
} as const;

// Helper function to get package tier
export function getPackageTier(amount: number): typeof PACKAGE_TIERS[number] | null {
  return PACKAGE_TIERS.find(tier => amount >= tier.min && amount <= tier.max) || null;
}

// Helper function to calculate daily rewards
export function calculateDailyReward(amount: number, dailyROI: number): number {
  return (amount * dailyROI) / 100;
}

// Helper function to calculate accrued rewards
export function calculateAccruedRewards(
  amount: number,
  dailyROI: number,
  startTime: number,
  totalClaimed: number
): number {
  const elapsed = Date.now() / 1000 - startTime;
  const days = elapsed / 86400; // seconds in a day
  const totalEarned = (amount * dailyROI * days) / 100;
  const available = Math.max(0, totalEarned - totalClaimed);
  
  // Apply 200% cap
  const maxReturn = amount * 2;
  const totalReturned = totalClaimed + available;
  
  if (totalReturned > maxReturn) {
    return Math.max(0, maxReturn - totalClaimed);
  }
  
  return available;
}

// Helper function to calculate progress to cap
export function calculateProgressToCap(amount: number, totalClaimed: number, availableRewards: number): number {
  const maxReturn = amount * 2;
  const totalReturned = totalClaimed + availableRewards;
  return Math.min(100, (totalReturned / maxReturn) * 100);
}
