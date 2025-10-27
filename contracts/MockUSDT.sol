// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @notice Mock USDT token for testing purposes
 * @dev ERC20 token with 18 decimals for simplicity in testing
 */
contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        // Mint 1 million USDT to deployer for testing
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @notice Mint tokens to an address (for testing)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Faucet function for users to get test tokens
     */
    function faucet() external {
        _mint(msg.sender, 10000 * 10**18);  // 10,000 USDT
    }
}
