# Proposal 37: setProposalThresholdBPS(25)

## Overview

Proposal 37 lowers the proposal threshold basis points value in the Nouns DAO contract from 50 to 25.

**Note**: One basis point is equal to 0.01%.

If executed, 0.25% of the total Noun supply will be required to submit a proposal to the DAO.

In practice, this change extends the ability to submit a proposal using a single vote until, and including, Noun 398 (supply of 399).

Upon execution, you may unexpectedly notice that the proposal threshold returns a value of 0, rather than 1. This is because a proposer must have [more](https://github.com/nounsDAO/nouns-monorepo/blob/ca4dbe199e835706636776ef201ffbaecfde8774/packages/nouns-contracts/contracts/governance/NounsDAOLogicV1.sol#L188) votes than the proposal threshold.

## Proposal Description Accuracy

The proposal description is as follows:

> This change would enable Noun owners or delegates to submit Nouns DAO proposals using a single vote until, and including, Noun 399. Without this change, proposals created at Noun 200 and on will require 2 votes.

While this proposal description is accurate, there's a small clarification to be made:

The Noun supply is off by 1 compared to Noun IDs, so this change would allow single vote holders to submit a proposal until the Noun with ID **398** is minted, when the total Noun supply is 399. Without this change, proposals created following the minting of Noun **199** will require 2 votes, when the total Noun supply is **200**.

## Execution Risks

### Major

None.

### Minor

Execution of this proposal could result in a greater number of low quality proposals as only one vote is required to put a proposal on-chain. It's important to note that this has been and will be the case until Noun 198.

## Audit Required

**No**. This change is a configuration value update and does not introduce any new contracts.


## Validation

Validation of proposal 37 can be found [here](../test/proposal-37.test.ts).
