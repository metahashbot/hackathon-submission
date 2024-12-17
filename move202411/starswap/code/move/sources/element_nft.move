#[allow(unused_field, unused_variable, duplicate_alias)]
module starswap::element_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::sui::SUI;
    use std::vector;

    public struct ElementType has copy, drop, store {
        multiplier: u64,
        unlock_reduction: u64,
        governance_weight: u64
    }

    public struct ElementNFT has key, store {
        id: UID,
        element: ElementType,
        stake_amount: u64,
        last_claim_time: u64,
        lock_period: u64
    }

    public struct StakePool has key {
        id: UID,
        element_types: vector<ElementType>
    }

      fun init(ctx: &mut TxContext) {
        let stake_pool = StakePool {
            id: object::new(ctx),
            element_types: vector[
                ElementType { multiplier: 100, unlock_reduction: 10, governance_weight: 1 },  // Fire
                ElementType { multiplier: 80, unlock_reduction: 20, governance_weight: 2 },   // Water  
                ElementType { multiplier: 60, unlock_reduction: 30, governance_weight: 3 },   // Earth
                ElementType { multiplier: 40, unlock_reduction: 40, governance_weight: 4 }    // Air
            ]
        };
        transfer::share_object(stake_pool);
    }

    public fun mint_element_nft(
        element_type: u8,
        amount: u64,
        lock_period: u64,
        pool: &StakePool,
        ctx: &mut TxContext
    ): ElementNFT {
        assert!(element_type <= 3, 0);
        let element = *vector::borrow(&pool.element_types, (element_type as u64));
        
        ElementNFT {
            id: object::new(ctx),
            element,
            stake_amount: 0,
            last_claim_time: 0,
            lock_period
        }
    }

    public entry fun mint_and_stake(
        element_type: u8,
        lock_period: u64,
        payment: Coin<SUI>,
        pool: &StakePool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        
        let mut nft = mint_element_nft(
            element_type,
            amount,
            lock_period,
            pool,
            ctx
        );
        
        stake_sui(&mut nft, payment, clock, pool, ctx);
        
        transfer::transfer(nft, tx_context::sender(ctx));
    }

    public entry fun stake_sui(
        nft: &mut ElementNFT,
        payment: Coin<SUI>,
        clock: &Clock,
        _pool: &StakePool,
        ctx: &mut TxContext
    ) {
        assert!(nft.stake_amount == 0, 0);
        
        let amount = coin::value(&payment);
        transfer::public_transfer(payment, tx_context::sender(ctx));
        
        nft.stake_amount = amount;
        nft.last_claim_time = clock::timestamp_ms(clock);
    }

    #[allow(unused_function)]
    public fun calculate_rewards(nft: &ElementNFT, pool: &StakePool, clock: &Clock): u64 {
        let current_time = clock::timestamp_ms(clock);
        let time_elapsed = current_time - nft.last_claim_time;
        let reward_per_period = 100000000;
        let periods_elapsed = time_elapsed / 1000;
        let element_type = *vector::borrow(&pool.element_types, 0 as u64);
        periods_elapsed * reward_per_period * element_type.multiplier / 100
    }
}