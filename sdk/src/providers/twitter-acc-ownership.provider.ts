import type { ICredentialProvider } from "./credential-provider.type.js";
import type { SignFn } from "../util/sign-fn.type.js";
import type { HttpClient } from "../util/http-client.js";
import type { IVC } from "../util/vc.type.js";

export type TwitterAccOwnershipIssueParams = {
  sessionId: string;
  signMessage: string;
};

export type TwitterAccOwnershipPayloadRequest = {
  redirectUrl: string;
};

/**
 * Payload for issue VC of Twitter account ownership
 *
 * {@see https://www.rfc-editor.org/rfc/rfc6749}
 * {@see https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code}
 */
export type TwitterAccOwnPayload = {
  /**
   * Ref to authenticate user in Twitter
   */
  authUrl: string;

  /**
   * Property responsible for save user session for
   * safe get "code" needed to authenticate user
   */
  sessionId: string;

  /**
   * Message for sign by wallet / private key
   */
  signMessage: string;
};

/**
 * Request entity for generate twitter account ownership VC
 */
export type TwitterAccOwnRequest = {
  sessionId: string;

  /**
   * Sign message {@link TwitterAccOwnPayload#signMessage} by wallet / private key
   */
  signature: string;
};

export interface ITwitterAccountOwnershipVC extends IVC {
  credentialSubject: {
    id: string;
    twitter: {
      id: string;
      username: string;
    }
  };
}

export class TwitterAccOwnershipProvider
  implements
    ICredentialProvider<
      TwitterAccOwnershipPayloadRequest,
      TwitterAccOwnPayload,
      TwitterAccOwnershipIssueParams,
      ITwitterAccountOwnershipVC
    >
{
  readonly kind = "TwitterAccountOwnershipCredential";
  constructor(private readonly httpClient: HttpClient) {}

  getPayload(payloadRequest: TwitterAccOwnershipPayloadRequest): Promise<TwitterAccOwnPayload> {
    return this.httpClient.payload(this.kind, payloadRequest);
  }

  canIssue(sessionId: string): Promise<boolean> {
    return this.httpClient.canIssue(this.kind, sessionId);
  }

  /**
   * Make request to issuer to issue VC
   * @param signAlg algorithm for sign message
   * @param sessionId id of session
   * @param signMessage message which will be signed
   */
  async issueVC(
    signAlg: SignFn,
    { sessionId, signMessage }: TwitterAccOwnershipIssueParams
  ): Promise<ITwitterAccountOwnershipVC> {
    const signature = await signAlg({ message: signMessage });
    return this.httpClient.issue<ITwitterAccountOwnershipVC, TwitterAccOwnRequest>(this.kind, {
      sessionId: sessionId,
      signature: signature,
    });
  }
}
