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

### Usage

1. Simulate proposal execution
    ```
    yarn task:simulate-proposal --id [proposal_id]
    ```
2. Export the execution transaction for inspection
    ```
    tenderly export [transaction_id]
    ```
