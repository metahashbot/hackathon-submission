import { Transaction } from "@mysten/sui/transactions";

export const attack_monster = ({
    signAndExecute, 
    monster_low,
    role, 
    counterPackageId,
    onSuccess = () => { }, 
    onError = () => { },
}: {
    signAndExecute: any,
    monster_low: any,
    role: any,
    counterPackageId: any,
    onSuccess?: (result: any) => void;
    onError?: (result: any) => void;
}) => {
    const tx = new Transaction();
    tx.moveCall ({
        package: counterPackageId,
        module: "role",
        function: "attack_monster",
        arguments: [
            tx.object(monster_low),
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