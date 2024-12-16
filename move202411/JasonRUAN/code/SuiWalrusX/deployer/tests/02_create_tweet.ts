import { Transaction } from "@mysten/sui/transactions";
import { CONFIG } from "../utils/config";
import { ACTIVE_NETWORK, signAndExecute } from "../utils/sui_utils";
import { putDataFile } from "../utils/walrus_utils";

const createTweet = async (
  xPassNFTObjectId: string,
  content: string,
  media_blob_id: string,
  alias: string
) => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${CONFIG.SUI_WALRUSX_CONTRACT.packageId}::walrusx::create_tweet`,
    arguments: [
      txb.object(xPassNFTObjectId),
      txb.object(CONFIG.SUI_WALRUSX_CONTRACT.walrusxSharedObjectId),
      txb.pure.string(content),
      txb.pure.string(media_blob_id),
      txb.object("0x6"),
    ],
  });

  const res = await signAndExecute(txb, ACTIVE_NETWORK, alias);

  console.log(JSON.stringify(res, null, 2));

  if (!res.objectChanges || res.objectChanges.length === 0)
    throw new Error("Something went wrong while creating the tweet.");

  console.log("create the tweet success");
};

async function main() {

  const blobId = await putDataFile("./images/avatar.png");
  console.log("Blob ID:", blobId);

  const XPassNFT="0xd3d8c232765462df79b7aad6b105db5031ce13aa6046ac48b955861d5f6c8cee";

  await createTweet(
    XPassNFT,
    "123456",
    blobId,
    "js01"
  );
}

main();

// "digest": "GZ9cjuV1xFjmsxGcUszy17KpaQX85XNF2hgwUMdSz2ts"