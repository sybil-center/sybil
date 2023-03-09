import type { IVC } from "../util/vc.type.js";
import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { SignFn } from "../util/sign-fn.type.js";


export interface EthAccOwnershipIssueVCPayload {
  messageId: string;
  signMessage: string;
}

export interface IEthAccountOwnershipVC extends IVC {}

/**
 * Request interface for generate ethereum account ownership VC
 */
export interface EthAccountOwnershipRequest {
  /**
   * sign message id
   */
  messageId: string;

  /**
   * signed message by eth private key
   */
  signature: string;

  address: string;

  /**
   * Client define his own subject information
   */
  credentialSubject?: object;
  /**
   * Entity with executing request defined id of vc
   */
  vcId?: string;
}

export type EthOwnershipOptions = {
}

/**
 * Ethereum account ownership VC provider
 */
export class EthAccOwnershipProvider
  implements
    ICredentialProvider<void, EthAccOwnershipIssueVCPayload, EthAccOwnershipIssueVCPayload, IEthAccountOwnershipVC>
{
  readonly kind = "EthAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get payload for issuing VC.
   * Payload contains {@link EthAccOwnershipIssueVCPayload#message} that has to be signed by ETH wallet / account,
   * and {@link EthAccOwnershipIssueVCPayload#messageId} that is id of message that has to be attached to
   * {@link EthAccountOwnershipRequest}
   * @throws Error
   */
  getPayload(): Promise<EthAccOwnershipIssueVCPayload> {
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
  async issueVC(signMessageAlg: SignFn, params: EthAccOwnershipIssueVCPayload): Promise<IEthAccountOwnershipVC> {
    const {
      signature,
      address
    } = await signMessageAlg({ message: params.signMessage });
    return this.httpClient.issue<IEthAccountOwnershipVC, EthAccountOwnershipRequest>(this.kind, {
      messageId: params.messageId,
      signature: signature,
      address: address
    });
  }
}
