import JSZip from "jszip";
import {getBlobIdAfterPublish} from "@/utils"
import type {
    UseMutateAsyncFunction,
    SuiSignAndExecuteTransactionOutput,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs
} from "@/lib/contracts/types";
import {Transaction} from "@mysten/sui/transactions";
import {
    ProblemList,
    AdminList,
    MoveCallAddProblem
} from "@/config/key"
import {network} from "@/config"

type Props = {
    account: string,
    title: string,
    gas: string,
    problemMd: File,
    dataZip: File,
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiSignAndExecuteTransactionOutput, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>
}

export default async function AddQuestion({account, title, gas, problemMd, dataZip, signAndExecuteTransaction}: Props) {
    console.log("publishing to walrus...");
    const problemBlobId = await getBlobIdAfterPublish(account, await problemMd.text());
    console.log(`Problem: ${problemBlobId}`);

    const inputBlobIds: string[] = [];
    const outputBlobIds: string[] = [];
    const zip = new JSZip();
    const res = await zip.loadAsync(dataZip);
    let idx = 1;
    while (res.files[idx.toString() + ".in"] && res.files[idx.toString() + ".out"]) {
        const inputStr = await res.files[idx.toString() + ".in"].async('string');
        inputBlobIds.push(await getBlobIdAfterPublish(account, inputStr));
        console.log(`${idx}.in: ${inputBlobIds.at(-1)}`);

        const outputStr = await res.files[idx.toString() + ".out"].async('string');
        outputBlobIds.push(await getBlobIdAfterPublish(account, outputStr));
        console.log(`${idx}.out: ${outputBlobIds.at(-1)}`);

        idx += 1;
    }

    console.log("signAndExecuteTransaction...");
    await add_problem({
        title,
        gas: Number(gas),
        detail: problemBlobId,
        inputs: inputBlobIds,
        outputs: outputBlobIds,
        signAndExecuteTransaction
    });
}

type TransactionType = {
    title: string,
    gas: number,
    detail: string,
    inputs: string[],
    outputs: string[],
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiSignAndExecuteTransactionOutput, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>
}

async function add_problem({title, gas, detail, inputs, outputs, signAndExecuteTransaction}: TransactionType) {
    const tx = new Transaction();
    const problem_list = tx.object(ProblemList);
    const move_title = tx.pure.string(title);
    const move_gas = tx.pure.u64(gas);
    const move_detail = tx.pure.string(detail);
    const move_inputs = tx.pure.vector("string", inputs);
    const move_outputs = tx.pure.vector("string", outputs);
    const admin_list = tx.object(AdminList);
    const params = [problem_list, move_title, move_gas, move_detail, move_inputs, move_outputs, admin_list];
    tx.moveCall({
        target: MoveCallAddProblem,
        arguments: params
    });
    const res = await signAndExecuteTransaction({
        transaction: tx,
        chain: `sui:${network}`
    });
    console.log(res);
}