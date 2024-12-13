import { Transaction } from "@mysten/sui/transactions";

export const receive_task_low = async ({
    signAndExecute,  
    RoleObjectId,
    counterPackageId,
    onSuccess = () => { }, 
    onError = () => { },
}: {
    signAndExecute: any,
    RoleObjectId: any,
    counterPackageId: any,
    onSuccess?: (result: any) => void;
    onError?: (result: any) => void;
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "receive_task_low",
        arguments: [
            tx.pure.string("Kill the wolfs"),
            tx.pure.string("Kill 3 wolves"),
            tx.pure.u64(10),
            tx.pure.u64(3),
            tx.object(RoleObjectId),
        ],
    });

    // 签名执行交易
    await signAndExecute({
        transaction: tx,
    }, {
        onSuccess,
        onError,
    });
                                        
};