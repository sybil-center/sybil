import { ChainAlias, ChallengeReq, Credential, IssueReq, Options } from "../base/index.js";

export interface DiscordAccountChallengeReq extends ChallengeReq {
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
    custom?: { [key: string]: any }
  };
}

export interface DiscordAccountOptions extends Options {
  redirectUrl?: string;
  windowFeature?: string;
}
