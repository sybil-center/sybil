import { IssueReq, Credential } from "../base/credential.type.js";
import { ChainAlias } from "../base/chain-alias.type.js";

export interface TwitterAccountChallengeReq {
  redirectUrl?: string;
}

export interface TwitterAccountChallenge {
  authUrl: string;
  sessionId: string;
  signMessage: string;
}

export interface TwitterAccountReq {
  sessionId: string;
  signMessage: string;
}

export interface TwitterAccountIssueReq extends IssueReq {
  sessionId: string;
  signature: string;
  chain?: ChainAlias;
  address: string;
}

export interface TwitterAccount extends Credential {
  credentialSubject: {
    id: string;
    twitter: {
      id: string;
      username: string;
    }
  };
}

export interface TwitterAccountOptions {
  redirectUrl?: string;
  windowFeatures?: string;
}
