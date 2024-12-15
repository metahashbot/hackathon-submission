
/// constant for the entire  module
module sui_stack_overflow::constants;
/// fee base of percentage
public fun get_fee_base_of_percentage(): u64 { 100000 }
/// 10% default dao fee
public fun get_default_fee(): (u64) { (1000)}
/// WAL币的水龙头 0.1WAL
public fun get_wal_faucet_amount():(u64){100000000}

/// WAL币的水龙头时间间隔 8小时
public fun get_wal_faucet_gap():(u64){28_800_000}
