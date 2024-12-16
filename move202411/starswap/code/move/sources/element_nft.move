module starswap::element_nft {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string;
    use sui::package;
    use sui::display;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};

    // 错误代码
    const EInsufficientBalance: u64 = 1;
    const ENotStaked: u64 = 2;
    const EUnstakeTooEarly: u64 = 3;
    const EInvalidElement: u64 = 4;

    public struct ElementNFT has key, store {
        id: UID,
        element: u8,
        stake_amount: u64,
        lock_period: u64,
        rewards: u64,
        multiplier: u64,
        unlock_reduction: u64,
        governance_weight: u64,
        staked: bool,
        start_time: u64,
    }

    public struct StakedNFT has key, store {
        id: UID,
        nft_id: ID,
        start_time: u64,
        multiplier: u64,
        unlock_reduction: u64,
        governance_weight: u64,
    }

    fun init(otw: package::OneTimeWitness, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
        ];
        let values = vector[
            string::utf8(b"Element NFT"),
            string::utf8(b"This is an Element NFT"),
            string::utf8(b"https://example.com/image.png"),
        ];
        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<ElementNFT>(&publisher, keys, values, ctx);
        display::update_version(&mut display);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    public entry fun mint(
        element: u8,
        stake_amount: u64,
        lock_period: u64,
        ctx: &mut TxContext,
    ) {
        // 验证元素有效性
        assert!(element >= 1 && element <= 9, EInvalidElement);

        let nft = ElementNFT {
            id: object::new(ctx),
            element,
            stake_amount,
            lock_period,
            rewards: 0,
            multiplier: 10000, // 初始倍数为 10000，表示 1 倍
            unlock_reduction: 0,
            governance_weight: 0,
            staked: false,
            start_time: 0,
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }

    public entry fun stake(
        mut nft: ElementNFT,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        // 检查支付金额是否足够
        let paid = coin::value(&payment);
        let required_payment = nft.stake_amount;
        assert!(paid >= required_payment, EInsufficientBalance);

        // 扣除质押金额
        if (paid > required_payment) {
            let refund = coin::split(&mut payment, paid - required_payment, ctx);
            transfer::public_transfer(refund, tx_context::sender(ctx));
        };

        // 标记 NFT 为已质押
        nft.staked = true;
        nft.start_time = tx_context::epoch_timestamp_ms(ctx);

        // 根据质押数量和锁定期计算倍数、解锁减免和治理权重
        let multiplier = calculate_multiplier(nft.stake_amount, nft.lock_period);
        let unlock_reduction = calculate_unlock_reduction(nft.stake_amount, nft.lock_period);
        let governance_weight = calculate_governance_weight(nft.stake_amount, nft.lock_period);

        nft.multiplier = multiplier;
        nft.unlock_reduction = unlock_reduction;
        nft.governance_weight = governance_weight;

        // 创建 StakedNFT 对象
        let staked_nft = StakedNFT {
            id: object::new(ctx),
            nft_id: object::id(&nft),
            start_time: nft.start_time,
            multiplier,
            unlock_reduction,
            governance_weight,
        };

        // 转移 StakedNFT 给用户
        transfer::transfer(staked_nft, tx_context::sender(ctx));

        // 转移 ElementNFT 给合约
        transfer::transfer(nft, tx_context::sender(ctx));
    }

    public entry fun unstake(
        nft: ElementNFT,
        staked_nft: StakedNFT,
        clock: Clock,
        _ctx: &mut TxContext,
    ) {
        // 检查 NFT 是否已质押
        assert!(nft.staked, ENotStaked);

        // 检查是否是对应的 StakedNFT
        assert!(object::id(&nft) == staked_nft.nft_id, ENotStaked);

        // 检查是否达到解锁时间
        let current_time = clock::timestamp_ms(&clock);
        assert!(current_time >= staked_nft.start_time + nft.lock_period, EUnstakeTooEarly);

        // 计算奖励
        let rewards = calculate_rewards(&nft, &clock);

        // 更新 NFT 状态
        nft.staked = false;
        nft.rewards = rewards;

        // 销毁 StakedNFT
        object::delete(staked_nft.id);

        // 转移 NFT 给用户
        transfer::transfer(nft, tx_context::sender(_ctx));
    }

    // 根据质押数量和锁定期计算倍数
    fun calculate_multiplier(stake_amount: u64, lock_period: u64): u64 {
        // 假设的倍数计算逻辑：
        // 基础倍数 + 质押数量 / 1000 + 锁定期 / 10000
        // 这里的数值和逻辑可以根据实际需求调整
        let base_multiplier = 10000; // 基础倍数，代表 1 倍
        let amount_bonus = stake_amount / 1000; // 每质押 1000 增加的倍数
        let period_bonus = lock_period / 10000; // 每锁定 10000 毫秒增加的倍数

        base_multiplier + amount_bonus + period_bonus
    }

    // 根据质押数量和锁定期计算解锁减免
    fun calculate_unlock_reduction(stake_amount: u64, lock_period: u64): u64 {
        // 假设的解锁减免计算逻辑：
        // 质押数量 / 5000 + 锁定期 / 20000
        // 这里的数值和逻辑可以根据实际需求调整
        let amount_reduction = stake_amount / 5000; // 每质押 5000 减少的解锁时间
        let period_reduction = lock_period / 20000; // 每锁定 20000 毫秒减少的解锁时间

        amount_reduction + period_reduction
    }

    // 根据质押数量和锁定期计算治理权重
    fun calculate_governance_weight(stake_amount: u64, lock_period: u64): u64 {
        // 假设的治理权重计算逻辑：
        // 质押数量 / 200 + 锁定期 / 5000
        // 这里的数值和逻辑可以根据实际需求调整
        let amount_weight = stake_amount / 200; // 每质押 200 增加的治理权重
        let period_weight = lock_period / 5000; // 每锁定 5000 毫秒增加的治理权重

        amount_weight + period_weight
    }

    // 计算奖励
    fun calculate_rewards(nft: &ElementNFT, clock: &Clock): u64 {
        // 检查是否已经计算过奖励
        if (!nft.staked) {
            return nft.rewards
        };

        // 获取当前时间戳
        let current_time = clock::timestamp_ms(clock);
        let time_passed = current_time - nft.start_time;
        let base_rewards = time_passed * 100000; // 假设每毫秒奖励 100000

        // 应用星座元素倍数
        base_rewards * nft.multiplier / 10000
    }

    // Getter 函数
    public fun get_element(nft: &ElementNFT): u8 { nft.element }
    public fun get_stake_amount(nft: &ElementNFT): u64 { nft.stake_amount }
    public fun get_lock_period(nft: &ElementNFT): u64 { nft.lock_period }
    public fun get_rewards(nft: &ElementNFT): u64 { nft.rewards }
    public fun get_multiplier(nft: &ElementNFT): u64 { nft.multiplier }
    public fun get_unlock_reduction(nft: &ElementNFT): u64 { nft.unlock_reduction }
    public fun get_governance_weight(nft: &ElementNFT): u64 { nft.governance_weight }
    public fun is_staked(nft: &ElementNFT): bool { nft.staked }
    public fun get_start_time(nft: &ElementNFT): u64 { nft.start_time }
}