
/*update_points(_admin_cap: &AdminCap, points_record: &mut PointsRecord, new_points: u64, player: address)*/

import { variables } from "@/config";
import { Transaction } from "@mysten/sui/transactions";

export const update_points = (points:number, address:string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: variables.package,
        module: "hohmini_demo",
        function: "update_points",
        arguments: [
            tx.object(variables.admin_cap),
            tx.object(variables.shared),
            tx.pure.u64(points),
            tx.pure.address(address)
        ]
    });
    return tx;
}
