import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../types/index.js";
import {
  GitHubAccountVC,
  GitHubAccountChallenge as Challenge,
  GitHubAccountChallengeReq as ChallengeReq,
  GitHubAccountIssueReq,
  GitHubAccountReq
} from "../types/github/account-credential.type.js";
import { CredentialType } from "../types/index.js";

export class GithubAccountProvider
  implements ICredentialProvider<ChallengeReq, Challenge, GitHubAccountReq, GitHubAccountVC>
{
  readonly kind: CredentialType = "GitHubAccount";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { sessionId, signMessage }: GitHubAccountReq): Promise<GitHubAccountVC> {
    const {
      chain,
      address,
      signature
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<GitHubAccountVC, GitHubAccountIssueReq>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      chain: chain,
      address: address
    });
  }
}
