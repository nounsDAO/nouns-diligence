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

1. The `capture` function calls `_safeTransferFrom` to transfer the Rescue Toad to the DAO. This call will revert because the Nouns DAO proxy does not expose a `onERC1155Received` function, which is called in the `_doSafeTransferAcceptanceCheck`. This cannot be remedied prior to execution.

#### Possible REVERTs

1. At time of writing, Rescue Toad #15 does not exist. This will cause the first revert, but it can be remedied prior to execution by minting Toad #15.
2. Anyone can cause the proposal transaction to fail by donating an amount greater than the DAO's donation to any of the 7 Rescue Toadz listed in the proposal.

### Minor

The owner of the Rescue Toadz contract has the ability to cause the proposal transaction to fail by pausing the contract prior to execution.

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
