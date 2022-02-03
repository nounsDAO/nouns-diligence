# Nouns Diligence

Nouns On-Chain Proposal Simulation and Analysis

## For Voters

Technical reports for all reviewed proposals can be found in the [reports](./reports) folder.

## For Reviewers

Simulation is a useful tool for inspecting execution of complex on-chain proposals, but it's not the only tool that should be used. Consult the report template for additional review steps.

### Setup

1. Install the [Tenderly CLI](https://github.com/tenderly/tenderly-cli#installation)
2. Login to the Tenderly CLI using `tenderly login`
3. Configure Tenderly exporting using `tenderly export init`
4. Copy the sample environment file to `.env` and populate

### Proposal Simulation & Analysis

1. Simulate proposal execution
    ```
    yarn task:simulate-proposal --id [proposal_id]
    ```
2. Export the execution transaction for inspection
    ```
    tenderly export [transaction_id]
    ```

### Simple Validation (Test Coverage)

Proposal test coverage is useful when the proposal is of low to moderate complexity. Test coverage is not exhaustive.

**Running Tests**

Prior to running a proposal test suite, simulate the proposal using the the above command and leave the node running.

Once simulation completes, use the following command to run the proposal test suite:

```
yarn test:proposal [id]
```


**Writing Tests**

Use `test/proposal-37.test.ts` as an example.

Note that the file name must be of format: `proposal-[id].test.ts`.
