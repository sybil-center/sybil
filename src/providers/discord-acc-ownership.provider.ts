import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import {
  DiscordAccountChallenge as Challenge,
  DiscordAccountChallengeReq as ChallengeReq,
  DiscordAccount,
  DiscordAccountReq, DiscordAccountIssueReq
} from "../types/discord/account-credential.type.js";

export class DiscordAccOwnershipProvider
  implements ICredentialProvider<
    ChallengeReq,
    Challenge,
    DiscordAccountReq,
    DiscordAccount
  >
{
  readonly kind = "DiscordAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload<Challenge, ChallengeReq>(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { signMessage, sessionId }: DiscordAccountReq): Promise<DiscordAccount> {
    const {
      address,
      chain,
      signature
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<DiscordAccount, DiscordAccountIssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      address: address,
      chain: chain
    });
  }
}
