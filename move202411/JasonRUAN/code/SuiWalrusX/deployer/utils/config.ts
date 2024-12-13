import { readFileSync } from "fs";
import { Network } from "./sui_utils";

const parseConfigurationFile = (fileName: string) => {
  try {
    return JSON.parse(readFileSync(`${fileName}.json`, "utf8"));
  } catch (e) {
    throw new Error(`Missing config file ${fileName}.json`);
  }
};

export const CONFIG = {
  NETWORK: (process.env.NETWORK as Network) || "testnet",
  SUI_WALRUSX_CONTRACT: parseConfigurationFile("sui-walrusx-contract"),
  PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
  AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
};