import { Transaction } from "@mysten/sui/transactions";
import { CONFIG } from "../utils/config";
import { ACTIVE_NETWORK, signAndExecute } from "../utils/sui_utils";
import { putDataFile } from "../utils/walrus_utils";

const mintProfile = async (
  nickname: string,
  email: string,
  bio: string,
  image_blob_id: string,
  ipfs_nft_url: string,
  alias: string
) => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${CONFIG.SUI_WALRUSX_CONTRACT.packageId}::walrusx::mint_profile`,
    arguments: [
      txb.object(CONFIG.SUI_WALRUSX_CONTRACT.walrusxSharedObjectId),
      txb.pure.string(nickname),
      txb.pure.string(email),
      txb.pure.string(bio),
      txb.pure.string(image_blob_id),
      txb.pure.string(ipfs_nft_url),
      txb.object("0x6"),
    ],
  });

  const res = await signAndExecute(txb, ACTIVE_NETWORK, alias);
  console.log(JSON.stringify(res, null, 2));

  if (!res.objectChanges || res.objectChanges.length === 0)
    throw new Error("Something went wrong while creating profile.");

  console.log("mint profile success");
};

async function main() {

  const blobId = await putDataFile("./images/avatar.png");
  console.log("Blob ID:", blobId);

  await mintProfile(
    "js01",
    "js01@gmail.com",
    "js01 bio",
    blobId,
    "ipfs_nft_url demo",
    "js01"
  );
}

main();

// "digest": "52HQgY5raSEi5TWmXWhBjR4rRFijRQR2v1DfV81PmjoN"
// js01 XPassNFT: 0xd3d8c232765462df79b7aad6b105db5031ce13aa6046ac48b955861d5f6c8cee

// digest": "9Xy5DDqYr6bVizftmZNWHQ5SpLtiiokYwdqMxCsH7Ry6"
// js02 XPassNFT: 0xd42295f8222d2dcd262de87a2aefdbea825a08f3a6e8f8d31c6f503f2a2f4aa0