import { IssueReq, Credential } from "../base/credential.type.js";
import { ChainAlias } from "../base/chain-alias.type.js";

export interface GitHubAccountChallengeReq {
  redirectUrl?: string;
}

export interface GitHubAccountChallenge {
  authUrl: string;
  sessionId: string;
  signMessage: string;
}

export interface GitHubAccountReq {
  sessionId: string;
  signMessage: string;
}

export interface GitHubAccountIssueReq extends IssueReq {
  sessionId: string;
  signature: string;
  chain?: ChainAlias;
  address: string;
}

export interface GitHubAccount extends Credential{
  credentialSubject: {
    id: string;
    github: {
      id: number;
      username: string;
      userPage: string;
    };
  };
}

export interface GitHubAccountOptions {
  redirectUrl?: string;
  windowFeature?: string;
}
