import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

type Network = "mainnet" | "testnet"

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

export const variables = {
    package:"0xfdf8ab10d6af4af4a1b9147bb21ee6cd01c8645486df9ce072160c70c972db5c",
    shared:"0xff1351cb9fc674b8e8fa7f16df6a4fb0bb0ae7a45cef14ca47994e2a56c6ca38",
    admin_cap:"0x7327efa7b99c544c30eaa5f10a17638c35f7698c6f0d224a6801dc752118239c"
};

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: variables,
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: variables,
    },
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient };
