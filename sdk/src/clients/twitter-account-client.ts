import type { IClient } from "./client.type.js";
import {
  type ITwitterAccountOwnershipVC,
  TwitterAccOwnershipProvider,
  TwitterOwnershipOptions
} from "../providers/twitter-acc-ownership.provider.js";
import type { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import { repeatUntil } from "../util/repeat-until.js";
import { popupFeatures } from "../util/view.js";

export class TwitterAccountClient implements IClient<ITwitterAccountOwnershipVC, TwitterOwnershipOptions> {

  constructor(
    httpClient: HttpClient,
    private readonly provider = new TwitterAccOwnershipProvider(httpClient)
  ) {}

  async issueCredential(
    signFn: SignFn,
    opt?: TwitterOwnershipOptions
  ): Promise<ITwitterAccountOwnershipVC> {
    const payload = await this.provider.getPayload({
      redirectUrl: opt?.redirectUrl
    });
    const popup = window.open(
      payload.authUrl,
      "_blank",
      opt?.windowFeatures ? opt?.windowFeatures : popupFeatures()
    );
    if (!popup) throw new Error(`Can not open popup window to authenticate in Twitter`);
    await repeatUntil<boolean>(
      (r) => r,
      1000,
      () => this.provider.canIssue(payload.sessionId)
    );
    return this.provider.issueVC(signFn, {
      sessionId: payload.sessionId,
      signMessage: payload.signMessage
    });
  }
}
