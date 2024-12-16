import { Transaction } from "@mysten/sui/transactions";
import { CONFIG } from "../utils/config";
import { ACTIVE_NETWORK, signAndExecute } from "../utils/sui_utils";

const likeTweet = async (
  tweet_id: number,
  alias: string
) => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${CONFIG.SUI_WALRUSX_CONTRACT.packageId}::walrusx::like_tweet`,
    arguments: [
      txb.object(CONFIG.SUI_WALRUSX_CONTRACT.walrusxSharedObjectId),
      txb.pure.u64(tweet_id),
    ],
  });

  const res = await signAndExecute(txb, ACTIVE_NETWORK, alias);

  console.log(JSON.stringify(res, null, 2));

  if (!res.objectChanges || res.objectChanges.length === 0)
    throw new Error("Something went wrong while like the tweet.");

  console.log("like tweet success");
};

async function main() {

  // js02 like js01's tweet
  await likeTweet(
    0,
    "js02"
  );
}

main();

// "digest": "F4vQmvT2r5twN6f6T8vYUv9DGdB9VVyboRPJLsaUbvHs"