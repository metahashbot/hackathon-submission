#[test_only]
module flea_market::marketplace_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use flea_market::marketplace::{Self, Marketplace, Item};

    // 测试常量
    const SELLER: address = @0xA;
    const BUYER: address = @0xB;
    const ITEM_PRICE: u64 = 1000;
    const PAYMENT_AMOUNT: u64 = 2000;

    fun test_scenario(): Scenario {
        // 返回可变的 Scenario
        let mut scenario = ts::begin(SELLER);
        scenario
    }

    #[test]
fun test_list_item() {
    let mut scenario = test_scenario();
    
    // 使用共享的市场对象，之前的 init 已经初始化过市场
    ts::next_tx(&mut scenario, SELLER);
    {
        // 获取市场对象
        let mut market = ts::take_from_sender<Marketplace>(&scenario);
        let ctx = ts::ctx(&mut scenario);
        
        // 上架商品
        marketplace::list_item(
            &mut market,
            b"Test Item",
            ITEM_PRICE,
            SELLER,
            ctx
        );
        
        assert!(vector::length(marketplace::get_items(&market)) == 1, 0);
        ts::return_to_sender(&scenario, market);
    };
    
    ts::end(scenario);
}

    #[test]
    fun test_initialize_market() {
        let mut scenario = test_scenario();
        let ctx = ts::ctx(&mut scenario);
        
        // 初始化市场
        let mut market = marketplace::initialize_market(ctx);
        assert!(vector::length(marketplace::get_items(&market)) == 0, 0);
        
        // 清理
        transfer::public_transfer(market, SELLER);
        ts::end(scenario);
    }

    // #[test]
    // fun test_list_item() {
    //     let mut scenario = test_scenario();
        
    //     // 初始化市场
    //     ts::next_tx(&mut scenario, SELLER);
    //     {
    //         let ctx = ts::ctx(&mut scenario);
    //         let mut market = marketplace::initialize_market(ctx);
    //         transfer::public_transfer(market, SELLER);
    //     };

    //     // 上架商品
    //     ts::next_tx(&mut scenario, SELLER);
    //     {
    //         let mut market = ts::take_from_sender<Marketplace>(&scenario);
    //         let ctx = ts::ctx(&mut scenario);
            
    //         marketplace::list_item(
    //             &mut market,
    //             b"Test Item",
    //             ITEM_PRICE,
    //             SELLER,
    //             ctx
    //         );
            
    //         assert!(vector::length(marketplace::get_items(&market)) == 1, 0);
    //         ts::return_to_sender(&scenario, market);
    //     };
        
    //     ts::end(scenario);
    // }

    #[test]
    fun test_buy_item() {
        let mut scenario = test_scenario();
        
        // 初始化市场并上架商品
        ts::next_tx(&mut scenario, SELLER);
        {
            let ctx = ts::ctx(&mut scenario);
            let mut market = marketplace::initialize_market(ctx);
            marketplace::list_item(
                &mut market,
                b"Test Item",
                ITEM_PRICE,
                SELLER,
                ctx
            );
            transfer::public_transfer(market, SELLER);
        };

        // 买家购买商品
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut market = ts::take_from_address<Marketplace>(&scenario, SELLER);
            let ctx = ts::ctx(&mut scenario);
            
            // 创建支付代币
            let payment = coin::mint_for_testing<SUI>(PAYMENT_AMOUNT, ctx);
            
            let item = marketplace::buy_item(
                &mut market,
                0, // 第一个商品
                payment,
                BUYER,
                ctx
            );
            
            // 验证购买后的状态
            assert!(vector::length(marketplace::get_items(&market)) == 0, 0);
            
            // 清理
            transfer::public_transfer(item, BUYER);
            ts::return_to_address(SELLER, market);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = marketplace::INVALID_PRICE)]
    fun test_list_item_invalid_price() {
        let mut scenario = test_scenario();
        let ctx = ts::ctx(&mut scenario);
        
        let mut market = marketplace::initialize_market(ctx);
        marketplace::list_item(
            &mut market,
            b"Test Item",
            0, // 无效价格
            SELLER,
            ctx
        );
        
        transfer::public_transfer(market, SELLER);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = marketplace::INSUFFICIENT_PAYMENT)]
fun test_buy_item_insufficient_payment() {
    let mut scenario = test_scenario();  // 声明为可变
    
    // 初始化市场并上架商品
    ts::next_tx(&mut scenario, SELLER);
    {
        let ctx = ts::ctx(&mut scenario);
        let mut market = marketplace::initialize_market(ctx);  // 声明为可变
        marketplace::list_item(
            &mut market,
            b"Test Item",
            ITEM_PRICE,
            SELLER,
            ctx
        );
        transfer::public_transfer(market, SELLER);
    };

    // 尝试用不足的金额购买
    ts::next_tx(&mut scenario, BUYER);
    {
        let mut market = ts::take_from_address<Marketplace>(&scenario, SELLER);  // 声明为可变
        let ctx = ts::ctx(&mut scenario);
        
        // 创建支付代币（金额小于商品价格）
        let payment = coin::mint_for_testing<SUI>(ITEM_PRICE - 100, ctx);
        
        let item = marketplace::buy_item(
            &mut market,
            0,
            payment,
            BUYER,
            ctx
        );
        
        transfer::public_transfer(item, BUYER);
        ts::return_to_address(SELLER, market);
    };
    
    ts::end(scenario);
}
}
