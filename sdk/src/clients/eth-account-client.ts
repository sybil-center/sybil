import {
  EthOwnershipOptions,
  EthAccOwnershipProvider,
  type IEthAccountOwnershipVC
} from "../providers/eth-acc-ownership.provider.js";
import type { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import type { IClient } from "./client.type.js";

export class EthAccountClient implements IClient<IEthAccountOwnershipVC, EthOwnershipOptions> {
  private readonly provider: EthAccOwnershipProvider;

  constructor(backend: HttpClient) {
    this.provider = new EthAccOwnershipProvider(backend);
  }

  async issueCredential(signFn: SignFn): Promise<IEthAccountOwnershipVC> {
    const payload = await this.provider.getPayload();
    return this.provider.issueVC(signFn, {
      messageId: payload.messageId,
      signMessage: payload.signMessage,
    });
  }
}
