import { IClient } from "./clients/client.type.js";
import { TwitterAccountClient } from "./clients/twitter-account-client.js";
import { SignFn } from "./util/sign-fn.type.js";
import { ITwitterAccountOwnershipVC, TwitterOwnershipOptions } from "./providers/twitter-acc-ownership.provider.js";
import { DiscordAccOwnVC, DiscordOwnershipOptions } from "./providers/discord-acc-ownership.provider.js";
import { DiscordAccountClient } from "./clients/discord-account-client.js";
import { EthOwnershipOptions, IEthAccountOwnershipVC } from "./providers/eth-acc-ownership.provider.js";
import { EthAccountClient } from "./clients/eth-account-client.js";
import { GitHubOwnershipOptions, GitHubAccOwnershipVC } from "./providers/github-acc-ownership.provider.js";
import { GithubAccountClient } from "./clients/github-account-client.js";
import { HttpClient } from "./util/http-client.js";

export { ITwitterAccountOwnershipVC, DiscordAccOwnVC, IEthAccountOwnershipVC, GitHubAccOwnershipVC };

export type CredentialKinds = {
  "twitter-account": {
    kind: ITwitterAccountOwnershipVC,
    options: TwitterOwnershipOptions
  };
  "discord-account": {
    kind: DiscordAccOwnVC,
    options: DiscordOwnershipOptions
  };
  "ethereum-account": {
    kind: IEthAccountOwnershipVC,
    options: EthOwnershipOptions
  };
  "github-account": {
    kind: GitHubAccOwnershipVC,
    options: GitHubOwnershipOptions
  };
};

export type Clients = {
  [K in keyof CredentialKinds]: IClient<CredentialKinds[K]["kind"], CredentialKinds[K]["options"]>;
};

const DEFAULT_ENDPOINT = new URL("https://api.sybil.center");

export class Sybil {
  readonly clients: Clients;

  constructor(readonly issuerDomain: URL = DEFAULT_ENDPOINT) {
    const httpClient = new HttpClient(issuerDomain);
    this.clients = {
      "twitter-account": new TwitterAccountClient(httpClient) ,
      "discord-account": new DiscordAccountClient(httpClient),
      "ethereum-account": new EthAccountClient(httpClient),
      "github-account": new GithubAccountClient(httpClient),
    };
  }

  async credential<TName extends keyof CredentialKinds>(
    name: TName,
    signFn: SignFn,
    options?: CredentialKinds[TName]["options"]
  ): Promise<CredentialKinds[TName]["kind"]> {
    const client = this.clients[name];
    if (!client) throw new Error(`Provider ${name} not available`);
    return client.issueCredential(signFn, options);
  }
}
