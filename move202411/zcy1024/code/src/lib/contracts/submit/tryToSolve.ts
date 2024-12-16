'use server'

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {Transaction} from "@mysten/sui/transactions";
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {PackageID, ProblemList, AdminList} from "@/config/key";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

export default async function tryToSolve(pid: string) {
    const rpcUrl = getFullnodeUrl(network);
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();
    const keypair = Ed25519Keypair.fromSecretKey(process.env.PRIVATE_KEY!);
    tx.moveCall({
        package: PackageID,
        module: "problem",
        function: "try_to_solve",
        arguments: [tx.pure.u64(Number(pid)), tx.object(ProblemList), tx.object(AdminList)]
    });
    await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        requestType: 'WaitForLocalExecution'
    });
}