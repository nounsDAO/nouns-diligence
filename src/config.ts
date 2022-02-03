import dotenv from 'dotenv';

dotenv.config();

// Node Fields

// Local fork node hostname
export const NODE_HOSTNAME = '127.0.0.1';

// Local fork node port
export const NODE_PORT = 8545;

// Proposal Fields

// 14 days in seconds
export const GRACE_PERIOD = 60 * 60 * 24 * 14;

// Voting period in blocks
export const VOTING_PERIOD = 19710;

// The index of `forVotes` in the Proposal struct
export const FOR_VOTE_MEMBER_INDEX = 11;

// The number of simulated for votes
export const SIMULATED_VOTE_COUNT = 1_000;

// The Ethereum RPC URL (Requires archive node for older proposals)
export const ETHEREUM_HTTP_URL = process.env.ETHEREUM_HTTP_URL;

// The Tenderly project name
export const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT!;

// The Tenderly username
export const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME!;

// Hardhat private key
// prettier-ignore
export const LOCAL_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
