import type { IClient } from "./client.type.js";
import {
  EthAccountProvider,
} from "../providers/eth-account.provider.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../types/index.js";
import { EthAccountVC, EthAccountOptions } from "../types/index.js";

export class EthAccountClient implements IClient<EthAccountVC, EthAccountOptions> {
  private readonly provider: EthAccountProvider;

  constructor(backend: HttpClient) {
    this.provider = new EthAccountProvider(backend);
  }

  async issueCredential(signFn: SignFn): Promise<EthAccountVC> {
    const payload = await this.provider.getPayload();
    return this.provider.issueVC(signFn, {
      messageId: payload.messageId,
      signMessage: payload.signMessage,
    });
  }
}
