import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import {
  GitHubAccount,
  GitHubAccountChallenge as Challenge,
  GitHubAccountChallengeReq as ChallengeReq,
  GitHubAccountIssueReq,
  GitHubAccountReq
} from "../types/github/account-credential.type.js";

export class GitHubAccOwnershipProvider
  implements ICredentialProvider<ChallengeReq, Challenge, GitHubAccountReq, GitHubAccount>
{
  readonly kind = "GitHubAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { sessionId, signMessage }: GitHubAccountReq): Promise<GitHubAccount> {
    const {
      chain,
      address,
      signature
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<GitHubAccount, GitHubAccountIssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      chain: chain,
      address: address
    });
  }
}
