import {
  ETHEREUM_HTTP_URL,
  LOCAL_PRIVATE_KEY,
  SIMULATED_VOTE_COUNT,
  VOTING_PERIOD,
} from '../config';
import { delay, getProposalForVoteStorageKey, keypress, mineTo } from '../utils';
import { ChainId, getContractsForChainOrThrow } from '@nouns/sdk';
import { BigNumber as EthersBN, providers, utils, Wallet } from 'ethers';
import { TASK_NODE } from 'hardhat/builtin-tasks/task-names';
import { task, types } from 'hardhat/config';

task('simulate-proposal', 'Simulate a Nouns governance proposal')
  .addParam('id', 'The Nouns proposal ID', undefined, types.int)
  .addOptionalParam('hostname', 'The Local Fork Host Name', '127.0.0.1', types.string)
  .addOptionalParam('port', 'The Local Fork Port', 8545, types.int)
  .setAction(async ({ id, hostname, port }, { run }) => {
    const provider = new providers.JsonRpcProvider(ETHEREUM_HTTP_URL);

    let { nounsDaoContract: dao } = getContractsForChainOrThrow(
      ChainId.Mainnet,
      new Wallet(LOCAL_PRIVATE_KEY, provider),
    );

    const proposal = await dao.proposals(id);
    const latestBlock = await provider.getBlock('latest');

    const isPending = proposal.startBlock.gt(latestBlock.number);
    const startBlock = proposal.startBlock.toNumber();

    // Start the fork node
    await Promise.race([
      run(TASK_NODE, {
        port,
        hostname,
        fork: provider.connection.url,
        ...(!isPending ? { forkBlockNumber: startBlock } : {}),
      }),
      delay(2),
    ]);

    // Connect to the fork node, mining until the proposal start block if necessary
    const fork = new providers.JsonRpcProvider(`http://${hostname}:${port}/`);
    if (isPending) {
      await mineTo(startBlock, fork);
    }

    // Attach the DAO contract to the fork
    dao = dao.connect(dao.signer.connect(fork));

    // Simulate `SIMULATED_VOTE_COUNT` for votes
    await fork.send('hardhat_setStorageAt', [
      dao.address,
      getProposalForVoteStorageKey(id),
      utils.hexZeroPad(EthersBN.from(SIMULATED_VOTE_COUNT).toHexString(), 32),
    ]);

    // Mine until the end of the voting period
    await mineTo(startBlock + VOTING_PERIOD, fork);

    // Queue the proposal
    await dao.queue(id);

    // Fast-forward & execute proposal
    const { eta } = await dao.proposals(id);

    await fork.send('evm_setNextBlockTimestamp', [eta.toNumber()]);

    const { hash } = await dao.execute(id);

    console.log(`Execution Transaction Hash: ${hash}`);
    console.log('Export this hash to Tenderly and press any key to exit.');

    await keypress();
  });
