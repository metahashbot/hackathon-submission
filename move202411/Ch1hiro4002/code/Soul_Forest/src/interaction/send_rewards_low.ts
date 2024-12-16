import { Transaction } from "@mysten/sui/transactions";

export const send_rewards_low = ({
    signAndExecute, 
    role, 
    coin_pool,
    counterPackageId,
    onSuccess = () => { }, 
    onError = () => { },
}: {
    signAndExecute: any,
    role: any,
    coin_pool: any,
    counterPackageId: any,
    onSuccess?: (result: any) => void;
    onError?: (result: any) => void;
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "send_rewards_low",
        arguments: [
            tx.object(role),
            tx.object(coin_pool),
        ],
    });
    signAndExecute({
        transaction: tx, 
    }, {
        onSuccess,
        onError,
    });                                 
};