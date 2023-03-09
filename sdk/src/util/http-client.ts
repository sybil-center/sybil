function toUrlVCType(vcType: string): string {
  return vcType.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

export class HttpClient {

  constructor(
    readonly issuerDomain: URL
  ) {}

  async payload<
    TResponse, // TODO It should be unknown
    // TParams extends Record<string, string> = any TODO It should be some kind of Record<string, string>
    TParams = any
  >(vcType: string, params?: TParams): Promise<TResponse> {
    // FIXME ts-essential Opaque
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/payload`, this.issuerDomain);
    if (params) {
      Object
        .entries(params)
        .forEach(([key, value]) => {
          if (value) endpoint.searchParams.set(key, String(value));
        });
    }
    return fetch(endpoint).then((r) => r.json());
  }

  async canIssue(vcType: string, sessionId: string): Promise<boolean> {
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/can-issue`, this.issuerDomain);
    endpoint.searchParams.set("sessionId", sessionId);
    const response = await fetch(endpoint).then((r) => r.json());
    return Boolean(response.canIssue);
  }

  async issue<TResponse, TParams = any>(vcType: string, params: TParams): Promise<TResponse> {
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/issue`, this.issuerDomain);
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then((r) => r.json());
  }
}
