import { Transaction } from "@mysten/sui/transactions";
import { CONFIG } from "../utils/config";
import { ACTIVE_NETWORK, signAndExecute } from "../utils/sui_utils";

const followUser = async (
  walrusxSharedObjectId: string,
  user_to_follow: string,
  alias: string
) => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${CONFIG.SUI_WALRUSX_CONTRACT.packageId}::walrusx::follow_user`,
    arguments: [
      txb.object(walrusxSharedObjectId),
      txb.pure.address(user_to_follow),
    ],
  });

  const res = await signAndExecute(txb, ACTIVE_NETWORK, alias);

  console.log(JSON.stringify(res, null, 2));

  if (!res.objectChanges || res.objectChanges.length === 0)
    throw new Error("Something went wrong while following user.");

  console.log("User followed successfully.");
};

async function main() {

  // js02 follow js01
  await followUser(
    CONFIG.SUI_WALRUSX_CONTRACT.walrusxSharedObjectId,
    "0x1ef77133b6d5ab40b44593d83ac3e2811907dbbd4366449c74459f74884fc9b4",
    "js02"
  );
}

main();

// "digest": "F6qtvm8NgE85S9m9TjcPm2YFwo7nFH83KV257C1axXdt"