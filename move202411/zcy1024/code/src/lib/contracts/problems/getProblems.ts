import {suiClient} from "@/config";
import {ProblemList} from "@/config/key";
import {problemType as singleProblem} from "@/store/modules/oj";

type dataType = {
    fields: {
        input: string,
        output: string
    }
}

type problemTypeWithData = {
    title: string,
    gas: string,
    detail: string,
    accepted: number,
    submitted: number,
    data: dataType[]
}

type problemType = {
    fields: {
        key: string,
        value: {
            fields: problemTypeWithData
        }
    }
}

type contentType =
    | {
    dataType: 'moveObject'
    fields: {
        list: {
            fields: {
                contents: problemType[]
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

function dealWithData(data: dataType[]) {
    const inputs: string[] = [];
    const outputs: string[] = [];
    data.forEach(data => {
        inputs.push(data.fields.input);
        outputs.push(data.fields.output);
    });
    return [inputs, outputs];
}

export default async function getProblems() {
    const res = await suiClient.getObject({id: ProblemList, options: {showContent: true}});
    const content = res.data!.content as contentType;
    const ret = new Map<string, singleProblem>();
    if (content.dataType === 'moveObject') {
        const problems = content.fields.list.fields.contents;
        problems.forEach(problem => {
            const [inputs, outputs] = dealWithData(problem.fields.value.fields.data);
            ret.set(problem.fields.key, {
                title: problem.fields.value.fields.title,
                gas: problem.fields.value.fields.gas,
                detail: problem.fields.value.fields.detail,
                accepted: problem.fields.value.fields.accepted,
                submitted: problem.fields.value.fields.submitted,
                inputs,
                outputs
            });
        });
    }
    return ret;
}