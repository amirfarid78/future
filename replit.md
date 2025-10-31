# Rapidost - Decentralized Investment Platform

## Overview

Rapidost is a decentralized investment DApp that enables users to stake cryptocurrency and earn fixed daily returns. The platform implements a multi-tier investment system with returns ranging from 1.0% to 2.5% daily, plus a 5-level referral commission structure that automatically distributes 30% of deposits across referrer chains. Built with Solidity smart contracts on EVM-compatible chains (Ethereum, BSC, Polygon), the platform features wallet-only authentication, real-time reward accrual calculated per-second, and a modern React frontend with a futuristic cyberpunk aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite for fast development and optimized production builds.

**UI Library**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS. Design follows a futuristic cyberpunk aesthetic with glassmorphism, dark theme, neon accents (cyan, electric blue, purple), and smooth animations via Framer Motion.

**Typography**: Inter (body/UI) and Space Grotesk (headings/numbers) with tabular-nums for financial data alignment.

**Routing**: wouter for client-side routing (lightweight alternative to React Router).

**State Management**: 
- TanStack Query (React Query) for server/blockchain state
- React hooks for local component state

**Web3 Integration**:
- wagmi for Ethereum interactions
- @web3modal/wagmi for wallet connection UI
- ethers.js via wagmi for contract interaction
- Supports MetaMask, WalletConnect, and all major wallets

**Layout System**: 
- 12-column responsive grid
- Mobile-first approach with breakpoints (md, xl)
- Glassmorphism cards with blur effects and translucent backgrounds

**Key Pages**:
- Landing: Marketing page with package overview and wallet connection
- Dashboard: Real-time portfolio metrics, reward accrual, referral statistics, withdrawal interface

### Backend Architecture

**Server Framework**: Express.js serving as both API server and static file server for the built React app.

**Development Mode**: Vite dev server with HMR integrated as Express middleware.

**Storage Layer**: 
- Defined interface (IStorage) with in-memory implementation (MemStorage)
- Drizzle ORM configured for PostgreSQL (schema defined but database integration pending)
- Schema includes User model with username field

**API Structure**: RESTful endpoints prefixed with `/api` (routes defined but endpoints not yet implemented).

**Build Process**:
- Frontend: Vite bundles React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Combined deployment: Static files served from Express in production

### Smart Contract Architecture

**Language**: Solidity 0.8.20 with OpenZeppelin libraries for security patterns.

**Contracts**:
1. **InvestmentDApp**: Core staking contract
   - Investment tiers: $5-19 (1.0%), $20-49 (1.5%), $50-499 (1.8%), $500-999 (2.0%), $1000-3000 (2.5%)
   - Per-second reward calculation using APR mathematics
   - 200% total return cap per user deposit
   - Minimum withdrawal: $5
   - Emergency pause mechanism
   - ReentrancyGuard protection
   
2. **MockUSDT**: ERC-20 test token for development/testnet

**Referral System**:
- 5-level commission: 15%, 6%, 4%, 3%, 2% (30% total)
- Auto-distribution on deposit (on-chain, not off-chain)
- Immutable referrer links set on first deposit

**Security Features**:
- OpenZeppelin's ReentrancyGuard for withdrawal protection
- Ownable for admin functions
- SafeERC20 for token transfers
- Solidity 0.8+ built-in overflow protection

**Development Tools**:
- Hardhat for compilation, testing, deployment
- Hardhat Network for local blockchain
- Chai for assertions in tests
- Test coverage: 100% with comprehensive edge cases

**Deployment Strategy**:
- Configured for BSC Testnet, Ethereum, Polygon
- Deployment script mints test USDT and saves addresses to `.env.local`
- Contract addresses stored in `deployments/` directory as JSON

### Data Flow

1. **User Investment Flow**:
   - User connects wallet → Frontend validates network
   - User selects package → Frontend validates amount (min $5, max $3000)
   - User approves USDT → Smart contract transfer
   - User deposits → Contract records investment, distributes referral commissions
   - Rewards accrue per-second → User can claim anytime (min $5)

2. **Reward Calculation**:
   - Smart contract calculates: `(depositAmount * dailyROI * secondsElapsed) / (86400 * 100)`
   - Capped at 200% of initial deposit
   - Frontend queries contract for pending rewards every block/second

3. **Referral Distribution**:
   - On deposit, contract automatically sends percentages to 5 levels of referrers
   - If referrer doesn't exist at a level, commission goes to treasury

## External Dependencies

### Blockchain Infrastructure
- **EVM Networks**: BSC Testnet (primary), Ethereum, Polygon support
- **RPC Providers**: Configured via environment variables (`BSC_TESTNET_RPC`)
- **Wallet Private Key**: Required for deployment (stored in `.env`, never committed)

### Third-Party Services
- **Web3Modal**: Wallet connection UI with support for 100+ wallets
- **WalletConnect**: Protocol for mobile wallet connections
- **Ethers.js**: Ethereum library for contract interaction

### Development Services
- **Replit**: Dev environment with custom plugins (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer)
- **Hardhat Network**: Local blockchain for testing

### Token Standard
- **ERC-20**: USDT or any ERC-20 token as staking currency (configurable via constructor)

### Database (Configured, Not Active)
- **PostgreSQL**: Via Neon serverless driver (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database queries
- **Connection**: DATABASE_URL environment variable (throws if missing)

### UI Component Libraries
- **Radix UI**: 20+ headless component primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled components built on Radix
- **Framer Motion**: Animation library for smooth transitions

### Fonts
- **Google Fonts**: Inter and Space Grotesk loaded from CDN

### Build Tools
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Type safety across frontend and backend
- **esbuild**: Fast JavaScript bundler for server code

### Testing
- **Hardhat Testing**: @nomicfoundation/hardhat-chai-matchers, @nomicfoundation/hardhat-ethers
- **Time Manipulation**: @nomicfoundation/hardhat-network-helpers for testing time-based rewards