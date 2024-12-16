import {getProblemByID} from "@/lib/contracts"
import {read} from "@/utils";
import moveCall from "@/lib/contracts/submit/moveCall";
import {suiClient} from "@/config";
import {Dispatch, SetStateAction} from "react";
import tryToSolve from "@/lib/contracts/submit/tryToSolve";

function getAnswer(output: string) {
    const words = output.split(' ');
    if (words.length < 4) {
        return ["", ""];
    }
    const outputType = words[1];
    let result = `{"${words[2]}":"`;
    let i = 3;
    while (i < words.length) {
        result = result.concat(words[i]).concat(i + 1 < words.length ? " " : "\"}");
        i = i + 1;
    }
    return [outputType, result];
}

type objectContentType = {
    fields: {
        [key: string]: unknown
    }
}

async function getResultFromObjectId(objectId: string) {
    const object = await suiClient.getObject({id: objectId, options: {showContent: true}});
    const content = object.data!.content as objectContentType;
    return JSON.stringify(content.fields);
}

type createOutputType = {
    objectId: string
}

async function checkAnswer(output: string, eventOutput: string, createOutput: string) {
    const [outputType, result] = getAnswer(await read({blobId: output}));
    if (outputType === "MainEvent") {
        return result === eventOutput;
    }
    if (outputType === "Main") {
        const parsedOutput = JSON.parse(createOutput) as createOutputType;
        const objectId = parsedOutput.objectId;
        const userResult = await getResultFromObjectId(objectId);
        return userResult === `{"id":{"id":"${objectId}"},${result.slice(1)}` || userResult === `${result.slice(0, result.length - 1)},"id":{"id":"${objectId}"}}`;
    }
    return false;
}

export default async function submit(pid: string, packageID: string, setTips: Dispatch<SetStateAction<string>>) {
    setTips("Checking problem...");
    const problem = await getProblemByID(pid);
    if (!problem) {
        return "Pid Error!";
    }
    await tryToSolve(pid);
    const inputs = problem.inputs;
    const outputs = problem.outputs;
    let i = 0;
    while (i < inputs.length) {
        setTips(`Running on Test #${i + 1}`);
        const input = inputs[i];
        const output = outputs[i];
        const inputText = await read({blobId: input});
        const lines = inputText.split('\n');
        try {
            const [eventOutput, createOutput] = await moveCall(lines, packageID, problem.gas);
            const isOK = await checkAnswer(output, eventOutput, createOutput);
            if (!isOK) {
                return `Error on Test #${i + 1}`
            }
        } catch (error) {
            console.log(error);
            return "Run Time Error"
        }
        i = i + 1;
    }
    return "Accepted";
}