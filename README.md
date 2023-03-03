# SybilCenter SDK

This is a monorepo for SybilCenter SDK. In one line you can issue a Verifiable Credential proving that your user owns a social media account. Supported are Twitter, Discord, and GitHub.

The repository includes SDK as well as a Next.js application, showing how to use the SDK in your application.

We require that in your application, an Etehreum provider conforming to [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) is available, like MetaMask, or Tokenary. The provider is used to confirm that a subject of a credential, i.e. an entity we issue the credential about, is genuine.

Let's assume that the provider (`window.ethereum` for MetaMask, for example) is available, and the user allowed your application to access it (`window.ethereum.enable()` for MetaMask). Then in the application code you add the following lines, for example to prove your user have a Twitter account:

```typescript
import { Sybil, EthRequestSigner, type IEIP1193Provider } from "@sybil-center/sdk";

const sybil = new Sybil()

const injected = "ethereum" in window && (window.ethereum as IEIP1193Provider);
if (!injected) throw new Error(`No window.ethereum available`);
const signer new EthRequestSigner(injected);

const credential = await sybil.credential('twitter-account', signer.sign) // This returns a Verifiable Credential
```

Please, consult [the SDK readme](./sdk/README.md) for more technical information, and [demo-app README](./demo-app/README.md) about how to run a demo locally, and where to look for an example of code in React.

## How to use the repository

If you intend to use the repository we require [`pnpm` package manager](http://pnpm.io).

The following commands would install all the necessary dependencies and build JS code:

```
pnpm install
pnpm run build
```

If you would like to see the demo on your machine, switch to `demo-app` folder, and start the application:
```
cd demo-app
pnpm run dev
```

Then open [`http://localhost:3000`](http://localhost:3000) in a browser with an Ethereum wallet set up.
