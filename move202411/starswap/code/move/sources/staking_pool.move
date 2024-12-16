module starswap::staking_pool {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct StakingPool has key {
        id: UID,
        rewards_per_second: u64,
        last_update_time: u64,
    }

    #[allow(unused_field)]
    public struct StakerInfo has store {
        amount: u64,
        start_time: u64,
        rewards: u64,
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(StakingPool {
            id: object::new(ctx),
            rewards_per_second: 100000, // 假设每秒奖励 100000
            last_update_time: tx_context::epoch_timestamp_ms(ctx),
        }, tx_context::sender(ctx))
    }
}