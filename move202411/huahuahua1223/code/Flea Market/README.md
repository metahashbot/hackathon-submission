# Starting your dApp

## move
```bash
sui client envs

sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

sui client switch --env testnet

sui client addresses

sui client gas

sui client publish --skip-dependency-verification
```

In the output there will be an object with a `"packageId"` property. You'll want
to save that package ID to the `src/constants.ts` file as `PACKAGE_ID`:

```ts
export const TESTNET_COUNTER_PACKAGE_ID = "<YOUR_PACKAGE_ID>";
```

## react
To install dependencies you can run

```bash
pnpm install
```

To start your dApp in development mode run

```bash
pnpm dev
```