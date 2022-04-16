# Proposal 59: Gamify fundraising for Ukraine by donating 51 ETH through the Rescue Toadz project

## Overview

Proposal 59 donates 51 ETH to [Unchain Ukraine](https://unchain.fund/) through the Rescue Toadz project.

Rescue Toadz gamifies the donation process, enabling users to 'capture' minted Toadz by matching or surpassing the previous donation.

The transaction included in this proposal attempts to 'capture' 7 Toadz, including one donation of 40 ETH, one donation of 10 ETH, and 5 donations of 0.2 ETH.

**This proposal is a re-submission of [#50](./proposal-50.md) and includes fixes for all critical issues.**

## Proposal Description Accuracy

The proposal description is accurate and does not attempt to deceive the DAO. The charity address is correct and cannot be updated.

**Notes:**

- It's possible that the DAO does not donate the full 51 ETH. ETH will be returned to the DAO if the amount being donated by capturing a Toad has been exceeded by another party.
- The Nouns DAO executor does not call the RescueToadz contract directly. Instead, it calls [RescueToadzNounsExecutor](https://etherscan.io/address/0xe4380808F44ceced3aCDf7e85547c29F5cB69674), which acts as a pass-through contract to resolve the technical issues found in proposal 50. Received POAPs will be held in this pass-through contract and can be removed via a subsequent proposal if ever desired.

## Execution Risks

### Critical

None.

### Major

None.

### Minor

- There is one possible, yet unlikely, revert condition. Details of this condition will be released at a later time.
- Minor smart contract risk, siloed to the 51 ETH sent in the proposal.

## Audit Required

**No**


## Validation

Follow the [steps in the README](../README.md#for-reviewers) to simulate proposal 59.
