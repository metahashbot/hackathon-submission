import {suiClient} from "@/config";
import {ShareList} from "@/config/key";
import {shareType as singleShare} from "@/store/modules/oj";

type shareType = {
    fields: {
        key: string,
        value: {
            fields: singleShare
        }
    }
}

type contentType =
    | {
    dataType: 'moveObject'
    fields: {
        list: {
            fields: {
                contents: shareType[]
            }
        }
    }
}
    | {
    dataType: 'package',
    disassembled: {
        [key: string]: unknown;
    };
}

export default async function getShare() {
    const res = await suiClient.getObject({id: ShareList, options: {showContent: true}});
    const content = res.data!.content as contentType;
    const ret = new Map<string, singleShare>();
    if (content.dataType === 'moveObject') {
        const shares = content.fields.list.fields.contents;
        shares.forEach(share => {
            ret.set(share.fields.key, {
                pid: share.fields.value.fields.pid,
                sharer: share.fields.value.fields.sharer,
                share_time: share.fields.value.fields.share_time,
                content: share.fields.value.fields.content
            });
        });
    }
    return ret;
}