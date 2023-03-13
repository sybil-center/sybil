import { IssueReq, Credential, ChallengeReq, Options } from "../base/index.js";
import { ChainAlias } from "../base/index.js";

export interface GitHubAccountChallengeReq extends ChallengeReq {
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

export interface GitHubAccountVC extends Credential {
  credentialSubject: {
    id: string;
    github: {
      id: number;
      username: string;
      userPage: string;
    };
  };
}

export interface GitHubAccountOptions extends Options {
  redirectUrl?: string;
  windowFeature?: string;
}
