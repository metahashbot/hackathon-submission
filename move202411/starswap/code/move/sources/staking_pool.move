#[allow(unused_field, duplicate_alias)]
module starswap::staking_pool {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    public struct StakingPool has key {
        id: UID,
        rewards_per_second: u64,
        last_update_time: u64,
        total_staked: u64
    }

    public struct StakerInfo has store {
        amount: u64,
        start_time: u64,
        rewards: u64
    }

     fun init(ctx: &mut TxContext) {
        transfer::transfer(StakingPool {
            id: object::new(ctx),
            rewards_per_second: 100000,
            last_update_time: tx_context::epoch_timestamp_ms(ctx),
            total_staked: 0
        }, tx_context::sender(ctx))
    }

    public entry fun stake(
        pool: &mut StakingPool,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        pool.total_staked = pool.total_staked + amount;
        transfer::public_transfer(payment, tx_context::sender(ctx));
    }
}
//0xd842bd9b39d2bb7af3ca968e7b2fb48cf8aa9bd72846ce2694dbe849189d701f

//sui client call --package 0xd842bd9b39d2bb7af3ca968e7b2fb48cf8aa9bd72846ce2694dbe849189d701f --module element_nft --function init --gas-budget 10000000 