'use server'

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {Transaction, TransactionArgument} from "@mysten/sui/transactions";
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

function strToVec(str: string) {
    const ret: string[] = [];
    str.split(' ').forEach(item => {
        ret.push(item);
    });
    return ret;
}

function pure(tx: Transaction, opt: string, val: string) {
    if (opt === "u64") {
        return tx.pure.u64(val);
    }
    if (opt === "string") {
        return tx.pure.string(val);
    }
    if (opt === "u64_vector") {
        return tx.pure.vector("u64", strToVec(val).map(item => Number(item)));
    }
    if (opt === "string_vector") {
        return tx.pure.vector("string", strToVec(val));
    }
    return tx.pure.u64(val);
}

export default async function moveCall(lines: string[], packageID: string, gas: string) {
    const rpcUrl = getFullnodeUrl(network);
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();
    const keypair = Ed25519Keypair.fromSecretKey(process.env.PRIVATE_KEY!);
    tx.setGasBudget(Number(gas));
    const args: TransactionArgument[] = [];
    lines.forEach(line => {
        const argsLen = args.length;
        const split = line.split(' ');
        if (split.length < (argsLen === 0 ? 3 : 2)) {
            return;
        }
        const stIdx = argsLen === 0 ? 1 : 0;
        const opt = split[stIdx];
        const preLen = opt.length + 1 + (stIdx === 1 ? split[0].length + 1 : 0);
        const val = line.slice(preLen);
        args.push(pure(tx, opt, val));
    });
    tx.moveCall({
        package: packageID,
        module: "main",
        function: "main",
        arguments: args
    });
    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        requestType: 'WaitForLocalExecution',
        options: {
            showEffects: true,
            showEvents: true,
            showObjectChanges: true
        }
    });
    const eventOutput = JSON.stringify(result.events?.find(event => event.type === `${packageID}::main::MainEvent`)?.parsedJson);
    const createOutput = JSON.stringify(result.objectChanges?.find(object => object.type === "created" && object.objectType === `${packageID}::main::Main`));
    return [eventOutput, createOutput];
}