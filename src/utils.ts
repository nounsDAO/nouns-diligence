import { BigNumber as EthersBN, Contract, providers, utils } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { FOR_VOTE_MEMBER_INDEX } from './config';

/**
 * Get the `forVotes` storage key for the passed proposal id
 * @param proposalId The proposal id
 */
export const getProposalForVoteStorageKey = (proposalId: number) => {
  const hash = solidityKeccak256(['uint256', 'uint256'], [proposalId, FOR_VOTE_MEMBER_INDEX]);
  return utils.hexStripZeros(EthersBN.from(hash).add(FOR_VOTE_MEMBER_INDEX).toHexString());
};

/**
 * Mint until the passed noun id is reached
 * @param nounsToken The Nouns token contract
 * @param targetNounId The target noun id
 * @param provider The Hardhat provider
 * @param minter The address that has the minter role
 */
export const mintTo = async (
  nounsToken: Contract,
  targetNounId: number,
  provider: providers.JsonRpcProvider,
  minter: string,
) => {
  await provider.send('hardhat_impersonateAccount', [minter]);

  const signer = provider.getSigner(minter);
  const contract = nounsToken.connect(signer);

  while ((await contract.totalSupply()) < targetNounId) {
    await contract.mint();
  }
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
  await provider.send('hardhat_mine', [utils.hexStripZeros(utils.hexlify(blocksToMine))]);
};

/**
 * Delay for `seconds`
 * @param seconds The number of seconds to delay
 */
export const delay = (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

/**
 * Wait for any keypress
 */
export const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise(resolve =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve(true);
    }),
  );
};
