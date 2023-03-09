import type { IClient } from "./client.type.js";
import {
  DiscordAccOwnershipProvider,
  type DiscordAccOwnVC,
  DiscordOwnershipOptions
} from "../providers/discord-acc-ownership.provider.js";
import type { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import { repeatUntil } from "../util/repeat-until.js";
import { popupFeatures } from "../util/view.js";

export class DiscordAccountClient
  implements IClient<DiscordAccOwnVC, DiscordOwnershipOptions> {

  constructor(
    httpClient: HttpClient,
    private readonly provider = new DiscordAccOwnershipProvider(httpClient)
  ) {}

  async issueCredential(
    signFn: SignFn,
    opt?: DiscordOwnershipOptions
  ): Promise<DiscordAccOwnVC> {
    const payload = await this.provider.getPayload({
      redirectUrl: opt?.redirectUrl
    });
    const popup = window.open(
      payload.authUrl,
      "_blank",
      opt?.windowFeature ? opt?.windowFeature : popupFeatures()
    );
    if (!popup) throw new Error(`Can not open popup window to authenticate in Discord`);
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
