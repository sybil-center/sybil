function toUrlVCType(vcType: string): string {
  return vcType.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

export class HttpClient {
  private _providerEndpoint: URL | undefined;

  constructor(readonly frontEndpoint: URL) {}

  get popupEndpoint(): URL {
    return new URL("/popul", this.frontEndpoint);
  }

  async providerEndpoint(): Promise<URL> {
    if (!this._providerEndpoint) {
      const endpoint = new URL("/options.json", this.frontEndpoint);
      const options = await fetch(endpoint).then((r) => r.json());
      const providerField = options.provider;
      if (!providerField) throw new Error(`Can not find provider field at ${endpoint}`);
      this._providerEndpoint = new URL(providerField);
    }
    return this._providerEndpoint;
  }

  async payload<
    TResponse, // TODO It should be unknown
    // TParams extends Record<string, string> = any TODO It should be some kind of Record<string, string>
    TParams = any
  >(vcType: string, params?: TParams): Promise<TResponse> {
    const providerEndpoint = await this.providerEndpoint();
    // FIXME ts-essential Opaque
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/payload`, providerEndpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => endpoint.searchParams.set(key, String(value)));
    }
    return fetch(endpoint).then((r) => r.json());
  }

  async canIssue(vcType: string, sessionId: string): Promise<boolean> {
    const providerEndpoint = await this.providerEndpoint();
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/can-issue`, providerEndpoint);
    endpoint.searchParams.set("sessionId", sessionId);
    const response = await fetch(endpoint).then((r) => r.json());
    return Boolean(response.canIssue);
  }

  async issue<TResponse, TParams = any>(vcType: string, params: TParams): Promise<TResponse> {
    const providerEndpoint = await this.providerEndpoint();
    const endpoint = new URL(`/api/v1/vcs/${toUrlVCType(vcType)}/issue`, providerEndpoint);
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((r) => r.json());
  }
}
