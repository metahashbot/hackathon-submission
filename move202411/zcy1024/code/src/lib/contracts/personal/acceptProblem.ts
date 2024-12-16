'use server'

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {Transaction} from "@mysten/sui/transactions";
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {PackageID, PersonList, ProblemList, AdminList} from "@/config/key";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

export default async function acceptProblem(user: string, pid: string) {
    const rpcUrl = getFullnodeUrl(network);
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();
    const user_address = tx.pure.address(user);
    const list = tx.object(PersonList);
    const move_pid = tx.pure.u64(Number(pid));
    const problem_list = tx.object(ProblemList);
    const admin_list = tx.object(AdminList);
    tx.moveCall({
        package: PackageID,
        module: "personal",
        function: "accept_problem",
        arguments: [user_address, list, move_pid, problem_list, admin_list]
    });
    const keypair = Ed25519Keypair.fromSecretKey(process.env.PRIVATE_KEY!);
    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        requestType: 'WaitForLocalExecution',
        options: {
            showEffects: true,
        }
    });
    return result.effects!.status.status === "success";
}