import { IssueReq } from "../base/credential.type.js";

export interface EthAccountChallenge {
  messageId: string;
  signMessage: string;
}

export interface EthAccountReq extends EthAccountChallenge{}

export interface EthAccountIssueReq extends IssueReq {
  messageId: string;
  signature: string;
  address: string;
  chain?: string;
}

export interface EthAccount extends Credential {}

export interface EthAccountOptions {}
