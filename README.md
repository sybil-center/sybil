# SybilCenter SDK

In one line you can issue a Verifiable Credential proving that your user owns a social media account.
Supported are Twitter, Discord, and GitHub.

```typescript
import { Sybil, EthRequestSigner, type IEIP1193Provider } from "@sybil-center/sdk";

const sybil = new Sybil()

const injected = "ethereum" in window && (window.ethereum as IEIP1193Provider);
if (!injected) throw new Error(`No window.ethereum available`);
const signer new EthRequestSigner(injected);

const credential = await sybil.credential('twitter-account', signer.sign) // This returns a Verifiable Credential
```

## Install

```shell
npm install @sybil-center/sdk # Feel free to use pnpm or yarn
```

## Supported credentials

Supported designators for `sybil.credential` call:

- `twitter-account`, available fields:
  - `id: string` - permanent unique Twitter account identifier
  - `username: string` - current Twitter account username
- `github-account`, available fields:
  - `id: number` - permanent unique GitHub account identifier
  - `username: string` - current GitHub account username aka `login`
- `discord-account`, available fields:
  - `id: string` - permanent unique Discord account identifier
  - `username: string` - the user's username, not unique across the Discord platform
  - `discriminator: string` - the user's 4-digit discord-tag

If you call `sybil.credential` method with any of the credential designators, type of a resulting credential is provided for you by TypeScript. To get, for example, Twitter username from `credential` as in excerpt above, you would use `credential.credentialSubject.twitter.username`.

# Demo App

The repository also contains demo React/Next.js application, showing how to use the SDK in your application.

Please, consult [demo-app README](./demo-app/README.md) about how to run a demo locally, and where to look for an example of code in React.
