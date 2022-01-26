# Nouns Diligence

Nouns On-Chain Proposal Simulation and Analysis

## Setup

1. Install the [Tenderly CLI](https://github.com/tenderly/tenderly-cli#installation)
2. Login to the Tenderly CLI using `tenderly login`
3. Configure Tenderly exporting using `tenderly export init`
4. Copy the sample environment file to `.env` and populate

## Usage

1. Simulate proposal execution
    ```
    yarn task:simulate-proposal --id [proposal_id]
    ```
2. Export the execution transaction for inspection
    ```
    tenderly export [transaction_id]
    ```
