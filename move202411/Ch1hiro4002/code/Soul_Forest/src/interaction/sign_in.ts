import { Transaction } from "@mysten/sui/transactions";

export const sign_in = ({
    signAndExecute, 
    role, 
    coin_pool,
    counterPackageId,
}: {
    signAndExecute: any,
    role: any,
    coin_pool: any,
    counterPackageId: any,
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "sign_in",
        arguments: [
            tx.object(role),
            tx.object(coin_pool)
        ],
    });
    signAndExecute({
        transaction: tx,
    });                                  
};