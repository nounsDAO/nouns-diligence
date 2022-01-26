import { HardhatUserConfig } from 'hardhat/config';
import { ETHEREUM_HTTP_URL } from './src/config';
import '@tenderly/hardhat-tenderly';
import '@nomiclabs/hardhat-ethers';
import './src/tasks';

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      url: ETHEREUM_HTTP_URL,
    },
  },
};
export default config;
