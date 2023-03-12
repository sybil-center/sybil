import { canIssueEP, challengeEP, issueEP } from "./endpoint.util.js";
import { CredentialType } from "../types/index.js";

export class HttpClient {

  constructor(
    readonly issuerDomain: URL
  ) {}

  async payload<
    TResponse, // TODO It should be unknown
    // TParams extends Record<string, string> = any TODO It should be some kind of Record<string, string>
    TParams = any
  >(credentialType: CredentialType, params?: TParams): Promise<TResponse> {
    // FIXME ts-essential Opaque
    const endpoint = new URL(challengeEP(credentialType), this.issuerDomain);
    if (params) {
      Object
        .entries(params)
        .forEach(([key, value]) => {
          if (value) endpoint.searchParams.set(key, String(value));
        });
    }
    return fetch(endpoint).then((r) => r.json());
  }

  async canIssue(credentialType: CredentialType, sessionId: string): Promise<boolean> {
    const endpoint = new URL(canIssueEP(credentialType), this.issuerDomain);
    endpoint.searchParams.set("sessionId", sessionId);
    const response = await fetch(endpoint).then((r) => r.json());
    return Boolean(response.canIssue);
  }

  async issue<TResponse, TParams = any>(credentialType: CredentialType, params: TParams): Promise<TResponse> {
    const endpoint = new URL(issueEP(credentialType), this.issuerDomain);
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then((r) => r.json());
  }
}
