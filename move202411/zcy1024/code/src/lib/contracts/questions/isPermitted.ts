import {suiClient} from "@/config";
import {AdminList} from "@/config/key";

type contentType =
    | {
    dataType: 'moveObject'
    fields: {
        list: {
            fields: {
                contents: string[]
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

export default async function isPermitted(user: string) {
    const res = await suiClient.getObject({id: AdminList, options: {showContent: true}});
    const content = res.data!.content as contentType;
    if (content.dataType === 'moveObject') {
        return content.fields.list.fields.contents.find(address => address === user) !== undefined;
    }
    return false;
}