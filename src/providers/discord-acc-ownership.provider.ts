import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../types/index.js";
import {
  DiscordAccountChallenge as Challenge,
  DiscordAccountChallengeReq as ChallengeReq,
  DiscordAccountVC,
  DiscordAccountReq, DiscordAccountIssueReq
} from "../types/discord/account-credential.type.js";
import { CredentialType } from "../types/index.js";

export class DiscordAccOwnershipProvider
  implements ICredentialProvider<ChallengeReq, Challenge, DiscordAccountReq, DiscordAccountVC> {

  readonly kind: CredentialType = "DiscordAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload<Challenge, ChallengeReq>(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { signMessage, sessionId }: DiscordAccountReq): Promise<DiscordAccountVC> {
    const {
      address,
      chain,
      signature
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<DiscordAccountVC, DiscordAccountIssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      address: address,
      chain: chain
    });
  }
}
