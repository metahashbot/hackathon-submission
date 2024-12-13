#[allow(unused_use, duplicate_alias)]
module sui_rog::soul {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url::{Self, Url};
    use sui::balance::{Self, Balance};
    use std::string;
    use sui::transfer;

    public struct SOUL has drop {}
    
    public struct CoinPool has key {
        id: UID,
        value: balance::Balance<SOUL>,
        creater: address,
    }

    public struct AdminCap has key {
        id: UID,
    }

    fun init(otw: SOUL, ctx: &mut TxContext) {
        let (mut treasury_cap, metadata) = coin::create_currency<SOUL>(
            otw, 
            0, 
            b"SOUL", 
            b"Soul",
            b"Soul Forest Game Tokens", 
            option::some<Url>(url::new_unsafe_from_bytes(b"https://oss-of-ch1hiro.oss-cn-beijing.aliyuncs.com/imgs/202411241954102.png")),
            ctx
        );

        let mut coin_pool =  CoinPool {
            id: object::new(ctx),
            value: balance::zero<SOUL>(),
            creater: tx_context::sender(ctx),
        };


        let mint_coin = coin::mint(&mut treasury_cap, 10000000, ctx);
        balance::join(&mut coin_pool.value, coin::into_balance(mint_coin));

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));

        transfer::share_object(coin_pool);

    }

    // 从池子中取出低级任务的 token 奖励
    public fun withdraw_task_low_token(coin_pool: &mut CoinPool): Balance<SOUL> {
        balance::split<SOUL>(&mut coin_pool.value, 3)
    }

}