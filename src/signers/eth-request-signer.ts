import * as uint8arrays from "uint8arrays";
import { ISigner } from "./signer.type.js";

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface IEIP1193Provider {
  enable?: () => Promise<void>;
  request<T = unknown>(args: RequestArguments): Promise<T>;
}

export class EthRequestSigner implements ISigner {
  constructor(private readonly provider: IEIP1193Provider) {
    this.sign = this.sign.bind(this);
  }

  async sign(args: { message: string }): Promise<`0x${string}`> {
    const message = args.message;
    const account = await this.getAccount();
    const hex = uint8arrays.toString(uint8arrays.fromString(message), "hex");
    return this.provider
      .request<`0x${string}`>({
        method: "eth_sign",
        params: [account, hex],
      })
      .catch((reason) => {
        // MetaMask does not like eth_sign
        if ("code" in reason && (reason.code === -32602 || reason.code === -32601)) {
          return this.provider.request({
            method: "personal_sign",
            params: [account, hex],
          });
        } else {
          throw reason;
        }
      });
  }

  async getAccount(): Promise<string> {
    const accounts = (await this.provider.request({
      method: "eth_accounts",
    })) as string[];
    const account = accounts[0];
    if (!account) {
      throw new Error(`Enable Ethereum provider`);
    }
    return account;
  }
}
