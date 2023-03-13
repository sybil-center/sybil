import { ChallengeReq, IssueReq, Options } from "../base/index.js";
import { Credential } from "../base/index.js";

export interface EthAccountChallengeReq extends ChallengeReq {}

export interface EthAccountChallenge {
  messageId: string;
  signMessage: string;
}

export interface EthAccountReq extends EthAccountChallenge {}

export interface EthAccountIssueReq extends IssueReq {
  messageId: string;
  signature: string;
  address: string;
  chain?: string;
}

export interface EthAccountVC extends Credential {}

export interface EthAccountOptions extends Options {}
