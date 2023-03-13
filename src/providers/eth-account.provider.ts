import { ICredentialProvider } from "./credential-provider.type.js";
import { HttpClient } from "../util/http-client.js";
import type { EthAccountChallengeReq as ChallengeReq, SignFn } from "../types/index.js";
import {
  EthAccountVC,
  EthAccountChallenge as Challenge,
  EthAccountIssueReq,
  EthAccountReq
} from "../types/index.js";
import { CredentialType } from "../types/index.js";

/**
 * Ethereum account ownership VC provider
 */
export class EthAccountProvider
  implements ICredentialProvider<ChallengeReq, Challenge, EthAccountReq, EthAccountVC> {

  readonly kind: CredentialType = "EthAccountOwnershipCredential";

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get payload for issuing VC.
   * Payload contains {@link EthAccountChallenge#message} that has to be signed by ETH wallet / account,
   * and {@link EthAccountChallenge#messageId} that is id of message that has to be attached to
   * {@link EthAccountReq}
   * @throws Error
   */
  getPayload(challengeReq: ChallengeReq): Promise<Challenge> {
    return this.httpClient.payload<Challenge, ChallengeReq>(
      this.kind, challengeReq
    );
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
  async issueVC(signMessageAlg: SignFn, params: EthAccountReq): Promise<EthAccountVC> {
    const {
      signature,
      address
    } = await signMessageAlg({ message: params.signMessage });
    return this.httpClient.issue<EthAccountVC, EthAccountIssueReq>(this.kind, {
      messageId: params.messageId,
      signature: signature,
      address: address,
      chain: "did:pkh:eip155:1"
    });
  }
}
