# Proposal 50: Donate 51 ETH for humanitarian aid to Ukraine through the Rescue Toadz project

## Overview

Proposal 50 attempts to donate 51 ETH to [Unchain Ukraine](https://unchain.fund/) through the Rescue Toadz project.

Rescue Toadz gamifies the donation process, enabling users to 'capture' minted Toadz by matching or surpassing the previous donation.

The transaction included in this proposal attempts to 'capture' 7 Toadz, including one donation of 40 ETH, one donation of 10 ETH, and 5 donations of 0.2 ETH.


## Proposal Description Accuracy

The proposal description is accurate and does not attempt to deceive the DAO. The charity address is correct and cannot be updated.

**Note:** While there is no attempt to deceive the DAO, the proposal transaction will fail due to a technical oversight. See [Execution Risks](#execution-risks) for more information.


## Execution Risks

### Critical

The transaction included in the proposal will fail to execute. While it only takes one `REVERT` to stop execution and revert state changes, there are multiple possible execution failures.

Included among these are one unavoidable revert that **will** cause the transaction to fail with 100% certainty AND two **possible** reverts.

#### Unavoidable REVERTs

1. The [capture](https://github.com/haltakov/rescue-toadz/blob/d544264/contract/contracts/RescueToadz.sol#L95) function calls [_safeTransferFrom](https://github.com/haltakov/rescue-toadz/blob/d544264/contract/contracts/RescueToadz.sol#L110) to transfer the Rescue Toad to the DAO. This call will revert because the Nouns DAO proxy does not expose an [onERC1155Received](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/742e85be7c08dff21410ba4aa9c60f6a033befb8/contracts/token/ERC1155/ERC1155.sol#L470) function, which is called in the [_doSafeTransferAcceptanceCheck](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/742e85be7c08dff21410ba4aa9c60f6a033befb8/contracts/token/ERC1155/ERC1155.sol#L186). This cannot be remedied prior to execution.

#### Possible REVERTs

1. At time of writing, Rescue Toad #15 does not exist. This has the potential to cause the first revert, but can be remedied prior to execution by minting Toad #15.
    - [Failure Condition](https://github.com/haltakov/rescue-toadz/blob/d544264/contract/contracts/RescueToadz.sol#L100)
2. Anyone can cause the proposal transaction to fail by donating an amount greater than the DAO's donation to any of the 7 Rescue Toadz listed in the proposal.
    - [Failure Condition](https://github.com/haltakov/rescue-toadz/blob/d544264/contract/contracts/RescueToadz.sol#L101-L104)

### Minor

The owner of the Rescue Toadz contract has the ability to cause the proposal transaction to fail by pausing the contract prior to execution.
  - [Failure Condition](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/security/Pausable.sol#L52)

## Audit Required

**No**


## Validation

Follow the [steps in the README](../README.md#for-reviewers) to simulate proposal 50.

**Note:** If you would like to test the unavoidable revert, you must mint Toad #15 on the fork (if not yet minted). To accomplish this, paste the following code after the fork is created in [simulate-proposal.ts](../src/tasks/simulate-proposal.ts#L46):

```ts
const FORK_MINTER_ADDRESS = '0x000000000000000000000000000000000000dead';

// Impersonate an account with ETH & mint Toad #15
await fork.send('hardhat_impersonateAccount', [FORK_MINTER_ADDRESS]);
const minter = fork.getSigner(FORK_MINTER_ADDRESS);
await minter.sendTransaction({
  to: '0x57605D3A2C7726e9A7801307AF0C893bA5199F66',
  value: EthersBN.from(10).pow(16),
  data: '0xa0712d68000000000000000000000000000000000000000000000000000000000000000F', // 15
});
await fork.send('hardhat_stopImpersonatingAccount', [FORK_MINTER_ADDRESS]);
```
