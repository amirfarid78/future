const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("InvestmentDApp", function () {
  let usdt, investmentDApp;
  let owner, user1, user2, user3, user4, user5, user6, treasury;
  
  const USDT = (amount) => ethers.parseEther(amount.toString());

  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5, user6, treasury] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();

    // Deploy InvestmentDApp
    const InvestmentDApp = await ethers.getContractFactory("InvestmentDApp");
    investmentDApp = await InvestmentDApp.deploy(await usdt.getAddress(), treasury.address);

    // Mint USDT to users
    for (const user of [user1, user2, user3, user4, user5, user6]) {
      await usdt.mint(user.address, USDT(10000));
    }
  });

  describe("Deployment", function () {
    it("Should set the correct staking token", async function () {
      expect(await investmentDApp.stakingToken()).to.equal(await usdt.getAddress());
    });

    it("Should set the correct treasury", async function () {
      expect(await investmentDApp.treasury()).to.equal(treasury.address);
    });

    it("Should set the correct owner", async function () {
      expect(await investmentDApp.owner()).to.equal(owner.address);
    });

    it("Should not be paused initially", async function () {
      expect(await investmentDApp.paused()).to.equal(false);
    });
  });

  describe("Package Tiers", function () {
    it("Should return correct tier for different amounts", async function () {
      expect(await investmentDApp.getPackageTier(USDT(5))).to.equal(0);   // Starter
      expect(await investmentDApp.getPackageTier(USDT(20))).to.equal(1);  // Bronze
      expect(await investmentDApp.getPackageTier(USDT(50))).to.equal(2);  // Silver
      expect(await investmentDApp.getPackageTier(USDT(500))).to.equal(3); // Gold
      expect(await investmentDApp.getPackageTier(USDT(1000))).to.equal(4); // Diamond
    });

    it("Should revert for amount outside all packages", async function () {
      await expect(investmentDApp.getPackageTier(USDT(3001))).to.be.revertedWith(
        "Amount does not fit any package"
      );
    });
  });

  describe("Deposits", function () {
    it("Should allow deposit with minimum amount", async function () {
      const amount = USDT(5);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress))
        .to.emit(investmentDApp, "Deposited")
        .withArgs(user1.address, amount, 0, ethers.ZeroAddress);
      
      const userInfo = await investmentDApp.getUserInfo(user1.address);
      expect(userInfo.totalInvested).to.equal(amount);
      expect(userInfo.depositCount).to.equal(1);
    });

    it("Should revert for deposit below minimum", async function () {
      const amount = USDT(4);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress))
        .to.be.revertedWith("Invalid deposit amount");
    });

    it("Should revert for deposit above maximum", async function () {
      const amount = USDT(3001);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress))
        .to.be.revertedWith("Invalid deposit amount");
    });

    it("Should not allow self-referral", async function () {
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, user1.address))
        .to.be.revertedWith("Cannot refer yourself");
    });

    it("Should allow multiple deposits from same user", async function () {
      const amount1 = USDT(100);
      const amount2 = USDT(500);
      
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount1 + amount2);
      
      await investmentDApp.connect(user1).deposit(amount1, ethers.ZeroAddress);
      await investmentDApp.connect(user1).deposit(amount2, ethers.ZeroAddress);
      
      const userInfo = await investmentDApp.getUserInfo(user1.address);
      expect(userInfo.depositCount).to.equal(2);
      expect(userInfo.totalInvested).to.equal(amount1 + amount2);
    });
  });

  describe("Referral System", function () {
    it("Should set referrer on first deposit", async function () {
      const amount1 = USDT(100);
      const amount2 = USDT(200);
      
      // User1 deposits first
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount1);
      await investmentDApp.connect(user1).deposit(amount1, ethers.ZeroAddress);
      
      // User2 deposits with user1 as referrer
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount2);
      await investmentDApp.connect(user2).deposit(amount2, user1.address);
      
      const user2Info = await investmentDApp.getUserInfo(user2.address);
      expect(user2Info.referrer).to.equal(user1.address);
    });

    it("Should distribute referral commissions across 5 levels", async function () {
      const amount = USDT(1000);
      
      // Create a referral chain: user1 <- user2 <- user3 <- user4 <- user5 <- user6
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user2).deposit(amount, user1.address);
      
      await usdt.connect(user3).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user3).deposit(amount, user2.address);
      
      await usdt.connect(user4).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user4).deposit(amount, user3.address);
      
      await usdt.connect(user5).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user5).deposit(amount, user4.address);
      
      await usdt.connect(user6).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user6).deposit(amount, user5.address);
      
      // Check referral balances (15%, 6%, 4%, 3%, 2% of 1000)
      const user5Info = await investmentDApp.getUserInfo(user5.address);
      const user4Info = await investmentDApp.getUserInfo(user4.address);
      const user3Info = await investmentDApp.getUserInfo(user3.address);
      const user2Info = await investmentDApp.getUserInfo(user2.address);
      const user1Info = await investmentDApp.getUserInfo(user1.address);
      
      expect(user5Info.referralBalance).to.equal(USDT(150)); // 15%
      expect(user4Info.referralBalance).to.equal(USDT(60));  // 6%
      expect(user3Info.referralBalance).to.equal(USDT(40));  // 4%
      expect(user2Info.referralBalance).to.equal(USDT(30));  // 3%
      expect(user1Info.referralBalance).to.equal(USDT(20));  // 2%
    });

    it("Should emit ReferralPaid events", async function () {
      const amount = USDT(1000);
      
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user2).deposit(amount, user1.address))
        .to.emit(investmentDApp, "ReferralPaid")
        .withArgs(user1.address, user2.address, 1, USDT(150)); // 15% of 1000
    });

    it("Should track referrals by level", async function () {
      const amount = USDT(1000);
      
      // Create chain
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user2).deposit(amount, user1.address);
      
      await usdt.connect(user3).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user3).deposit(amount, user2.address);
      
      const user1Levels = await investmentDApp.getReferralsByLevel(user1.address);
      expect(user1Levels[0]).to.equal(1); // 1 direct referral
      expect(user1Levels[1]).to.equal(1); // 1 second level
    });
  });

  describe("Reward Accrual and Claims", function () {
    it("Should accrue rewards over time", async function () {
      const amount = USDT(1000);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      // Fast forward 1 day
      await time.increase(86400);
      
      const rewards = await investmentDApp.getAvailableRewards(user1.address);
      // Diamond package (tier 4) = 2.5% daily
      // 1000 * 2.5% = 25 USDT
      expect(rewards).to.be.closeTo(USDT(25), USDT(0.01));
    });

    it("Should allow claiming rewards", async function () {
      const amount = USDT(1000);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      // Fast forward 10 days
      await time.increase(86400 * 10);
      
      const rewardsBefore = await investmentDApp.getAvailableRewards(user1.address);
      
      await expect(investmentDApp.connect(user1).claimRewards())
        .to.emit(investmentDApp, "RewardsClaimed")
        .withArgs(user1.address, rewardsBefore);
      
      const userInfo = await investmentDApp.getUserInfo(user1.address);
      expect(userInfo.totalWithdrawn).to.equal(rewardsBefore);
    });

    it("Should enforce minimum withdrawal amount", async function () {
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      // Fast forward 1 day (only generates ~1.5 USDT, below 5 minimum)
      await time.increase(86400);
      
      await expect(investmentDApp.connect(user1).claimRewards())
        .to.be.revertedWith("Below minimum withdrawal");
    });

    it("Should enforce 200% cap", async function () {
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      // Fast forward enough time to exceed 200% cap
      // Starter package = 1% daily, need 200 days for 200%
      await time.increase(86400 * 210);
      
      const rewards = await investmentDApp.getAvailableRewards(user1.address);
      expect(rewards).to.be.closeTo(USDT(200), USDT(1)); // Should cap at 200 USDT (200%)
    });

    it("Should deactivate deposit after reaching cap", async function () {
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      // Fast forward to exceed cap
      await time.increase(86400 * 210);
      
      await investmentDApp.connect(user1).claimRewards();
      
      const deposit = await investmentDApp.getDeposit(user1.address, 0);
      expect(deposit.active).to.equal(false);
    });
  });

  describe("Referral Withdrawals", function () {
    it("Should allow withdrawing referral balance", async function () {
      const amount = USDT(1000);
      
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user2).deposit(amount, user1.address);
      
      const user1InfoBefore = await investmentDApp.getUserInfo(user1.address);
      expect(user1InfoBefore.referralBalance).to.equal(USDT(150)); // 15%
      
      await expect(investmentDApp.connect(user1).withdrawReferral())
        .to.emit(investmentDApp, "ReferralWithdrawn")
        .withArgs(user1.address, USDT(150));
      
      const user1InfoAfter = await investmentDApp.getUserInfo(user1.address);
      expect(user1InfoAfter.referralBalance).to.equal(0);
    });

    it("Should enforce minimum withdrawal for referral", async function () {
      const amount = USDT(20); // Low amount to generate small referral
      
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      await usdt.connect(user2).approve(await investmentDApp.getAddress(), amount);
      await investmentDApp.connect(user2).deposit(amount, user1.address);
      
      // Referral = 20 * 15% = 3 USDT (below 5 minimum)
      await expect(investmentDApp.connect(user1).withdrawReferral())
        .to.be.revertedWith("Below minimum withdrawal");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause contract", async function () {
      await investmentDApp.setPaused(true);
      expect(await investmentDApp.paused()).to.equal(true);
      
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress))
        .to.be.revertedWith("Contract is paused");
    });

    it("Should allow owner to update treasury", async function () {
      await expect(investmentDApp.setTreasury(user3.address))
        .to.emit(investmentDApp, "TreasuryUpdated")
        .withArgs(user3.address);
      
      expect(await investmentDApp.treasury()).to.equal(user3.address);
    });

    it("Should allow owner to update daily ROI", async function () {
      await investmentDApp.setDailyROI(0, 120); // Update Starter to 1.2%
      expect(await investmentDApp.dailyROI(0)).to.equal(120);
    });

    it("Should not allow non-owner to call admin functions", async function () {
      await expect(investmentDApp.connect(user1).setPaused(true))
        .to.be.revertedWithCustomError(investmentDApp, "OwnableUnauthorizedAccount");
      
      await expect(investmentDApp.connect(user1).setTreasury(user3.address))
        .to.be.revertedWithCustomError(investmentDApp, "OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle rapid deposits correctly", async function () {
      const amount = USDT(100);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount * 3n);
      
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      await investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress);
      
      const userInfo = await investmentDApp.getUserInfo(user1.address);
      expect(userInfo.depositCount).to.equal(3);
    });

    it("Should handle zero referrer correctly", async function () {
      const amount = USDT(1000);
      await usdt.connect(user1).approve(await investmentDApp.getAddress(), amount);
      
      await expect(investmentDApp.connect(user1).deposit(amount, ethers.ZeroAddress))
        .to.not.be.reverted;
      
      const userInfo = await investmentDApp.getUserInfo(user1.address);
      expect(userInfo.referrer).to.equal(ethers.ZeroAddress);
    });
  });
});
