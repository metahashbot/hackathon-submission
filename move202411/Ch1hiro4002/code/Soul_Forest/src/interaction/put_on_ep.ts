import { Transaction } from "@mysten/sui/transactions";

export const put_on_ep = ({
    signAndExecute, 
    role, 
    sword,
    counterPackageId,
}: {
    signAndExecute: any,
    role: any,
    sword: any,
    counterPackageId: any,
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "put_on_ep",
        arguments: [
            tx.object(role),
            tx.object(sword)
        ],
    });
    signAndExecute({
        transaction: tx,
    });                                  
};