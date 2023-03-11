import { ChainAlias } from "./chain-alias.type.js";

export type SignResult = {
  /**
   * As base64 string
   */
  signature: string;

  /**
   * Chain address in human-readable format
   */
  address: string;

  /**
   * Blockchain id according to
   * {@see https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md}
   * it also can be used with "did:pkh:" prefix
   */
  chain?: ChainAlias;
}
export type SignFn = (args: { message: string }) => Promise<SignResult>;
