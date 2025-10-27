import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy MockUSDT
  console.log("📝 Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("✅ MockUSDT deployed to:", usdtAddress, "\n");

  // Deploy InvestmentDApp
  console.log("📝 Deploying InvestmentDApp...");
  const InvestmentDApp = await hre.ethers.getContractFactory("InvestmentDApp");
  const investmentDApp = await InvestmentDApp.deploy(
    usdtAddress,
    deployer.address  // treasury address
  );
  await investmentDApp.waitForDeployment();
  const investmentAddress = await investmentDApp.getAddress();
  console.log("✅ InvestmentDApp deployed to:", investmentAddress, "\n");

  // Mint some USDT to deployer for testing
  console.log("💸 Minting test USDT...");
  const mintTx = await usdt.mint(deployer.address, hre.ethers.parseEther("100000"));
  await mintTx.wait();
  console.log("✅ Minted 100,000 USDT to deployer\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contracts: {
      MockUSDT: usdtAddress,
      InvestmentDApp: investmentAddress,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile, "\n");

  // Display summary
  console.log("=" . repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=" . repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   MockUSDT:        ", usdtAddress);
  console.log("   InvestmentDApp:  ", investmentAddress);
  console.log("\n🔗 Network:          ", hre.network.name);
  console.log("🆔 Chain ID:        ", (await hre.ethers.provider.getNetwork()).chainId.toString());
  console.log("\n💡 Next Steps:");
  console.log("   1. Approve USDT:  usdt.approve(investmentAddress, amount)");
  console.log("   2. Make deposit:  investmentDApp.deposit(amount, referrer)");
  console.log("   3. Claim rewards: investmentDApp.claimRewards()");
  console.log("=" . repeat(60), "\n");

  // For local development, also create a frontend config file
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    const frontendConfig = {
      VITE_CONTRACT_ADDRESS: investmentAddress,
      VITE_USDT_ADDRESS: usdtAddress,
      VITE_CHAIN_ID: "31337",
      VITE_RPC_URL: "http://127.0.0.1:8545",
    };

    const envFile = path.join(__dirname, "../.env.local");
    const envContent = Object.entries(frontendConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    
    fs.writeFileSync(envFile, envContent);
    console.log("📝 Frontend config saved to .env.local\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
