# Proposal 81: Allocate Noun to Lil Nouns DAO - "treasure quest" edition

## Overview

Proposal 81 creates an on-chain listing of Noun 253, which is only fillable by the Lil Nouns treasury, for 4.2069 ETH.

The on-chain listing of Noun 253 involves 3 function calls:

1. `setApprovalForModule` - Allow the Zora 'Asks Private ETH' module to call the ERC721 transfer helper.
2. `approve` - Allow the ERC721 transfer helper to transfer Noun 253 from the Nouns DAO treasury.
3. `createAsk` - Create the on-chain, private listing of Noun 253 for 4.2069 ETH.

## Proposal Description Accuracy

The proposal description is accurate and does not attempt to deceive the DAO.

## Execution Risks

### Critical

None.

### Major

None.

### Minor

- The 'Asks Private ETH' [module owner multisig](https://etherscan.io/address/0xd1d1D4e36117aB794ec5d4c78cBD3a8904E691D0) has the ability to set the module fee to 100%, taking all of the ETH provided by the Lil Nouns treasury in exchange for Noun 253. Zora would lose far more in reputational damage, so this would likely only occur if two or more of the multisig signers were compromised.
- General smart contract risk, siloed to Noun 253.
- No expiry of the on-chain, private offer.

## Audit Required

**No**


## Validation

Validation of proposal 81 can be found [here](../test/proposal-81.test.ts).
