import publish from "@/utils/walrus/publish";
import read from "@/utils/walrus/read";

type publishResponseType = {
    newlyCreated?: {
        blobObject: {
            blobId: string
        }
    },
    alreadyCertified?: {
        blobId: string
    }
}

function getBlobId(data: publishResponseType) {
    if (data.newlyCreated)
        return data.newlyCreated.blobObject.blobId;
    return data.alreadyCertified!.blobId;
}

function mergeStr(account: string, toBePublished: string) {
    const date = Date.now().toString();
    const math = Math.random().toString();
    return `${account}_${date}_${math}: ${toBePublished}`;
}

async function getBlobIdAfterPublish(account: string, toBePublished: string) {
    const res: publishResponseType = await publish({toBePublished: mergeStr(account, toBePublished)});
    return getBlobId(res);
}

export type {publishResponseType}

export {publish, read, getBlobId, getBlobIdAfterPublish}