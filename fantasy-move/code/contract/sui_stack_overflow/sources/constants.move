
/// constant for the entire  module
module sui_stack_overflow::constants;
/// fee base of percentage
public fun get_fee_base_of_percentage(): u64 { 100000 }
/// 10% default dao fee
public fun get_default_fee(): (u64) { (1000)}