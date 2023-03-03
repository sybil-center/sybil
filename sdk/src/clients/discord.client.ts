import type { IClient } from "./client.type.js";
import { DiscordAccOwnershipProvider, type DiscordAccOwnVC } from "../providers/discord-acc-ownership.provider.js";
import type { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import { repeatUntil } from "../util/repeat-until.js";

export class DiscordClient implements IClient<DiscordAccOwnVC> {
  private readonly provider: DiscordAccOwnershipProvider;

  constructor(private readonly httpClient: HttpClient) {
    this.provider = new DiscordAccOwnershipProvider(httpClient);
  }

  async issueCredential(signFn: SignFn): Promise<DiscordAccOwnVC> {
    const payload = await this.provider.getPayload({ redirectUrl: this.httpClient.popupEndpoint.href });
    window.open(
      payload.authUrl,
      payload.authUrl,
      "popup, width=700, height=700, left=620, top=500, status=yes, location=yes"
    );
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
