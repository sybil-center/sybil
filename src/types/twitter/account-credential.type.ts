import { IssueReq, Credential, ChallengeReq, Options } from "../base/index.js";
import { ChainAlias } from "../base/index.js";

export interface TwitterAccountChallengeReq extends ChallengeReq {
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

export interface TwitterAccountVC extends Credential {
  credentialSubject: {
    id: string;
    twitter: {
      id: string;
      username: string;
    }
  };
}

export interface TwitterAccountOptions extends Options {
  redirectUrl?: string;
  windowFeatures?: string;
}
