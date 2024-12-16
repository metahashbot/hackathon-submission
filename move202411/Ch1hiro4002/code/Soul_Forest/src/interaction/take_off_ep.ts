import { Transaction } from "@mysten/sui/transactions";

export const take_off_ep = ({
    signAndExecute, 
    role, 
    recipient,
    counterPackageId,
}: {
    signAndExecute: any,
    role: any,
    recipient: any,
    counterPackageId: any,
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "take_off_ep",
        arguments: [
            tx.object(role),
            tx.pure.address(recipient)
        ],
    });
    signAndExecute({
        transaction: tx,
    });                                  
};