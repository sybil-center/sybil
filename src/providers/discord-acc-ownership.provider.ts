import type { ICredentialProvider } from "./credential-provider.type.js";
import type { SignFn } from "../util/sign-fn.type.js";
import type { HttpClient } from "../util/http-client.js";
import type { IVC } from "../util/vc.type.js";

export type ChallengeReq = {
  redirectUrl: string;
};

export type Challenge = {
  authUrl: string;
  sessionId: string;
  signMessage: string;
};

export type IssueReq = {
  sessionId: string;
  signature: string;
};

export interface CredentialReq {
  sessionId: string;
  signMessage: string;
}

export interface DiscordAccOwnVC extends IVC {
  credentialSubject: {
    id: string;
    discord: {
      id: string;
      username: string;
      discriminator: string;
    };
  };
}

export class DiscordAccOwnershipProvider
  implements ICredentialProvider<ChallengeReq, Challenge, CredentialReq, DiscordAccOwnVC>
{
  readonly kind = "DiscordAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload<Challenge, ChallengeReq>(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { signMessage, sessionId }: CredentialReq): Promise<DiscordAccOwnVC> {
    const signature = await signAlg({ message: signMessage });
    return this.httpClient.issue<DiscordAccOwnVC, IssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
    });
  }
}
