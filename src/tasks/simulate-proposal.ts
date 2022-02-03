import {
  ETHEREUM_HTTP_URL,
  LOCAL_PRIVATE_KEY,
  NODE_HOSTNAME,
  NODE_PORT,
  SIMULATED_VOTE_COUNT,
} from '../config';
import { delay, getProposalForVoteStorageKey, keypress, mineTo } from '../utils';
import { ChainId, getContractsForChainOrThrow } from '@nouns/sdk';
import { BigNumber as EthersBN, providers, utils, Wallet } from 'ethers';
import { TASK_NODE } from 'hardhat/builtin-tasks/task-names';
import { task, types } from 'hardhat/config';

task('simulate-proposal', 'Simulate a Nouns governance proposal')
  .addParam('id', 'The Nouns proposal ID', undefined, types.int)
  .setAction(async ({ id }, { run }) => {
    const provider = new providers.JsonRpcProvider(ETHEREUM_HTTP_URL);

    let { nounsDaoContract: dao } = getContractsForChainOrThrow(
      ChainId.Mainnet,
      new Wallet(LOCAL_PRIVATE_KEY, provider),
    );

    const proposal = await dao.proposals(id);
    const latestBlock = await provider.getBlock('latest');

    const isPendingOrActive = proposal.endBlock.gt(latestBlock.number);
    const endBlock = proposal.endBlock.toNumber();

    // Start the fork node
    await Promise.race([
      run(TASK_NODE, {
        port: NODE_PORT,
        hostname: NODE_HOSTNAME,
        fork: provider.connection.url,
        ...(!isPendingOrActive ? { forkBlockNumber: endBlock } : {}),
      }),
      delay(2),
    ]);

    // Connect to the fork node, mining until the proposal start block if necessary
    const fork = new providers.JsonRpcProvider(`http://${NODE_HOSTNAME}:${NODE_PORT}/`);
    if (isPendingOrActive) {
      await mineTo(endBlock, fork);
    }

    // Attach the DAO contract to the fork
    dao = dao.connect(dao.signer.connect(fork));

    // Simulate `SIMULATED_VOTE_COUNT` for votes
    await fork.send('hardhat_setStorageAt', [
      dao.address,
      getProposalForVoteStorageKey(id),
      utils.hexZeroPad(EthersBN.from(SIMULATED_VOTE_COUNT).toHexString(), 32),
    ]);

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
