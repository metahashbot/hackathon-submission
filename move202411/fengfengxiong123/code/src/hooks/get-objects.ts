import suiClient from "~/lib/sui-client";

export async function getObjects(ids: Array<string>) {
  try {
    const params = {
      ids: ids,
      options: {
        showType: false,
        showOwner: false,
        showPreviousTransaction: false,
        showContent: true,
        showStorageRebate: false,
      },
    };

    const response = await suiClient.multiGetObjects(params);
    return response;
  } catch (error) {
    console.error("Error fetching dynamic fields:", error);
    throw error;
  }
}
