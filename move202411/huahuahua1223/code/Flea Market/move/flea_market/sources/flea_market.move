module flea_market::marketplace {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::String; 

    // 错误码常量
    const INVALID_PRICE: u64 = 1;
    const INSUFFICIENT_PAYMENT: u64 = 2;

    /// 商品结构体
    public struct Item has key, store {
        id: UID,
        name: String,
        price: u64,
        seller: address,
    }

    /// 市场管理结构体
    public struct Marketplace has key, store {
        id: UID,
        items: vector<Item>,
    }

    // 定义 AdminCap 对象，用于管理权限
    public struct AdminCap has key {
    id: UID
    }

    fun init(ctx: &mut TxContext) {
        let admin = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin, ctx.sender());
    }

    /// 初始化市场
    public fun initialize_market(ctx: &mut TxContext) {
        transfer::public_share_object(Marketplace {
            id: object::new(ctx),
            items: vector[]
        })
    }

    /// 上架商品
    public fun list_item(
        market: &mut Marketplace,
        name: String,
        price: u64, 
        seller: address,
        ctx: &mut TxContext
    ) {
        assert!(price > 0, INVALID_PRICE);
        let id = object::new(ctx);
        let item = Item {
            id,
            name,
            price,
            seller,
        };
        vector::push_back(&mut market.items, item);
    }

    /// 购买商品
    public fun buy_item(
        market: &mut Marketplace,
        index: u64,
        mut payment: Coin<SUI>,
        buyer: address,
        ctx: &mut TxContext
    ): Item {
        let item = vector::remove(&mut market.items, index);
        assert!(coin::value(&payment) >= item.price, INSUFFICIENT_PAYMENT);
        
        // 处理支付
        let seller_payment = coin::split(&mut payment, item.price, ctx);
        transfer::public_transfer(seller_payment, item.seller);
        
        // 如果有找零，返回给买家
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, buyer);
        } else {
            coin::destroy_zero(payment);
        };
        
        item
    }

    /// 下架商品
    public fun delist_item(market: &mut Marketplace, index: u64): Item {
        vector::remove(&mut market.items, index)
    }

    /// 查询市场中的所有商品
    public fun get_items(market: &Marketplace): &vector<Item> {
        &market.items
    }
}
