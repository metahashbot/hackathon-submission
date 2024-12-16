'use server'

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import {Transaction} from "@mysten/sui/transactions";
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {PackageID, AdminList, ShareList} from "@/config/key";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

export default async function deleteByID(sid: string) {
    const rpcUrl = getFullnodeUrl(network);
    const client = new SuiClient({ url: rpcUrl });
    const tx = new Transaction();
    tx.moveCall({
        package: PackageID,
        module: "share",
        function: "delete_by_admin",
        arguments: [
            tx.object(ShareList),
            tx.pure.u64(Number(sid)),
            tx.object(AdminList)
        ]
    });
    const keypair = Ed25519Keypair.fromSecretKey(process.env.PRIVATE_KEY!);
    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        requestType: 'WaitForLocalExecution',
        options: {
            showEffects: true
        }
    });
    return result.effects!.status.status === "success";
}