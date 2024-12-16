import { Transaction } from "@mysten/sui/transactions";
import { CONFIG } from "../utils/config";
import { ACTIVE_NETWORK, signAndExecute } from "../utils/sui_utils";

const addComment = async (
  xPassNFTObjectId: string,
  tweet_id: number,
  content: string,
  alias: string
) => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${CONFIG.SUI_WALRUSX_CONTRACT.packageId}::walrusx::add_comment`,
    arguments: [
      txb.object(xPassNFTObjectId),
      txb.object(CONFIG.SUI_WALRUSX_CONTRACT.walrusxSharedObjectId),
      txb.pure.u64(tweet_id),
      txb.pure.string(content),
      txb.object("0x6"),
    ],
  });

  const res = await signAndExecute(txb, ACTIVE_NETWORK, alias);

  console.log(JSON.stringify(res, null, 2));

  if (!res.objectChanges || res.objectChanges.length === 0)
    throw new Error("Something went wrong while adding comment.");

  console.log("Comment added successfully.");
};

const XPassNFT="0xd42295f8222d2dcd262de87a2aefdbea825a08f3a6e8f8d31c6f503f2a2f4aa0";

async function main() {

  await addComment(
    XPassNFT,
    0,
    "This is a js02 comment.",
    "js02"
  );
}

main();

// "digest": "DYgxDALorBYoqQFnjN1y5oFUkWo12YvLfdDvuVfKz2Fi"