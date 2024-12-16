import {personalType} from "@/store/modules/oj";
import {suiClient} from "@/config";
import {PersonList} from "@/config/key";

type dataType = {
    fields: {
        key: string,
        value: {
            fields: personalType
        }
    }
}

type contentType =
    | {
    dataType: 'moveObject'
    fields: {
        list: {
            fields: {
                contents: dataType[]
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

export default async function getPersonalInfo(user: string): Promise<personalType> {
    const res = await suiClient.getObject({id: PersonList, options: {showContent: true}});
    const content = res.data!.content as contentType;
    if (content.dataType === 'moveObject') {
        const dataArray = content.fields.list.fields.contents;
        const target = dataArray.find(data => data.fields.key === user);
        if (target) {
            return target.fields.value.fields;
        }
    }
    return {
        accepted: [],
        share: []
    }
}