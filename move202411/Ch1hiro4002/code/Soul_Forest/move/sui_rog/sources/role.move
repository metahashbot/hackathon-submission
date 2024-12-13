#[allow(unused_field, unused_use, unused_let_mut, duplicate_alias, lint(public_random, custom_state_change, abort_without_constant))]
module sui_rog::role{
    use std::string::{Self, String, utf8};
    use sui::package::{Self, Publisher};
    use sui::display::{Self, Display};
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use sui::coin;
    use sui::table::{Self, Table};
    use sui::random::{Self, Random};
    use sui::transfer;
    use sui_rog::utils;
    use sui_rog::soul::{Self, SOUL, CoinPool, AdminCap};
    use sui_rog::equipment::{Self, Sword};

    // 定义一个 OTW，必须是模块的第一个结构体
    public struct ROLE has drop {}

    // 定义角色基本信息
    public struct Role has key, store{
        id: UID,
        name: String,
        description: String,
        serial_number: u64,
        role_data: RoleData,
        creater: address,
    }

    // 定义角色数据
    public struct RoleData has store {
        id: ID,
        profession: String,
        level: u64,
        wallet: Balance<SOUL>,
        xp: u64,
        fighting_system: Fighting,
        equipment_system: Option<Sword>,
        task_system: vector<Task>,
    }

// ==================================================================================================================================================

