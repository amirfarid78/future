# Deployment Guide - Fix "USDT address not configured"

## Problem
The error "USDT address not configured" means the smart contracts haven't been deployed yet.

## Solution: Deploy to BSC Testnet

### Step 1: Get a Private Key
1. Open MetaMask
2. Click on your account → Account details → Show private key
3. Copy your private key (NEVER share this with anyone!)

### Step 2: Get Test BNB
1. Go to https://testnet.bnbchain.org/faucet-smart
2. Enter your wallet address
3. Get free test BNB for gas fees

### Step 3: Set Environment Variables
Create a `.env` file with your private key:

```env
PRIVATE_KEY=your_private_key_here
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545
```

### Step 4: Deploy Contracts
Run the deployment command:

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

This will:
- Deploy MockUSDT token to BSC Testnet
- Deploy InvestmentDApp contract
- Create `.env.local` with contract addresses
- Display contract addresses

### Step 5: Update .env.local
The deployment will automatically create `.env.local` with:
- `VITE_CONTRACT_ADDRESS` - Your investment contract
- `VITE_USDT_ADDRESS` - Your USDT token
- `VITE_CHAIN_ID` - BSC Testnet (97)

### Step 6: Restart the App
The workflow will automatically restart and pick up the new addresses.

### Step 7: Connect Wallet
1. Open the app
2. Click "Connect Wallet"
3. In MetaMask, switch to "BSC Testnet" (Chain ID: 97)
4. Connect your wallet

### Step 8: Get Test USDT
You can get test USDT by calling the faucet function on the MockUSDT contract.

## Alternative: Deploy to Polygon Mumbai

Same process, just change the network:

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

You'll need MATIC test tokens from: https://faucet.polygon.technology/

## Troubleshooting

### "insufficient funds"
- You need test BNB/MATIC for gas fees
- Get from faucet links above

### "Transaction failed"
- Make sure you're on the correct network (BSC Testnet Chain ID 97)
- Check that contracts are deployed
- Verify .env.local has the correct addresses
