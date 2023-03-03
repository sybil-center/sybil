import { IClient } from "./clients/client.type.js";
import { TwitterClient } from "./clients/twitter.client.js";
import { SignFn } from "./util/sign-fn.type.js";
import { ITwitterAccountOwnershipVC } from "./providers/twitter-acc-ownership.provider.js";
import { DiscordAccOwnVC } from "./providers/discord-acc-ownership.provider.js";
import { DiscordClient } from "./clients/discord.client.js";
import { IEthAccountOwnershipVC } from "./providers/eth-acc-ownership.provider.js";
import { EthClient } from "./clients/eth.client.js";
import { GitHubAccOwnershipVC } from "./providers/github-acc-ownership.provider.js";
import { GithubClient } from "./clients/github.client.js";
import { HttpClient } from "./util/http-client.js";

export { ITwitterAccountOwnershipVC, DiscordAccOwnVC, IEthAccountOwnershipVC, GitHubAccOwnershipVC };

export type CredentialKinds = {
  "twitter-account": ITwitterAccountOwnershipVC;
  "discord-account": DiscordAccOwnVC;
  "ethereum-account": IEthAccountOwnershipVC;
  "github-account": GitHubAccOwnershipVC;
};

export type Clients = {
  [K in keyof CredentialKinds]: IClient<CredentialKinds[K]>;
};

const DEFAULT_ENDPOINT = new URL("https://app.sybil.center");

export class Sybil {
  readonly clients: Clients;

  constructor(frontEndpoint: URL = DEFAULT_ENDPOINT) {
    const httpClient = new HttpClient(frontEndpoint);
    this.clients = {
      "twitter-account": new TwitterClient(httpClient),
      "discord-account": new DiscordClient(httpClient),
      "ethereum-account": new EthClient(httpClient),
      "github-account": new GithubClient(httpClient),
    };
  }

  async credential<TName extends keyof CredentialKinds>(name: TName, signFn: SignFn): Promise<CredentialKinds[TName]> {
    const client = this.clients[name];
    if (!client) throw new Error(`Provider ${name} not available`);
    return client.issueCredential(signFn);
  }
}
