import { isValidSuiAddress } from "@mysten/sui/utils";
import { suiClient } from "@/config";
import { SuiObjectResponse } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";
import { variables } from "@/config";

export const getUserProfile = async (address: string): Promise<CategorizedObjects> => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Sui address");
  }

  let hasNextPage = true;
  let nextCursor: string | null = null;
  let allObjects: SuiObjectResponse[] = [];

  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      cursor: nextCursor,
    });

    allObjects = allObjects.concat(response.data);
    hasNextPage = response.hasNextPage;
    nextCursor = response.nextCursor ?? null;
  }

  return categorizeSuiObjects(allObjects);
};

export const getUsersRank = async () => {
  const rawdata = await suiClient.getObject({
    id: variables.shared,
    options: {
      showContent: true,
    },
  });

  const parent = rawdata.data?.content as unknown as {
    fields: {
      id: { id: string },
      record: {
        fields: {
          id: { id: string },
        }
      }
    },
  };

  const data = await suiClient.getDynamicFields({
    parentId: parent.fields.record.fields.id.id,
    limit: 5,
  });
  const rankObject = data.data.map((item) => {
    const itemData = item as unknown as {
      objectId: string,
    };
    return itemData.objectId;
  });
  
  const rankData = await suiClient.multiGetObjects({
    ids: rankObject,
    options: {
      showContent: true,
    },
  });
  const result: RankData[] = rankData.map((item) => {
    const itemData = item as unknown as {
      data:{
        content:{
          fields:{
            name:string,
            value:number,
          }
        }
      }
    };
    return {
      id: itemData.data.content.fields.name,
      value: itemData.data.content.fields.value,
    };
  });
  console.log(result);
  return result;
}

export type RankData = {
  id: string,
  value: number,
}
