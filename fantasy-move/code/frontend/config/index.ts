import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

type Network = "mainnet" | "testnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            package: "0x9fb75841fe96eb97b49e4bf6f11313e6caddafa0730d773913eb94877cd4e502",
            stack: "0x8b00b87007e151cd5ebc868d28d3d7f3a4eac1c929753a2620a55355107c2691",
            walrusPublish: "https://walrus-testnet-publisher.nodes.guru",
            walrusAggreator: "https://aggregator.walrus-testnet.walrus.space"
        },
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            package: "0xf671e77cd68eabb1922fc02f819e74119a826645656cb1da0cf53e5cf0afc1c9",
            stack: "0x964df793dafe1a583a49630f10113c275fe16eef5e0542b0c5ba92a8a79336bf",
            walrusPublish: "https://publisher.walrus-testnet.walrus.space",
            walrusAggreator: "https://aggregator.walrus-testnet.walrus.space"
        },
    }
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient };
