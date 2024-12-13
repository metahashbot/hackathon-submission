import { suiClient } from "@/config";
import { bcs } from "@mysten/sui/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiObjectId } from "@mysten/sui/utils";



type NetworkVariables = {
    package: string;
    stack: string;
    walrusPublish: string;
    walrusAggreator: string;
}

export type Library = {
    id: {id: string};
    name: string;
    b36addr: string;
    owner: string;
    blobs: string[];
    members: string[];
}

export type BlobInfo = {
    id: {id: string};
    owner: string;
    blobId: string;
    title: string;
    rewordSuiAmount: number;
}

//public entry fun create_library(state: &mut State, name:String, ctx: &mut TxContext)
// export const createLibrary = async (networkVariables: NetworkVariables, name: string) => {
//     const tx = new Transaction();
//     tx.moveCall(
//         {
//             package: networkVariables.package,
//             module: "gallery",
//             function: "create_library",
//             arguments: [
//                 tx.object(networkVariables.stack),
//                 tx.pure(bcs.string().serialize(name).toBytes())
//             ]
//         }
//     )
//     return tx;
// }

export const createTitle = async (networkVariables: NetworkVariables,blobId: string, name: string) => {
    const tx = new Transaction();
    tx.moveCall(
        {
            package: networkVariables.package,
            module: "sui_stack_overflow",
            function: "regist_blob",
            arguments: [
                tx.object(networkVariables.stack),
                tx.pure(bcs.string().serialize(name).toBytes()),
                tx.pure(bcs.string().serialize(blobId).toBytes())
            ]
        }
    )
    return tx;
}

export const getTechTitles = async (address: string) => {
    // if(!isValidSuiObjectId(address)) throw new Error("Invalid address");
    const stackOverflow = await suiClient.getObject({
        id: address,
        options: {
            showContent: true
        }
    })
    console.log(stackOverflow)
    const blobInfos = stackOverflow.data?.content as {
        dataType: string;
        fields?: {
            id: {id: string};
            blob_info_ids: string[];
        };
    };
    console.log(blobInfos)
    if(!blobInfos.fields?.blob_info_ids){
        return [];
    }
    const blobInfo_objects = await suiClient.multiGetObjects({
        ids: blobInfos.fields?.blob_info_ids,
        options: {
            showContent: true
        }
    });
    console.log(blobInfo_objects)
    const blobInfo_result: BlobInfo[] = blobInfo_objects.map((blobInfo) => {
        if (!blobInfo.data?.content) {
            throw new Error("Library content not found");
        }
        const blobInfo_detail = blobInfo.data.content as unknown as {
            dataType: string;
            fields: {
                id: {id: string};
                owner: string;
                blob_id: string;
                title: string;
                reword_sui_amount: number;
            }
        };
        return {
            id: blobInfo_detail.fields?.id,
            owner: blobInfo_detail.fields?.owner,
            blobId: blobInfo_detail.fields?.blob_id,
            title: blobInfo_detail.fields?.title,
            rewordSuiAmount: blobInfo_detail.fields?.reword_sui_amount
        }
    });

    console.log(blobInfo_result)
    return blobInfo_result;
}
