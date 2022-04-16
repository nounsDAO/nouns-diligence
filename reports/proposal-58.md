# Proposal 58: Increase Voting Delay and Voting Period

## Overview

Proposal 58 increases the voting delay to 4 days and the voting period to 5 days. These values are currently set to roughly 2 days and 3 days, respectively.

**Refresher:**

- **Voting Delay** - The number of Ethereum blocks to wait before voting on a proposal may begin. This value is added to the current block number when a proposal is created.
- **Voting Period** - The duration of voting on a proposal, in Ethereum blocks.

**This proposal assumes 13 second blocks when doing the conversion to time.**

## Proposal Description Accuracy

This proposal is accurate. The average Ethereum block time is [very close to 13 seconds](https://ycharts.com/indicators/ethereum_average_block_time) and the calculations match the time values described in the proposal:

- **Voting Delay** - `(26585 * (13 / 60)) / (60 * 24) = 4.00005787037037 days`
- **Voting Period** - `(33230 * (13 / 60)) / (60 * 24) = 4.99988425925926 days`

## Execution Risks

### Critical

None.

### Major

None.

### Minor

None.

## Audit Required

**No**. This change is a configuration value update and does not introduce any new contracts.
