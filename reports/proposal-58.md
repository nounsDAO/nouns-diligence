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

To normalize both quorum votes and the proposal threshold, votes are considered from the proposal creation block. This logic can be found in the [NounsDAOLogicV1](https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/governance/NounsDAOLogicV1.sol#L508) contract.

Note that `castVoteInternal` uses the current `votingDelay` to determine when the vote snapshot is taken, rather than a value that's cached at the time of proposal creation.

This has a couple side effects:

- Proposals that are **pending** at the time this proposal is executed will use a snapshot that's 13,445 blocks, or roughly 2.02 days, before the expected proposal creation snapshot.
- Proposals that are **active** at the time this proposal is executed will begin to use the old snapshot. Unlike pending proposals, this could allow a voter to vote twice on the same proposal under the following circumstances:
    - The Noun owner or delegate already voted on the active proposal prior to the execution of this proposal AND they transferred or re-delegated their Nouns between the two snapshots.

It is recommended that no changes to the `votingDelay` occur until the Nouns DAO logic contract is patched. This issue does NOT affect the `votingPeriod`, which can be updated prior to the patch.

### Minor

None.

## Audit Required

**No**. This change is a configuration value update and does not introduce any new contracts.
