import { solidity } from 'ethereum-waffle';
import { providers, utils, Signer, Contract } from 'ethers';
import { NounsDAOExecutorABI } from './abi';
import { NODE_HOSTNAME, NODE_PORT } from '../src/config';
import chai from 'chai';
import { ChainId, getContractsForChainOrThrow } from '@nouns/sdk';

chai.use(solidity);
const { expect } = chai;

/**
 * This suite validates that the on-chain private offer can be filled
 * by the Lil Nouns treasury.
 */
describe('Proposal 81', () => {
  const MOCK_ADMIN = '0x000000000000000000000000000000000000dEaD';
  const NOUNS_TOKEN = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
  const NOUNS_DAO_TREASURY = '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10';
  const LIL_NOUNS_DAO_TREASURY = '0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB';
  const ASKS_PRIVATE_ETH_MODULE = '0xfbf87e6c2c242d0166E2Ddb60Db5A94cD4dAe00e';

  const FILL_ASK_SIGNATURE = 'fillAsk(address,uint256)';
  const OFFERED_NOUN_ID = 253;
  const PRICE = utils.parseEther('4.2069');

  const provider = new providers.JsonRpcProvider(`http://${NODE_HOSTNAME}:${NODE_PORT}/`);

  let signer: Signer;
  let snapshotId: string;
  let lilNounsDAOTreasury: Contract;
  const { nounsTokenContract } = getContractsForChainOrThrow(ChainId.Mainnet, provider);

  before(async () => {
    await provider.send('hardhat_impersonateAccount', [MOCK_ADMIN]);

    signer = provider.getSigner(MOCK_ADMIN);
    lilNounsDAOTreasury = new Contract(LIL_NOUNS_DAO_TREASURY, NounsDAOExecutorABI, signer);

    // Overwrite the Lil Nouns treasury admin
    await provider.send('hardhat_setStorageAt', [
      LIL_NOUNS_DAO_TREASURY,
      '0x0', // `admin` storage slot (0)
      utils.hexZeroPad(MOCK_ADMIN, 32),
    ]);
  });

  beforeEach(async () => {
    snapshotId = await provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the offer to be filled by the Lil Nouns DAO treasury', async () => {
    const { timestamp } = await provider.getBlock('latest');
    const delay = 60 * 60 * 24 * 2;
    const buffer = 60 * 60;
    const eta = timestamp + delay + buffer;
    const args = [
      ASKS_PRIVATE_ETH_MODULE,
      PRICE,
      FILL_ASK_SIGNATURE,
      utils.defaultAbiCoder.encode(['address', 'uint256'], [NOUNS_TOKEN, OFFERED_NOUN_ID]),
      eta,
    ];

    const queue = await lilNounsDAOTreasury.queueTransaction(...args);
    await queue.wait();

    await provider.send('evm_increaseTime', [delay + buffer + 1]);

    const nounsDAOBalanceBefore = await provider.getBalance(NOUNS_DAO_TREASURY);

    const execution = await lilNounsDAOTreasury.executeTransaction(...args);
    await execution.wait();

    const nounsDAOBalanceAfter = await provider.getBalance(NOUNS_DAO_TREASURY);
    const noun253Owner = await nounsTokenContract.ownerOf(OFFERED_NOUN_ID);

    expect(nounsDAOBalanceAfter.sub(nounsDAOBalanceBefore)).to.equal(PRICE);
    expect(noun253Owner).to.equal(LIL_NOUNS_DAO_TREASURY);
  });
});
