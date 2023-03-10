import type { IClient } from "./client.type.js";
import {
  GitHubAccOwnershipProvider,
  type GitHubAccOwnershipVC,
  type GitHubOwnershipOptions
} from "../providers/github-acc-ownership.provider.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import { popupFeatures } from "../util/view.js";
import { repeatUntil } from "../util/repeat-until.js";

export class GithubAccountClient
  implements IClient<GitHubAccOwnershipVC, GitHubOwnershipOptions> {

  constructor(
    httpClient: HttpClient,
    private readonly provider = new GitHubAccOwnershipProvider(httpClient)
  ) {}

  async issueCredential(
    signFn: SignFn,
    opt?: GitHubOwnershipOptions
  ): Promise<GitHubAccOwnershipVC> {
    const payload = await this.provider.getPayload({
      redirectUrl: opt?.redirectUrl
    });
    const popup = window.open(
      payload.authUrl,
      "_blank",
      opt?.windowFeature ? opt?.windowFeature : popupFeatures()
    );
    if (!popup) throw new Error(`Can not open popup window to authenticate in GitHub`);
    await repeatUntil<boolean>(
      (r) => r,
      1000,
      () => this.provider.canIssue(payload.sessionId)
    );
    return this.provider.issueVC(signFn, {
      sessionId: payload.sessionId,
      signMessage: payload.signMessage,
    });
  }
}
