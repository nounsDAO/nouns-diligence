import { BigNumber as EthersBN, providers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { FOR_VOTE_MEMBER_INDEX } from './config';

/**
 * Get the `forVotes` storage key for the passed proposal id
 * @param proposalId The proposal id
 */
export const getProposalForVoteStorageKey = (proposalId: number) => {
  const hash = solidityKeccak256(['uint256', 'uint256'], [proposalId, FOR_VOTE_MEMBER_INDEX]);
  return EthersBN.from(hash).add(FOR_VOTE_MEMBER_INDEX).toHexString();
};

/**
 * Mine the Hardhat network to `targetBlock`
 * Multi-block mining has not been implemented yet:
 * https://github.com/nomiclabs/hardhat/issues/1112
 * @param targetBlock The target block number
 * @param provider The Hardhat provider
 */
export const mineTo = async (targetBlock: number, provider: providers.JsonRpcProvider) => {
  const latestBlock = await provider.getBlock('latest');
  const blocksToMine = targetBlock - latestBlock.number;
  for (let i = 0; i < blocksToMine; i++) {
    await provider.send('evm_mine', []);
  }
};

/**
 * Delay for `seconds`
 * @param seconds The number of seconds to delay
 */
export const delay = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
