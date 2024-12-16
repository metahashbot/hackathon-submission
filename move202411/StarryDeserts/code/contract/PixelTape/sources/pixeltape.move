module pixeltape::pixeltape{
	use sui::url::{Self, Url};
    use std::string::{Self, String};
    use pixeltape::utils;
    use sui::display::{Self ,update_version};
    use sui::kiosk;
    use sui::random::{Self, Random};
    use sui::event;
    use kiosk::royalty_rule;
    use kiosk::kiosk_lock_rule;
    use kiosk::personal_kiosk_rule;
    use sui::table_vec::{Self, TableVec};
    use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap};
    use sui::vec_map::{Self, VecMap};

    
    const E_INVALID_WHITELIST: u64 = 1;
    const E_EMPTY_POOL: u64 = 2;
    const E_NOT_LIVE: u64 = 3;

    public struct PIXELTAPE has drop {}

    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        number: u64,
        url: Url,
        attributes: VecMap<String, String>,
        u64_padding: VecMap<String, u64>,
    }

    public struct ManagerCap has key, store { id: UID }

    public struct Royalty has key {
        id: UID,
        recipient: address,
        policy_cap: TransferPolicyCap<NFT>,
    }

    #[lint_allow(self_transfer, share_owned)]
    fun init(otw: PIXELTAPE, ctx: &mut TxContext) {
        // 发布者声明，一次性见证
        let publisher = sui::package::claim(otw, ctx);
        // 设置display的内容
        let mut display = display::new<NFT>(&publisher, ctx);
        display.add(string::utf8(b"name"), string::utf8(b"{name}"));
        display.add(string::utf8(b"description"), string::utf8(b"{description}"));
        display.add(string::utf8(b"image_url"), string::utf8(b"{url}"));
        display.add(string::utf8(b"attributes"), string::utf8(b"{attributes}"));
        update_version(&mut display);

        // 管理员权限创建,生成唯一id
        let manager_cap = ManagerCap{id: object::new(ctx)};

        //转移策略的设置(只有发布者可以设置转移策略)
        let (mut policy, policy_cap) = transfer_policy::new<NFT>(&publisher, ctx);
        // 添加版税规则
        royalty_rule::add(&mut policy, &policy_cap, 1_000, 1_000_000_000);
        // 添加 kiosk 锁定规则
        kiosk_lock_rule::add(&mut policy, &policy_cap);
        // 添加个人的 kiosk 规则
        personal_kiosk_rule::add(&mut policy, &policy_cap);

        //创建版税对象
        let royalty = Royalty{
            id: object::new(ctx),
            recipient: @ADMIN,
            policy_cap
        };

        /*对象转移
        发布者权限转移给发送者
        disaplay转移给发送者
        管理员权限转移给发送者
        共享转移策略对象
        共享版税对象
        */
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(publisher, sender);
        transfer::public_transfer(display, sender);
        transfer::public_transfer(manager_cap, sender);
        transfer::public_share_object(policy);
        transfer::share_object(royalty);
    }

    // 提取版税(只有具备管理员权限的人才能够调用此方法)
    entry fun withdraw_royalty(
        _manager_cap: &ManagerCap,
        royalty: &Royalty,
        policy: &mut TransferPolicy<NFT>,
        ctx: &mut TxContext
    ) {
        let brokerage = policy.withdraw(&royalty.policy_cap, option::none(), ctx);
        transfer::public_transfer(brokerage, royalty.recipient);
    }

    // NFT 池子的结构定义
    public struct NFT_Pool has key {
        id: UID,
        nfts: TableVec<NFT>, //存储NFT的容器
        num: u64, //NFT的数量
        is_live: bool, //池子的状态
    }

    // 创建一个新的 NFT 池子
    entry fun new_pool(
        _manager_cap: &ManagerCap,
        ctx: &mut TxContext
    ) {
        let nft_pool = NFT_Pool{
            id: object::new(ctx),
            nfts: table_vec::empty(ctx),
            num: 0,
            is_live: false,
        };
        transfer::share_object(nft_pool);
    }

    // 安全关闭一个 NFT 池子
    entry fun close_pool(
        _manager_cap: &ManagerCap,
        nft_pool: NFT_Pool,
    ) {
        let NFT_Pool {
            id,
            nfts,
            num:_,
            is_live:_,
        } = nft_pool;

        table_vec::destroy_empty(nfts);
        object::delete(id);
    }

    // 存入NFT
    entry fun deposit_nft(
        _manager_cap: &ManagerCap,
        nft_pool: &mut NFT_Pool,
        name: String,
        number: u64,
        url: vector<u8>,
        attribute_keys: vector<String>,
        attribute_values: vector<String>,
        ctx: &mut TxContext
    ) {
        //转换 URL 格式
        let url = url::new_unsafe_from_bytes(url);
        let attributes = utils::from_vec_to_map(attribute_keys, attribute_values);
        let nft = new_nft(name, number, url, attributes, ctx);

        //将 NFT 存入池中
        table_vec::push_back(&mut nft_pool.nfts, nft);
        nft_pool.num = nft_pool.num + 1;
    }

    // 创建 NFT
    fun new_nft(
        name: String,
        number: u64,
        url: Url,
        attributes: VecMap<String, String>,
        ctx: &mut TxContext
    ): NFT {
        let description = string::utf8(b"This is a test NFT");
        let nft = NFT {
            id: object::new(ctx),// 生成唯一ID
            name,
            number,
            description,// 设置固定的 NFT 描述
            url,
            attributes,
            u64_padding: vec_map::empty(), //创建空的u64类型补充属性映射
        };
        nft
    }

    // 定义白名单结构
    public struct Whitelist has key {
        id: UID,
        associated_id: ID
    }

    // 创建白名单(同时为多个地址发送白名单)
    entry fun create_whitelist(
        _manager_cap: &ManagerCap,
        nft_pool: &NFT_Pool,
        mut recipients: vector<address>,
        ctx: &mut TxContext
    ) {
        // 遍历接收者地址列表
        while (!vector::is_empty(&recipients)) {
            // 从接收者列表中弹出一个地址
            let recipient = vector::pop_back<address>(&mut recipients);
            // 为每个地址创建白名单对象
            let id = object::id(nft_pool);
            let whitelist = Whitelist {
                id: object::new(ctx),
                associated_id: id,
            };
            // 转移白名单对象给接收者
            transfer::transfer(whitelist, recipient);
        }
    }

    // 销售状态更新功能(可以关闭和开启销售状态，即开关池子)
    entry fun update_sale_status(
        _manager_cap: &ManagerCap,
        nft_pool: &mut NFT_Pool,
        is_live: bool,

    ) {
        nft_pool.is_live = is_live;
    }

    // NFT 批量发送功能
    #[lint_allow(share_owned)]
    entry fun send_nfts(
        _manager_cap: &ManagerCap,
        nft_pool: &mut NFT_Pool,
        policy: &TransferPolicy<NFT>,
        recipient: address,
        mut number: u64,
        ctx: &mut TxContext
    ) {
        // 创建新的kiosk和kiosk凭证
        let (mut kiosk, kiosk_cap) = kiosk::new(ctx);
        //循环处理指定数量的 NFT
        while (number > 0) {
            // 从池子中取出 NFT
            let nft = table_vec::pop_back(&mut nft_pool.nfts);
            // 发送Mint事件
            let mint_event = MintEvent{
                id: object::id(&nft),
                name: nft.name,
                description: nft.description,
                number: nft.number,
                url: nft.url,
                attributes: nft.attributes,
                sender: tx_context::sender(ctx),
            };
            event::emit(mint_event);
            // 将 NFT 锁定在kiosk中
            kiosk::lock(&mut kiosk, &kiosk_cap, policy, nft);
            // 变量 number - 1
            number = number - 1;
        };
        // 共享 Kiosk 对象
        transfer::public_share_object(kiosk);
        // 转移 Kiosk 凭证给接收者
        transfer::public_transfer(kiosk_cap, recipient);
    }

    //铸造事件结构体
    public struct MintEvent has copy, drop {
        id: ID,
        name: String,
        description: String,
        number: u64,
        url: Url,
        attributes: VecMap<String, String>,
        sender: address
    }

    // 图片 URL 更新的功能
    public fun update_url(
        _manager_cap: &ManagerCap,
        nft: &mut NFT,
        url: vector<u8>,
    ) {
        //单独更新 NFT 的图片 URL
        nft.url = url::new_unsafe_from_bytes(url);
    }

    //铸造 NFT 的方法
    fun mint(
        nft_pool: &mut NFT_Pool,
        whitelist_token: Whitelist,
        random: &Random,
        ctx : &mut TxContext
    ): NFT {
        // 验证池子是否处于活跃状态(即是否开放了销售)
        assert!(nft_pool.is_live, E_NOT_LIVE);

        // 检查池中是否有NFT
        let len = table_vec::length(&nft_pool.nfts);
        assert!(len > 0, E_EMPTY_POOL);

        // 白名单验证
        let Whitelist{id, associated_id} = whitelist_token;
        // 验证成功后，销毁白名单凭证
        object::delete(id);
        // 验证白名单是否对应当前的 NFT 池子
        assert!(associated_id == object::id(nft_pool), E_INVALID_WHITELIST);

        // 如果池中只有一个 NFT，则直接取出
        let nft = if (len == 1) {
            table_vec::pop_back(&mut nft_pool.nfts)
        } else {
            // 否则随机选择一个 NFT
            let mut genrator = random::new_generator(random, ctx);
            let i = random::generate_u64_in_range(&mut genrator, 0, len - 1);
            table_vec::swap(&mut nft_pool.nfts, i, len - 1);
            table_vec::pop_back(&mut nft_pool.nfts)
        };

        // 发出一个Mint事件
        let mint_event = MintEvent{
            id: object::id(&nft),
            name: nft.name,
            description: nft.description,
            number: nft.number,
            url: nft.url,
            attributes: nft.attributes,
            sender: tx_context::sender(ctx),
        };
        event::emit(mint_event);
        nft
    }

    // 给白名单用户一个可以免费铸造 NFT 的入口
    entry fun free_mint(
        nft_pool: &mut NFT_Pool,
        policy: &TransferPolicy<NFT>,
        whitelist_token: Whitelist,
        random: &Random,
        ctx: &mut TxContext,
    ) {
        let (mut kiosk, kiosk_cap) = kiosk::new(ctx);
        // 调用铸造 NFT 的方法
        let nft = mint(nft_pool, whitelist_token, random, ctx);
        kiosk::lock(&mut kiosk, &kiosk_cap, policy, nft);
        // 共享 Kiosk 对象
        transfer::public_share_object(kiosk);
        // 转移 Kiosk 凭证给接收者
        transfer::public_transfer(kiosk_cap, tx_context::sender(ctx));
    }

    //获取 NFT 的各种属性并展示在前端的公共方法
    public fun nft_number(nft: &NFT): u64 {
        nft.number
    }

    public fun nft_attributes(nft: &NFT): VecMap<String, String> {
        nft.attributes
    }
}



