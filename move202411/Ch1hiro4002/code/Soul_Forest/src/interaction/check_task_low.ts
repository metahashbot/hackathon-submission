import { Transaction } from "@mysten/sui/transactions";

export const check_task_low = ({
    signAndExecute, 
    role, 
    counterPackageId,
    onSuccess = () => { }, 
    onError = () => { },
}: {
    signAndExecute: any,
    role: any,
    counterPackageId: any,
    onSuccess?: (result: any) => void;
    onError?: (result: any) => void;
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "check_task_low",
        arguments: [
            tx.object(role),
        ],
    });
    signAndExecute({
        transaction: tx, 
    }, {
        onSuccess,
        onError,
    });                                 
};