import { ETHEREUM_HTTP_URL, TENDERLY_PROJECT, TENDERLY_USERNAME } from './src/config';
import { HardhatUserConfig } from 'hardhat/config';
import '@tenderly/hardhat-tenderly';
import '@nomiclabs/hardhat-ethers';
import './src/tasks';

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      url: ETHEREUM_HTTP_URL,
    },
  },
  tenderly: {
    project: TENDERLY_PROJECT,
    username: TENDERLY_USERNAME,
  },
};
export default config;
