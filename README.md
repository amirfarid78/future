# Rapidost - Decentralized Investment Platform

A complete decentralized investment DApp with fixed daily ROI, multi-level referral system, and wallet-only authentication. Built with Solidity smart contracts and a modern React frontend.

## 🌟 Features

### Smart Contract
- **5 Investment Packages**: Earn 1.0% to 2.5% daily ROI based on investment tier
- **Multi-Level Referrals**: Automatic 5-level commission distribution (15%, 6%, 4%, 3%, 2%)
- **Per-Second Rewards**: Continuous reward accrual calculated every second
- **200% Cap**: Total return capped at 200% of initial investment
- **Security**: ReentrancyGuard, emergency pause, and comprehensive audit trail
- **Flexible Withdrawals**: Claim rewards anytime with $5 minimum

### Frontend
- **Wallet-Only Login**: Connect with MetaMask, WalletConnect, and all major wallets
- **Real-Time Dashboard**: Live reward accrual, portfolio metrics, and referral statistics
- **Futuristic UI**: Dark theme with glassmorphism, neon accents, and smooth animations
- **Mobile Responsive**: Fully optimized for all screen sizes
- **One-Click Investment**: Streamlined approve + deposit flow

## 📦 Tech Stack

- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin, Hardhat
- **Frontend**: React, Tailwind CSS, Framer Motion, shadcn/ui
- **Blockchain**: Ethereum, BSC, Polygon (multi-chain support)
- **Testing**: Hardhat, Chai, Ethers.js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet

### Installation

1. Clone and install dependencies:
```bash
git clone <repository-url>
cd rapidost
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

### Local Development

1. Start Hardhat local node:
```bash
npx hardhat node
```

2. Deploy contracts (in a new terminal):
```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Deploy MockUSDT token
- Deploy InvestmentDApp contract
- Mint test USDT
- Create `.env.local` with contract addresses

3. Start the frontend:
```bash
npm run dev
```

4. Open http://localhost:5000 and connect your wallet to **Localhost (Chain ID: 31337)**

### Testing

Run the comprehensive test suite:
```bash
npx hardhat test
```

View test coverage:
```bash
npx hardhat coverage
```

## 📖 Usage Guide

### For Users

1. **Get Test USDT** (local development):
   - The deployment script automatically mints 100,000 USDT to the deployer
   - Call `usdt.faucet()` from any address to get 10,000 test USDT

2. **Make an Investment**:
   - Connect wallet on the dashboard
   - Navigate to "Invest" tab
   - Enter amount ($5 - $3000)
   - Approve USDT spending
   - Confirm deposit transaction
   - Add referrer address (optional)

3. **Track Rewards**:
   - View real-time reward accrual on Portfolio tab
   - See progress to 200% cap
   - Check daily earnings rate

4. **Claim Rewards**:
   - Minimum withdrawal: $5 USDT
   - Click "Claim Rewards" when available
   - Confirm transaction

5. **Build Referral Network**:
   - Share your referral link
   - Earn up to 30% commission automatically
   - Withdraw referral balance (min $5)

### Investment Packages

| Package | Range | Daily ROI |
|---------|-------|-----------|
| Starter | $5 - $19 | 1.0% |
| Bronze | $20 - $49 | 1.5% |
| Silver | $50 - $499 | 1.8% |
| Gold | $500 - $999 | 2.0% |
| Diamond | $1000 - $3000 | 2.5% |

### Referral Commission Structure

| Level | Percentage | Example (on $1000) |
|-------|------------|--------------------|
| Level 1 (Direct) | 15% | $150 |
| Level 2 | 6% | $60 |
| Level 3 | 4% | $40 |
| Level 4 | 3% | $30 |
| Level 5 | 2% | $20 |
| **Total** | **30%** | **$300** |

## 🔧 Deployment

### Testnet Deployment

1. Configure network in `.env`:
```env
PRIVATE_KEY=your_private_key
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545
BSCSCAN_API_KEY=your_api_key
```

2. Deploy to BSC Testnet:
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

3. Verify contracts:
```bash
npx hardhat verify --network bscTestnet DEPLOYED_CONTRACT_ADDRESS
```

### Mainnet Deployment

⚠️ **IMPORTANT**: Before mainnet deployment:

1. **Security Audit**: Get contracts professionally audited
2. **Testnet Testing**: Thoroughly test all functions on testnet
3. **Gas Optimization**: Review and optimize gas costs
4. **Emergency Plan**: Prepare emergency response procedures
5. **Legal Compliance**: Ensure regulatory compliance in your jurisdiction

Deploy to mainnet:
```bash
npx hardhat run scripts/deploy.js --network bsc
```

## 🏗️ Smart Contract Architecture

### InvestmentDApp.sol

Main contract handling:
- User deposits and package tier assignment
- Per-second reward accrual with 200% cap
- Multi-level referral distribution
- Reward and referral withdrawals
- Admin controls (pause, update parameters)

### Key Functions

```solidity
// Make a deposit
function deposit(uint256 amount, address referrer) external

// Claim accrued rewards
function claimRewards() external

// Withdraw referral commissions
function withdrawReferral() external

// View available rewards
function getAvailableRewards(address user) external view returns (uint256)

// Get user information
function getUserInfo(address user) external view returns (...)
```

## 🛡️ Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **SafeERC20**: Secure token transfers
- **Ownable**: Access control for admin functions
- **Emergency Pause**: Circuit breaker for emergencies
- **200% Cap**: Prevents infinite reward inflation
- **Minimum Withdrawals**: Gas optimization and spam prevention

## 📊 Gas Estimates

| Function | Estimated Gas | Cost @ 5 gwei |
|----------|---------------|---------------|
| deposit() | ~200,000 | ~$0.20 |
| claimRewards() | ~150,000 | ~$0.15 |
| withdrawReferral() | ~80,000 | ~$0.08 |

*Note: Actual costs vary with network congestion*

## 🔍 Frontend Integration

The frontend automatically connects to deployed contracts using environment variables:

```javascript
// Auto-generated in .env.local after deployment
VITE_CONTRACT_ADDRESS=0x...
VITE_USDT_ADDRESS=0x...
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

## 🧪 Testing Scenarios

The test suite covers:
- ✅ Package tier selection
- ✅ Deposit validation (min/max amounts)
- ✅ Referral chain creation (5 levels)
- ✅ Commission distribution
- ✅ Reward accrual over time
- ✅ 200% cap enforcement
- ✅ Minimum withdrawal limits
- ✅ Pause/unpause functionality
- ✅ Admin controls
- ✅ Edge cases and attack vectors

## 📝 License

MIT License

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. Smart contract investments carry significant risk. Always:
- Do your own research
- Never invest more than you can afford to lose
- Verify contract addresses
- Understand the risks of DeFi protocols
- Comply with local regulations

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## 📞 Support

- Documentation: [Link to docs]
- Issues: GitHub Issues
- Community: [Discord/Telegram]

## 🗺️ Roadmap

- [x] Smart contract implementation
- [x] Multi-level referral system
- [x] Frontend dashboard
- [x] Wallet integration
- [ ] Multi-token support
- [ ] Auto-compound feature
- [ ] Mobile app
- [ ] Advanced analytics

---

Built with ❤️ using modern Web3 technology
