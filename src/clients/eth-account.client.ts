import type { IClient } from "./client.type.js";
import {
  EthAccOwnershipProvider,
} from "../providers/eth-acc-ownership.provider.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import { EthAccount, EthAccountOptions } from "../types/ethereum/accoutn-credential.type.js";

export class EthAccountClient implements IClient<EthAccount, EthAccountOptions> {
  private readonly provider: EthAccOwnershipProvider;

  constructor(backend: HttpClient) {
    this.provider = new EthAccOwnershipProvider(backend);
  }

  async issueCredential(signFn: SignFn): Promise<EthAccount> {
    const payload = await this.provider.getPayload();
    return this.provider.issueVC(signFn, {
      messageId: payload.messageId,
      signMessage: payload.signMessage,
    });
  }
}
