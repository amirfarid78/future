import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

// Contract ABIs (simplified - will be replaced with actual ABIs from compiled contracts)
const INVESTMENT_DAPP_ABI = [
  "function deposit(uint256 amount, address referrer) external",
  "function claimRewards() external",
  "function withdrawReferral() external",
  "function getAvailableRewards(address user) external view returns (uint256)",
  "function getUserInfo(address user) external view returns (address referrer, uint256 totalInvested, uint256 totalWithdrawn, uint256 referralBalance, uint256 totalReferrals, uint256 depositCount)",
  "function getDeposit(address user, uint256 index) external view returns (uint256 amount, uint256 packageTier, uint256 startTime, uint256 totalClaimed, bool active, uint256 availableRewards)",
  "function getReferralsByLevel(address user) external view returns (uint256[5])",
  "function getPackageTier(uint256 amount) external view returns (uint256)",
  "function paused() external view returns (bool)",
  "event Deposited(address indexed user, uint256 amount, uint256 packageTier, address indexed referrer)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
  "event ReferralWithdrawn(address indexed user, uint256 amount)",
];

const USDT_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function faucet() external",
];

// Contract addresses - will be loaded from environment
export const getContractAddress = () => {
  return import.meta.env.VITE_CONTRACT_ADDRESS || "0x";
};

export const getUSDTAddress = () => {
  return import.meta.env.VITE_USDT_ADDRESS || "0x";
};

// Web3 Provider
let provider: BrowserProvider | null = null;

export const getProvider = async () => {
  if (!provider && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
  }
  return provider;
};

export const getSigner = async () => {
  const prov = await getProvider();
  if (!prov) throw new Error("No provider available");
  return await prov.getSigner();
};

// Wallet Connection
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  try {
    const prov = await getProvider();
    if (!prov) throw new Error("Failed to get provider");

    const accounts = await prov.send("eth_requestAccounts", []);
    const network = await prov.getNetwork();

    return {
      address: accounts[0],
      chainId: Number(network.chainId),
    };
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    throw new Error(error.message || "Failed to connect wallet");
  }
};

export const disconnectWallet = () => {
  provider = null;
};

export const switchNetwork = async (chainId: number) => {
  if (!window.ethereum) throw new Error("No wallet found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      // Add network logic here
      throw new Error("Network not found. Please add it manually.");
    }
    throw error;
  }
};

// Contract Interactions
export const getInvestmentContract = async (readOnly = false) => {
  const address = getContractAddress();
  if (!address || address === "0x") {
    throw new Error("Contract address not configured");
  }

  if (readOnly) {
    const prov = await getProvider();
    if (!prov) throw new Error("No provider available");
    return new Contract(address, INVESTMENT_DAPP_ABI, prov);
  } else {
    const signer = await getSigner();
    return new Contract(address, INVESTMENT_DAPP_ABI, signer);
  }
};

export const getUSDTContract = async (readOnly = false) => {
  const address = getUSDTAddress();
  if (!address || address === "0x") {
    throw new Error("USDT address not configured");
  }

  if (readOnly) {
    const prov = await getProvider();
    if (!prov) throw new Error("No provider available");
    return new Contract(address, USDT_ABI, prov);
  } else {
    const signer = await getSigner();
    return new Contract(address, USDT_ABI, signer);
  }
};

// User Functions
export const approveUSDT = async (amount: string) => {
  const usdt = await getUSDTContract();
  const contractAddress = getContractAddress();
  const tx = await usdt.approve(contractAddress, parseEther(amount));
  return await tx.wait();
};

export const depositInvestment = async (amount: string, referrer: string) => {
  const contract = await getInvestmentContract();
  const tx = await contract.deposit(
    parseEther(amount),
    referrer || "0x0000000000000000000000000000000000000000"
  );
  return await tx.wait();
};

export const claimRewards = async () => {
  const contract = await getInvestmentContract();
  const tx = await contract.claimRewards();
  return await tx.wait();
};

export const withdrawReferral = async () => {
  const contract = await getInvestmentContract();
  const tx = await contract.withdrawReferral();
  return await tx.wait();
};

export const getUSDTBalance = async (address: string) => {
  const usdt = await getUSDTContract(true);
  const balance = await usdt.balanceOf(address);
  return formatEther(balance);
};

export const getUSDTAllowance = async (owner: string) => {
  const usdt = await getUSDTContract(true);
  const contractAddress = getContractAddress();
  const allowance = await usdt.allowance(owner, contractAddress);
  return formatEther(allowance);
};

export const getUserData = async (address: string) => {
  const contract = await getInvestmentContract(true);

  const [referrer, totalInvested, totalWithdrawn, referralBalance, totalReferrals, depositCount] =
    await contract.getUserInfo(address);

  const availableRewards = await contract.getAvailableRewards(address);
  const referralsByLevel = await contract.getReferralsByLevel(address);

  // Get all deposits
  const deposits = [];
  for (let i = 0; i < Number(depositCount); i++) {
    const [amount, packageTier, startTime, totalClaimed, active, depositRewards] =
      await contract.getDeposit(address, i);

    deposits.push({
      amount: formatEther(amount),
      packageTier: Number(packageTier),
      startTime: Number(startTime),
      totalClaimed: formatEther(totalClaimed),
      active,
      availableRewards: formatEther(depositRewards),
    });
  }

  return {
    referrer,
    totalInvested: formatEther(totalInvested),
    totalWithdrawn: formatEther(totalWithdrawn),
    referralBalance: formatEther(referralBalance),
    totalReferrals: Number(totalReferrals),
    depositCount: Number(depositCount),
    availableRewards: formatEther(availableRewards),
    referralsByLevel: referralsByLevel.map((r: any) => Number(r)),
    deposits,
  };
};

export const claimFaucet = async () => {
  const usdt = await getUSDTContract();
  const tx = await usdt.faucet();
  return await tx.wait();
};

// Utility functions
export const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const parseAmount = (amount: string) => {
  try {
    return parseEther(amount);
  } catch {
    return BigInt(0);
  }
};

// Declare global ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}
