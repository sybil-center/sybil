import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../types/index.js";
import {
  TwitterAccountVC,
  TwitterAccountChallenge as Challenge,
  TwitterAccountChallengeReq as ChallengeReq,
  TwitterAccountIssueReq,
  TwitterAccountReq
} from "../types/twitter/account-credential.type.js";
import { CredentialType } from "../types/index.js";

export class TwitterAccountProvider
  implements ICredentialProvider<ChallengeReq, Challenge, TwitterAccountReq, TwitterAccountVC> {

  readonly kind: CredentialType = "TwitterAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  /**
   * Make request to issuer to issue VC
   * @param signAlg algorithm for sign message
   * @param sessionId id of session
   * @param signMessage message which will be signed
   */
  async issueVC(
    signAlg: SignFn,
    { sessionId, signMessage }: TwitterAccountReq
  ): Promise<TwitterAccountVC> {
    const {
      signature,
      address,
      chain
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<TwitterAccountVC, TwitterAccountIssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      chain: chain,
      address: address
    });
  }
}
