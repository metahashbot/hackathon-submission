import { SuiClient } from "@mysten/sui/client";

const suiClientSingleton = () => {
  return new SuiClient({ url: "https://fullnode.testnet.sui.io" });
};

declare const globalThis: {
  suiClientGlobal: ReturnType<typeof suiClientSingleton>;
} & typeof global;

const suiClient = globalThis.suiClientGlobal ?? suiClientSingleton();

export default suiClient;

if (process.env.NODE_ENV !== "production")
  globalThis.suiClientGlobal = suiClient;