    // 初始化
    fun init(otw: ROLE, ctx: &mut TxContext) {
        let keys: vector<String> = vector[
            utf8(b"name"),  
            utf8(b"image_url"), 
            utf8(b"description"),             
            utf8(b"creator"),   
        ];

        let values: vector<String> = vector[
            utf8(b"{name}"),
            utf8(b"https://oss-of-ch1hiro.oss-cn-beijing.aliyuncs.com/imgs/202412052252266.png"),
            utf8(b"{description}"),
            utf8(b"{creater}"),
        ]; 

        let publisher: Publisher = package::claim(otw, ctx);
        let mut display: Display<Role> = display::new_with_fields(&publisher, keys, values, ctx);

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    const WARRIOR_HP: u64 = 10;
    const WARRIOR_ATTACK_POWER: u64 = 5;

    // 初始化战士的数据
    public fun init_warrior_fighting(): Fighting {

        Fighting {
            hp: WARRIOR_HP,
            attack_power: WARRIOR_ATTACK_POWER,
            kills: 0,
        }

    }

    public fun init_role_data(id: ID, profession: String): RoleData {

        let mut fighting = init_warrior_fighting();

        RoleData {
            id: id,
            profession: profession,
            level: 0,
            wallet: balance::zero<SOUL>(),
            xp: 0,
            fighting_system: fighting,
            equipment_system: option::none<Sword>(),
            task_system: vector::empty<Task>(),
        }

    }

    public entry fun create_role(name: String, profession: String, description: String, creater: address, ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let profession_id;
        if(profession == string::utf8(b"warrior")) {
            profession_id = 0
        } else {
            profession_id = 1
        };

        // 生成序列号
        let serial_number = utils::create_role_serial_number(profession_id, &uid);

        // 生成角色的游戏数据
        let role_data = init_role_data(id, profession);

        let role = Role {
            id: uid,
            name: name,
            description: description,
            serial_number: serial_number,
            role_data: role_data,
            creater: creater,
        };

        transfer::public_transfer(role, creater);

    }

// ==================================================================================================================================================

    // 定义战斗系统
    public struct Fighting has store, drop {
        hp: u64,
        attack_power: u64,
        kills: u64,
    }

    // 定义怪物结构
    public struct Monster has key {
        id: UID,
        name: String,
        level: u64,
        monster_hp: u64,
        monster_attack: u64,
    }

    // 生成低级怪物信息
    public entry fun create_monster_low(random: &Random, creater: address, ctx: &mut TxContext) {
        let mut random_generator = random::new_generator(random, ctx);

        let level = random::generate_u64_in_range(&mut random_generator, 1, 10);
        let monster_hp = level + 5;
        let monster_attack = level / 2;

        let monster_low = Monster {
            id: object::new(ctx),
            name: string::utf8(b"bad wolf"),
            level: level,
            monster_hp: monster_hp,
            monster_attack: monster_attack,
        };

        transfer::transfer(monster_low, creater);
    }

    // 进行攻击
    public entry fun attack_monster(monster_low: Monster, role: &mut Role) {
        assert!(monster_low.monster_hp > 0, 0);

        let mut monster: Monster = monster_low;
        if(monster.monster_hp >= role.role_data.fighting_system.attack_power) {
            monster.monster_hp = ((monster.monster_hp) - (role.role_data.fighting_system.attack_power));
        } else {
            monster.monster_hp = 0
        };

        if(monster.monster_hp == 0) {
            role.role_data.fighting_system.kills = role.role_data.fighting_system.kills + 1;
            role.role_data.xp = role.role_data.xp + 10;
            let Monster {
                id, 
                monster_attack:_, 
                monster_hp: _, 
                level: _, 
                name: _,
            } = monster;
            object::delete(id);
        } else {
            transfer::transfer(monster, role.creater);
        };
    }

// ==================================================================================================================================================

    // 定义任务系统
    public struct Task has store, drop {
        name: String,
        description: String,
        award_xp: u64,
        award_coin: u64,
        status: u64,
    }

    // 发布任务
    public fun creat_task_low(name: String, description: String, award_xp: u64, award_coin: u64): Task {
        Task {
            name: name,
            description: description,
            award_xp: award_xp,
            award_coin: award_coin,
            status: 0,
        }
    }

    // 接取任务
    public entry fun receive_task_low(name: String, description: String, award_xp: u64, award_coin: u64, role: &mut Role) {
        assert!(vector::is_empty(&role.role_data.task_system), 0);
        let mut task = creat_task_low(name, description, award_xp, award_coin);
        task.status = 1;
        vector::push_back(&mut role.role_data.task_system, task);
    }

    // 检测任务
    public entry fun check_task_low(role: &mut Role) {
        if(role.role_data.fighting_system.kills >= 1) {
            vector::borrow_mut(&mut role.role_data.task_system, 0).status = 2;
            role.role_data.fighting_system.kills = role.role_data.fighting_system.kills - 1;
        } else {
            abort(0)
        } 
    }

    // 发送奖励
    public entry fun send_rewards_low(role: &mut Role, coin_pool: &mut CoinPool, ctx: &mut TxContext) {
            role.role_data.xp = role.role_data.xp + vector::borrow_mut(&mut role.role_data.task_system, 0).award_xp;

            let award_balance = soul::withdraw_task_low_token(coin_pool);
            balance::join(&mut role.role_data.wallet, award_balance);

            let equipment = equipment::create_ep(string::utf8(b"smart_sword"), role.creater, ctx);
            transfer::public_transfer(equipment, role.creater);

            vector::pop_back(&mut role.role_data.task_system);
    }

// ==================================================================================================================================================

    // 把 coin 从角色转移到钱包
    public entry fun transfer_coin(role: &mut Role, recipient: address, amt: u64, ctx: &mut TxContext) {
        let split_coin = balance::split(&mut role.role_data.wallet, amt);
        let transfer_coin = coin::from_balance(split_coin, ctx);
        transfer::public_transfer(transfer_coin, recipient);
    }

// ==================================================================================================================================================

    // 穿上装备
    public entry fun put_on_ep(role: &mut Role, sword: Sword) {
        let mut ep_sword = sword;
        let tmp_attack: u64 = equipment::return_property(&mut ep_sword);
        role.role_data.fighting_system.attack_power = role.role_data.fighting_system.attack_power + tmp_attack;
        option::fill(&mut role.role_data.equipment_system, ep_sword);
    }

    // 卸下装备
    public entry fun take_off_ep(role: &mut Role, recipient: address) {
        let tmp_attack: u64 = equipment::return_property(option::borrow_mut(&mut role.role_data.equipment_system));
        role.role_data.fighting_system.attack_power = role.role_data.fighting_system.attack_power - tmp_attack;
        let sword = option::extract(&mut role.role_data.equipment_system);
        transfer::public_transfer(sword, recipient);
    }

// ==================================================================================================================================================
    // 升级检测
    public entry fun up_level(role: &mut Role) {
        if(role.role_data.xp == 50) {
            role.role_data.level = role.role_data.level + 1;
            role.role_data.xp = 0;
            role.role_data.fighting_system.attack_power = role.role_data.fighting_system.attack_power + 2;
        }
    }
}

