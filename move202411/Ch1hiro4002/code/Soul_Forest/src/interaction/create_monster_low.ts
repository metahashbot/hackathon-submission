import { Transaction } from "@mysten/sui/transactions";

export const create_monster_low = async ({
    signAndExecute, 
    counterPackageId,
    creater,
}: {
    signAndExecute: any,
    counterPackageId: any,
    creater: any,
}) => {
    const tx = new Transaction();
    
    // 使用 tx.moveCall 并捕获返回值
    tx.moveCall({
        package: counterPackageId,
        module: "role",
        function: "create_monster_low",
        arguments: [
            tx.object("0x8"),
            tx.pure.address(creater),
        ],
    });

    // 将返回的对象 ID 作为结果
    const result = await signAndExecute({
        transaction: tx,
    });

    // 从结果中提取新创建的怪物 ID
    const monsterObjectId = result?.effects?.created?.[0]?.reference?.objectId;

    return monsterObjectId;
};