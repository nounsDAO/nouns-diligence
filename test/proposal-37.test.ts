import { deployMockContract, MockContract, solidity } from 'ethereum-waffle';
import { ChainId, getContractsForChainOrThrow, NounsTokenABI } from '@nouns/sdk';
import { providers, utils, BigNumber as EthersBN, Signer, constants } from 'ethers';
import { NODE_HOSTNAME, NODE_PORT } from '../src/config';
import chai from 'chai';

chai.use(solidity);
const { expect } = chai;

/**
 * This suite runs several tests to validate the following:
 * - Noun owners or delegates can propose with a single vote until a supply
 * of 399 Nouns is reached. We assume the supply at the time of execution
 * to be 204, but it may be higher depending on when execution occurs.
 * - Noun owners or delegates must have at least two votes to propose once
 * a supply of 400 Nouns is reached.
 *
 * Note: `NounsDAOLogicV1` validates that the proposer has MORE votes than
 * the proposal threshold: https://bit.ly/3ghElRt.
 */
describe('Proposal 37', () => {
  const MOCK_DEPLOYER = '0x000000000000000000000000000000000000dEaD';

  const provider = new providers.JsonRpcProvider(`http://${NODE_HOSTNAME}:${NODE_PORT}/`);
  let { nounsDaoContract } = getContractsForChainOrThrow(ChainId.Mainnet, provider);

  let signer: Signer;
  let snapshotId: string;
  let mockNounsToken: MockContract;

  before(async () => {
    await provider.send('hardhat_impersonateAccount', [MOCK_DEPLOYER]);

    signer = provider.getSigner(MOCK_DEPLOYER);
    mockNounsToken = await deployMockContract(signer, NounsTokenABI);

    nounsDaoContract = nounsDaoContract.connect(signer);

    // Point the DAO to the Nouns contract stub
    await provider.send('hardhat_setStorageAt', [
      nounsDaoContract.address,
      utils.hexStripZeros(EthersBN.from(10).toHexString()), // `nouns` storage slot (10)
      utils.hexZeroPad(mockNounsToken.address, 32),
    ]);
  });

  beforeEach(async () => {
    snapshotId = await provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await provider.send('evm_revert', [snapshotId]);
  });

  it('should allow a Noun owner to propose with a single vote when the total supply is 204', async () => {
    await mockNounsToken.mock.getPriorVotes.returns(1);

    await mockNounsToken.mock.totalSupply.returns(204);

    const proposalThreshold = await nounsDaoContract.proposalThreshold();
    expect(proposalThreshold).to.equal(0);

    await expect(nounsDaoContract.propose([constants.AddressZero], [0], [''], ['0x'], '')).to.emit(
      nounsDaoContract,
      'ProposalCreated',
    );
  });

  it('should allow a Noun owner to propose with a single vote when the total supply is 399', async () => {
    await mockNounsToken.mock.getPriorVotes.returns(1);

    await mockNounsToken.mock.totalSupply.returns(399);

    const proposalThreshold = await nounsDaoContract.proposalThreshold();
    expect(proposalThreshold).to.equal(0);

    await expect(nounsDaoContract.propose([constants.AddressZero], [0], [''], ['0x'], '')).to.emit(
      nounsDaoContract,
      'ProposalCreated',
    );
  });

  it('should require two votes to propose once a supply of 400 Nouns is reached', async () => {
    await mockNounsToken.mock.totalSupply.returns(400);
    await mockNounsToken.mock.getPriorVotes.returns(1);

    const proposalThreshold = await nounsDaoContract.proposalThreshold();
    expect(proposalThreshold).to.equal(1);

    await expect(
      nounsDaoContract.propose([constants.AddressZero], [0], [''], ['0x'], ''),
    ).to.be.revertedWith('NounsDAO::propose: proposer votes below proposal threshold');

    await mockNounsToken.mock.getPriorVotes.returns(2);

    await expect(nounsDaoContract.propose([constants.AddressZero], [0], [''], ['0x'], '')).to.emit(
      nounsDaoContract,
      'ProposalCreated',
    );
  });
});
