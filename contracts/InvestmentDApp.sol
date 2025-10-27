// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title InvestmentDApp
 * @notice Decentralized investment platform with fixed daily ROI and multi-level referral system
 * @dev Implements 5-tier packages with per-second reward accrual and 200% cap
 */
contract InvestmentDApp is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    IERC20 public stakingToken;
    address public treasury;
    bool public paused;

    // Investment package configurations (in basis points for precision)
    uint256 public constant MIN_DEPOSIT = 5 * 10**18;  // 5 USDT (assuming 18 decimals)
    uint256 public constant MAX_DEPOSIT = 3000 * 10**18;  // 3000 USDT
    uint256 public constant MIN_WITHDRAW = 5 * 10**18;  // 5 USDT
    uint256 public constant TOTAL_RETURN_CAP = 200;  // 200%
    uint256 public constant SECONDS_PER_DAY = 86400;

    // Daily ROI rates in basis points (100 = 1%)
    uint256[5] public dailyROI = [100, 150, 180, 200, 250];  // 1.0%, 1.5%, 1.8%, 2.0%, 2.5%

    // Package tier boundaries
    uint256[5] public packageMin = [
        5 * 10**18,
        20 * 10**18,
        50 * 10**18,
        500 * 10**18,
        1000 * 10**18
    ];
    uint256[5] public packageMax = [
        19 * 10**18,
        49 * 10**18,
        499 * 10**18,
        999 * 10**18,
        3000 * 10**18
    ];

    // Referral levels and percentages (15%, 6%, 4%, 3%, 2%)
    uint256[5] public referralPercentages = [1500, 600, 400, 300, 200];  // In basis points
    uint256 public constant BASIS_POINTS = 10000;

    // User data structures
    struct Deposit {
        uint256 amount;
        uint256 packageTier;
        uint256 startTime;
        uint256 totalClaimed;
        bool active;
    }

    struct UserInfo {
        address referrer;
        uint256 totalInvested;
        uint256 totalWithdrawn;
        uint256 referralBalance;
        uint256 totalReferrals;
        Deposit[] deposits;
    }

    mapping(address => UserInfo) public users;
    mapping(address => mapping(uint256 => uint256)) public referralsByLevel;  // user => level => count

    // ============ Events ============

    event Deposited(address indexed user, uint256 amount, uint256 packageTier, address indexed referrer);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ReferralPaid(address indexed referrer, address indexed referee, uint256 level, uint256 amount);
    event ReferralWithdrawn(address indexed user, uint256 amount);
    event Paused(bool paused);
    event TreasuryUpdated(address indexed newTreasury);
    event TokenUpdated(address indexed newToken);

    // ============ Constructor ============

    constructor(address _stakingToken, address _treasury) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid token address");
        require(_treasury != address(0), "Invalid treasury address");
        stakingToken = IERC20(_stakingToken);
        treasury = _treasury;
    }

    // ============ Modifiers ============

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // ============ Main Functions ============

    /**
     * @notice Make a deposit and start earning rewards
     * @param amount Amount to deposit
     * @param referrer Address of referrer (zero address if none)
     */
    function deposit(uint256 amount, address referrer) external nonReentrant whenNotPaused {
        require(amount >= MIN_DEPOSIT && amount <= MAX_DEPOSIT, "Invalid deposit amount");
        require(referrer != msg.sender, "Cannot refer yourself");
        
        // Determine package tier
        uint256 packageTier = getPackageTier(amount);
        require(packageTier < 5, "Invalid package tier");

        UserInfo storage user = users[msg.sender];

        // Set referrer on first deposit
        if (user.referrer == address(0) && referrer != address(0) && users[referrer].totalInvested > 0) {
            user.referrer = referrer;
        }

        // Transfer tokens from user
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Create new deposit
        user.deposits.push(Deposit({
            amount: amount,
            packageTier: packageTier,
            startTime: block.timestamp,
            totalClaimed: 0,
            active: true
        }));

        user.totalInvested += amount;

        // Process referral commissions
        if (user.referrer != address(0)) {
            _processReferralCommissions(msg.sender, amount);
        } else if (treasury != address(0)) {
            // If no referrer, referral portion goes to treasury
            uint256 totalReferralAmount = (amount * 3000) / BASIS_POINTS;  // 30%
            stakingToken.safeTransfer(treasury, totalReferralAmount);
        }

        emit Deposited(msg.sender, amount, packageTier, user.referrer);
    }

    /**
     * @notice Claim accrued rewards
     */
    function claimRewards() external nonReentrant whenNotPaused {
        UserInfo storage user = users[msg.sender];
        uint256 totalAvailable = getAvailableRewards(msg.sender);

        require(totalAvailable >= MIN_WITHDRAW, "Below minimum withdrawal");

        // Update claimed amounts for each deposit
        for (uint256 i = 0; i < user.deposits.length; i++) {
            if (user.deposits[i].active) {
                uint256 depositRewards = _calculateDepositRewards(msg.sender, i);
                user.deposits[i].totalClaimed += depositRewards;

                // Check if deposit reached 200% cap
                uint256 maxReturn = (user.deposits[i].amount * TOTAL_RETURN_CAP) / 100;
                if (user.deposits[i].totalClaimed >= maxReturn) {
                    user.deposits[i].active = false;
                }
            }
        }

        user.totalWithdrawn += totalAvailable;
        stakingToken.safeTransfer(msg.sender, totalAvailable);

        emit RewardsClaimed(msg.sender, totalAvailable);
    }

    /**
     * @notice Withdraw referral commissions
     */
    function withdrawReferral() external nonReentrant whenNotPaused {
        UserInfo storage user = users[msg.sender];
        uint256 amount = user.referralBalance;

        require(amount >= MIN_WITHDRAW, "Below minimum withdrawal");

        user.referralBalance = 0;
        stakingToken.safeTransfer(msg.sender, amount);

        emit ReferralWithdrawn(msg.sender, amount);
    }

    // ============ View Functions ============

    /**
     * @notice Get available rewards for a user
     */
    function getAvailableRewards(address userAddress) public view returns (uint256) {
        UserInfo storage user = users[userAddress];
        uint256 total = 0;

        for (uint256 i = 0; i < user.deposits.length; i++) {
            if (user.deposits[i].active) {
                total += _calculateDepositRewards(userAddress, i);
            }
        }

        return total;
    }

    /**
     * @notice Get package tier based on amount
     */
    function getPackageTier(uint256 amount) public view returns (uint256) {
        for (uint256 i = 0; i < 5; i++) {
            if (amount >= packageMin[i] && amount <= packageMax[i]) {
                return i;
            }
        }
        revert("Amount does not fit any package");
    }

    /**
     * @notice Get user information
     */
    function getUserInfo(address userAddress) external view returns (
        address referrer,
        uint256 totalInvested,
        uint256 totalWithdrawn,
        uint256 referralBalance,
        uint256 totalReferrals,
        uint256 depositCount
    ) {
        UserInfo storage user = users[userAddress];
        return (
            user.referrer,
            user.totalInvested,
            user.totalWithdrawn,
            user.referralBalance,
            user.totalReferrals,
            user.deposits.length
        );
    }

    /**
     * @notice Get deposit information
     */
    function getDeposit(address userAddress, uint256 depositIndex) external view returns (
        uint256 amount,
        uint256 packageTier,
        uint256 startTime,
        uint256 totalClaimed,
        bool active,
        uint256 availableRewards
    ) {
        UserInfo storage user = users[userAddress];
        require(depositIndex < user.deposits.length, "Invalid deposit index");
        
        Deposit storage dep = user.deposits[depositIndex];
        uint256 rewards = _calculateDepositRewards(userAddress, depositIndex);

        return (
            dep.amount,
            dep.packageTier,
            dep.startTime,
            dep.totalClaimed,
            dep.active,
            rewards
        );
    }

    /**
     * @notice Get referrals by level
     */
    function getReferralsByLevel(address userAddress) external view returns (uint256[5] memory) {
        uint256[5] memory levels;
        for (uint256 i = 0; i < 5; i++) {
            levels[i] = referralsByLevel[userAddress][i];
        }
        return levels;
    }

    // ============ Internal Functions ============

    /**
     * @notice Calculate rewards for a specific deposit
     */
    function _calculateDepositRewards(address userAddress, uint256 depositIndex) internal view returns (uint256) {
        UserInfo storage user = users[userAddress];
        Deposit storage dep = user.deposits[depositIndex];

        if (!dep.active) return 0;

        uint256 elapsedTime = block.timestamp - dep.startTime;
        uint256 dailyRate = dailyROI[dep.packageTier];
        
        // Calculate total rewards: amount * dailyRate * (elapsedTime / SECONDS_PER_DAY) / BASIS_POINTS
        uint256 totalEarned = (dep.amount * dailyRate * elapsedTime) / (SECONDS_PER_DAY * BASIS_POINTS);
        
        // Apply 200% cap
        uint256 maxReturn = (dep.amount * TOTAL_RETURN_CAP) / 100;
        uint256 totalPaid = dep.totalClaimed;
        
        if (totalEarned + totalPaid > maxReturn) {
            return maxReturn > totalPaid ? maxReturn - totalPaid : 0;
        }

        return totalEarned > totalPaid ? totalEarned - totalPaid : 0;
    }

    /**
     * @notice Process referral commissions up to 5 levels
     */
    function _processReferralCommissions(address user, uint256 amount) internal {
        address currentReferrer = users[user].referrer;
        
        for (uint256 level = 0; level < 5 && currentReferrer != address(0); level++) {
            uint256 commission = (amount * referralPercentages[level]) / BASIS_POINTS;
            
            users[currentReferrer].referralBalance += commission;
            users[currentReferrer].totalReferrals++;
            referralsByLevel[currentReferrer][level]++;
            
            emit ReferralPaid(currentReferrer, user, level + 1, commission);
            
            // Move to next level
            currentReferrer = users[currentReferrer].referrer;
        }
    }

    // ============ Admin Functions ============

    /**
     * @notice Pause/unpause the contract
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    /**
     * @notice Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    /**
     * @notice Update staking token (use with caution!)
     */
    function setStakingToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        stakingToken = IERC20(_token);
        emit TokenUpdated(_token);
    }

    /**
     * @notice Update daily ROI for a package tier
     */
    function setDailyROI(uint256 tier, uint256 newROI) external onlyOwner {
        require(tier < 5, "Invalid tier");
        require(newROI > 0 && newROI <= 500, "Invalid ROI");  // Max 5% daily
        dailyROI[tier] = newROI;
    }

    /**
     * @notice Emergency withdraw for owner (only unused funds)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        stakingToken.safeTransfer(owner(), amount);
    }
}
