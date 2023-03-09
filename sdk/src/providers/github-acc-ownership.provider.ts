import type { ICredentialProvider } from "./credential-provider.type.js";
import type { SignFn } from "../util/sign-fn.type.js";
import type { HttpClient } from "../util/http-client.js";
import type { IVC } from "../util/vc.type.js";
import { ChainAlias } from "../util/chain-aliase.type.js";

export type GitHubAccOwnIssueParams = {
  sessionId: string;
  signMessage: string;
};

export type GitHubAccOwnPayloadRequest = {
  redirectUrl?: string;
};

export type GitHubAccOwnPayload = {
  authUrl: string;
  sessionId: string;
  signMessage: string;
};

export type GitHubAccOwnRequest = {
  sessionId: string;
  signature: string;
  address: string;
  chain?: ChainAlias;
};

export interface GitHubAccOwnershipVC extends IVC {
  credentialSubject: {
    id: string;
    github: {
      id: number;
      username: string;
      userPage: string;
    };
  };
}

export type GitHubOwnershipOptions = {
  redirectUrl?: string,
  windowFeature?: string
}

export class GitHubAccOwnershipProvider
  implements
    ICredentialProvider<GitHubAccOwnPayloadRequest, GitHubAccOwnPayload, GitHubAccOwnIssueParams, GitHubAccOwnershipVC>
{
  readonly kind = "GitHubAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: GitHubAccOwnPayloadRequest): Promise<GitHubAccOwnPayload> {
    return this.httpClient.payload(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  async issueVC(signAlg: SignFn, { sessionId, signMessage }: GitHubAccOwnIssueParams): Promise<GitHubAccOwnershipVC> {
    const {
      chain,
      address,
      signature
    } = await signAlg({ message: signMessage });
    return this.httpClient.issue<GitHubAccOwnershipVC, GitHubAccOwnRequest>(this.kind, {
      sessionId: sessionId,
      signature: signature,
      chain: chain,
      address: address
    });
  }
}
