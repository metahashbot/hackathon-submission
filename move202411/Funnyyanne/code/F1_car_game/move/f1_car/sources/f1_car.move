module f1_car::f1_car {
    use std::string::{String};
    use sui::coin::{Coin, into_balance, from_balance};
    use sui::coin;
    use sui::sui::SUI;
    use sui::tx_context::{Self, TxContext, sender};
    use sui::transfer::{share_object, transfer, public_transfer};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::random::{Self, Random, new_generator};
    use sui::object::{Self, ID, UID}; 
    use std::vector;

    // 错误代码
    const E_INSUFFICIENT_FUNDS: u64 = 1;
    const E_INVALID_VALUE_RANGE: u64 = 4;
    const E_DRIVER_NOT_AVAILABLE: u64 = 5;
    const E_GUESSED_PRICE_TOO_LOW: u64 = 6;

    // 事件
    struct BuyResult has copy, drop {
        player: address,
        driver_name: String,
        price_paid: u64,
        guessed_price: u64
    }

    struct RaceResult has copy, drop {
        player: address,
        position: u8,
        total_value: u64,
        reward: u64
    }

    // 游戏状态
   public struct GameState has key {
        id: UID,
        treasury: Balance<SUI>,
        total_pool: u64,
        maintenance_fund: u64
    }

    // 赛车结构
   public struct Car has key, store {
        id: UID,
        name: String,
        engine_level: u8,  // 1-5
        price: u64,
        url: String
    }

    // 车手结构
  public  struct Driver has key, store {
        id: UID,
        name: String,
        team: String,
        skill_level: u8,  // 1-5
        price: u64,
        available: bool,
        url: String
    }

    // 车手库
 public   struct DriverLibrary has key {
        id: UID,
        available_drivers: vector<Driver>
    }

    // 赛车库
 public   struct CarLibrary has key {
        id: UID,
        available_cars: vector<Car>
    }

    // 管理员权限
   public struct AdminCap has key {
        id: UID
    }

    // 初始化函数
    fun init(ctx: &mut TxContext) {
        // 创建管理员权限
        let admin_cap = AdminCap { 
            id: object::new(ctx) 
        };
        transfer(admin_cap, tx_context::sender(ctx));

        // 创建游戏状态
        let game_state = GameState {
            id: object::new(ctx),
            treasury: balance::zero(),
            total_pool: 0,
            maintenance_fund: 0
        };
        share_object(game_state);

        // 创建车手库
        let driver_library = DriverLibrary {
            id: object::new(ctx),
            available_drivers: vector::empty()
        };
        share_object(driver_library);

        // 创建赛车库
        let car_library = CarLibrary {
            id: object::new(ctx),
            available_cars: vector::empty()
        };
        share_object(car_library);
    }

    // 创建新车手
    public entry fun create_driver(
        _admin: &AdminCap,
        driver_library: &mut DriverLibrary,
        name: String,
        team: String,
        skill_level: u8,
        price: u64,
        url: String,
        ctx: &mut TxContext
    ) {
        assert!(skill_level >= 1 && skill_level <= 5, E_INVALID_VALUE_RANGE);
        assert!(price > 0, E_INVALID_VALUE_RANGE);

        let driver = Driver {
            id: object::new(ctx),
            name,
            team,
            skill_level,
            price,
            available: true,
            url
        };

        vector::push_back(&mut driver_library.available_drivers, driver);
    }

    // 创建新赛车
    public entry fun create_car(
        _admin: &AdminCap,
        car_library: &mut CarLibrary,
        name: String,
        engine_level: u8,
        price: u64,
        url: String,
        ctx: &mut TxContext
    ) {
        assert!(engine_level >= 1 && engine_level <= 5, E_INVALID_VALUE_RANGE);
        assert!(price > 0, E_INVALID_VALUE_RANGE);

        let car = Car {
            id: object::new(ctx),
            name,
            engine_level,
            price,
            url
        };

        vector::push_back(&mut car_library.available_cars, car);
    }

    // 购买车手
    public entry fun buy_driver(
        game_state: &mut GameState,
        driver_library: &mut DriverLibrary,
        driver_index: u64,
        guessed_price: u64,
        payment: &mut Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let driver = vector::borrow_mut(&mut driver_library.available_drivers, driver_index);
        
        // 检查车手是否可用
        assert!(driver.available, E_DRIVER_NOT_AVAILABLE);
        
        // 检查猜测价格是否足够
        assert!(guessed_price >= driver.price, E_GUESSED_PRICE_TOO_LOW);
        
        // 检查支付金额是否足够
        assert!(coin::value(payment) >= driver.price, E_INSUFFICIENT_FUNDS);

        // 处理支付
        let payment_balance = coin::split(payment, driver.price, ctx);
        balance::join(&mut game_state.treasury, into_balance(payment_balance));
        
        // 更新车手状态
        driver.available = false;

        // 发出购买事件
        event::emit(BuyResult {
            player: sender(ctx),
            driver_name: driver.name,
            price_paid: driver.price,
            guessed_price
        });
    }

    // 获取随机赛车
    public fun get_random_car(
        r: &Random,
        car_library: &CarLibrary,
        ctx: &mut TxContext
    ): &Car {
        let generator = new_generator(r, ctx);
        let car_count = vector::length(&car_library.available_cars);
        let random_index = random::generate_u64_in_range(&mut generator, 0, car_count);
        vector::borrow(&car_library.available_cars, random_index)
    }

    // 计算比赛结果
    public entry fun race(
        game_state: &mut GameState,
        car: &Car,
        driver: &Driver,
        ctx: &mut TxContext
    ) {
        let total_value = (car.engine_level as u64) + (driver.skill_level as u64);
        
        let (position, reward) = if (total_value == 10) {
            // 完美匹配 - 获得全部奖池
            let reward_balance = balance::split(&mut game_state.treasury, game_state.total_pool);
            let reward_coin = from_balance(reward_balance, ctx);
            public_transfer(reward_coin, sender(ctx));
            (0, game_state.total_pool)
        } else if (total_value > 8) {
            // 接近完美 - 获得一半奖池
            let reward_balance = balance::split(&mut game_state.treasury, game_state.total_pool / 2);
            let reward_coin = from_balance(reward_balance, ctx);
            public_transfer(reward_coin, sender(ctx));
            (1, game_state.total_pool / 2)
        } else {
            // 未获奖
            (2, 0)
        };

        // 发出比赛结果事件
        event::emit(RaceResult {
            player: sender(ctx),
            position,
            total_value,
            reward
        });
    }

    // Getter 函数
    public fun get_driver_info(driver: &Driver): (String, String, u8, u64, bool, String) {
        (driver.name, driver.team, driver.skill_level, driver.price, driver.available, driver.url)
    }

    public fun get_car_info(car: &Car): (String, u8, u64, String) {
        (car.name, car.engine_level, car.price, car.url)
    }

    public fun get_available_drivers(driver_library: &DriverLibrary): &vector<Driver> {
        &driver_library.available_drivers
    }

    public fun get_available_cars(car_library: &CarLibrary): &vector<Car> {
        &car_library.available_cars
    }
}