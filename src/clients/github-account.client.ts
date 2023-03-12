import type { IClient } from "./client.type.js";
import {
  GithubAccountProvider,
} from "../providers/github-account.provider.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../types/index.js";
import { popupFeatures } from "../util/view.js";
import { repeatUntil } from "../util/repeat-until.js";
import { GitHubAccountVC, GitHubAccountOptions } from "../types/index.js";

export class GithubAccountClient
  implements IClient<GitHubAccountVC, GitHubAccountOptions> {

  constructor(
    httpClient: HttpClient,
    private readonly provider = new GithubAccountProvider(httpClient)
  ) {}

  async issueCredential(
    signFn: SignFn,
    opt?: GitHubAccountOptions
  ): Promise<GitHubAccountVC> {
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
