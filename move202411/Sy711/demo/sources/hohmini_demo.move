/*
/// Module: hohmini_demo
module hohmini_demo::hohmini_demo;
*/
module hohmini_demo::hohmini_demo;

use sui::table::{Self, Table};

public struct PointsRecord has key {
    id: UID,
    record: Table<address, u64>,
}

public struct AdminCap has key, store {
    id: UID,
}

fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCap { id: object::new(ctx) };
    transfer::public_transfer(admin_cap, ctx.sender());
}

public fun update_points(_admin_cap: &AdminCap, points_record: &mut PointsRecord, new_points: u64, player: address) {
    if (table::contains<address, u64>(&points_record.record, player)) {
        let points = table::borrow_mut<address, u64>(&mut points_record.record, player);
        *points = new_points;
    } else {
        table::add<address, u64>(&mut points_record.record, player, new_points);
    }
}