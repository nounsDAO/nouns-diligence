import { BigNumber as EthersBN } from 'ethers';

export enum ProposalState {
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

export interface Proposal {
  id: EthersBN;
  proposer: string;
  proposalThreshold: EthersBN;
  quorumVotes: EthersBN;
  eta: EthersBN;
  startBlock: EthersBN;
  endBlock: EthersBN;
  forVotes: EthersBN;
  againstVotes: EthersBN;
  abstainVotes: EthersBN;
  canceled: boolean;
  vetoed: boolean;
  executed: boolean;
}
