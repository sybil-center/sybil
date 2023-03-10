import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";
import {
  EthAccount,
  EthAccountChallenge,
  EthAccountIssueReq,
  EthAccountReq
} from "../types/ethereum/accoutn-credential.type.js";

/**
 * Ethereum account ownership VC provider
 */
export class EthAccOwnershipProvider
  implements ICredentialProvider<void, EthAccountChallenge, EthAccountReq, EthAccount> {

  readonly kind = "EthAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get payload for issuing VC.
   * Payload contains {@link EthAccOwnershipIssueVCPayload#message} that has to be signed by ETH wallet / account,
   * and {@link EthAccOwnershipIssueVCPayload#messageId} that is id of message that has to be attached to
   * {@link EthAccountOwnershipRequest}
   * @throws Error
   */
  getPayload(): Promise<EthAccountChallenge> {
    return this.httpClient.payload(this.kind);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  /**
   * Execute all processes needed for issue VC
   * Better use this method for get VC.
   * It implements all needed functional for get "Ethereum account ownership VC" by the simplest way
   * @param params
   * @param signMessageAlg algorithm of signing message
   * @throws Error
   */
  async issueVC(signMessageAlg: SignFn, params: EthAccountReq): Promise<EthAccount> {
    const {
      signature,
      address
    } = await signMessageAlg({ message: params.signMessage });
    return this.httpClient.issue<EthAccount, EthAccountIssueReq>(this.kind, {
      messageId: params.messageId,
      signature: signature,
      address: address,
      chain: "did:pkh:eip155:1"
    });
  }
}
