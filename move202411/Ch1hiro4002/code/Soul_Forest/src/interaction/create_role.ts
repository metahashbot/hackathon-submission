import { Transaction } from "@mysten/sui/transactions";

export const create_role = ({
    signAndExecute, 
    name,
    profession, 
    description, 
    creater,
    counterPackageId,
}: {
    signAndExecute: any,
    name: string,
    profession: string,
    description: string,
    creater: any,
    counterPackageId: any,
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "create_role",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(profession),
            tx.pure.string(description),
            tx.pure.address(creater),
        ],
    });
    signAndExecute({
        transaction: tx,
        
    });                                   
};