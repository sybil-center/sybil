import { Credential, IssueReq } from "../base/index.js";
import { ChainAlias } from "../base/index.js";

export interface DiscordAccountChallengeReq {
  redirectUrl?: string;
}

export interface DiscordAccountChallenge {
  authUrl: string;
  sessionId: string;
  signMessage: string;
}

export interface DiscordAccountIssueReq extends IssueReq {
  sessionId: string;
  signature: string;
  chain?: ChainAlias;
  address: string;
}

export interface DiscordAccountReq {
  sessionId: string;
  signMessage: string;
}

export interface DiscordAccountVC extends Credential {
  credentialSubject: {
    id: string;
    discord: {
      id: string;
      username: string;
      discriminator: string;
    };
  };
}

export interface DiscordAccountOptions {
  redirectUrl?: string;
  windowFeature?: string;
}
