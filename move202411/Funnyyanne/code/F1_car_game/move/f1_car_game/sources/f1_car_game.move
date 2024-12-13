module f1_car_game::f1_car_game {
    use std::string::{String};
    use sui::coin::{Coin, into_balance, from_balance};
    use sui::coin;
    use sui::sui::SUI;
    use sui::tx_context::{sender};
    use sui::transfer::{share_object, transfer, public_transfer};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::random::{Self, Random, new_generator};
use sui::object::{Self}; 

    // error code
    const E_INSUFFICIENT_FUNDS: u64 = 1;
    const E_INVALID_VALUE_RANGE: u64 = 4;

    // event
    public  struct BuyResult has copy, drop {
            player: address,
            reward: u64
        } 
    public  struct RaceResult has copy, drop {
            player: address,
            position: u8,
            reward: u64
        }
  

    public struct GameState has key {
        id: UID,
        treasury: Balance<SUI>,
        total_pool: u64,
        maintenance_fund: u64
    }

    public struct Car has key, store  {
        id: UID,
        name: String,
        engine_level: u8,
        price: u64,
        url:String
    }

   public struct Driver has key, store {
        id: UID,
        name: String,
        team: String,
        skill_level: u8,
        price: u64,
        available: bool,
        url:String
    }
    
  //event:create driver
    public struct CreateDriverResult has copy, drop  {
        driver_name: String,
        driver_team: String,
        driver_skill: u8,
        driver_price: u64
    }
    //event:create car
    public struct CreateCarResult has copy, drop {
        car_name: String,
        car_engine: u8,
        car_price: u64
    }
    public struct DriverLibrary has key, store {
        id: UID,
        available_drivers: vector<Driver>
    }

       public  struct GamePool has key, store {
        id: UID,
        balance: Balance<SUI>,
        total_pool: u64,
        maintenance_fund: u64,
    }

    public struct CarLibrary has key, store {
        id: UID,
        available_cars: vector<Car>
    }

    //admin
    public struct F1CarGameAdminCap has key {
        id: UID
    }
      
    fun init(ctx: &mut TxContext) {   
        let adminCap = F1CarGameAdminCap{id:object::new(ctx)};
        transfer(adminCap,ctx.sender());   

        let pool = GamePool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_pool: 0,
            maintenance_fund: 0
        };
       transfer(pool, ctx.sender());

       let car_library = CarLibrary { 
        id: object::new(ctx),
        available_cars: vector::empty() //init empty
        };
        share_object(car_library);

    let driver_library = DriverLibrary {
        id: object::new(ctx),
        available_drivers: vector::empty()
    };
        share_object(driver_library);

        let game_state = GameState {
            id: object::new(ctx),
            treasury: balance::zero(),
            total_pool: 0,
            maintenance_fund: 0
        };
        share_object(game_state);

    }

    
  public entry fun create_new_driver(
    _adminCap: &F1CarGameAdminCap,
    driver_library: &mut DriverLibrary,
    name: String,
    team: String,
    skill: u8,
    price: u64,
    url: String,
    ctx: &mut TxContext
) {
     assert!(skill >= 1 && skill <= 5, E_INVALID_VALUE_RANGE);
        assert!(price > 0, E_INVALID_VALUE_RANGE);
    let new_driver = Driver {
        id: object::new(ctx),
        name,
        team,
        skill_level: skill,
        price,
        available: true,
        url
    };
     event::emit(CreateDriverResult {
        driver_name: name,
        driver_team: team,
        driver_skill: skill,
        driver_price: price
    });
    
    vector::push_back(&mut driver_library.available_drivers, new_driver);
   
}

public  fun get_available_drivers(driver_library: &DriverLibrary): &vector<Driver> {
    &driver_library.available_drivers
}

    // 购买游戏币
    public fun buy_game_tokens(
        _game_state: &mut GameState,
        _payment: &mut Coin<SUI>,
        _amount: u64,
        _ctx: &mut TxContext
    ) {
        // Check that payment has sufficient balance

        // assert!(coin::value(payment) >= amount, E_INSUFFICIENT_FUNDS); // Error if insufficient funds
        // game_state.total_pool = amount;
        
        // let payment_balance = coin::split(payment, amount, ctx);
        // let reward = payment_balance.value();
        // balance::join(&mut game_state.treasury, into_balance(payment_balance));
    
        //   event::emit(BuyResult {
        //     player: sender(ctx),
        //     reward:reward
        // });
        abort 0
    }
    public fun buy_game_tokensv2(
        game_state: &mut GameState,
        payment: &mut Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // Check that payment has sufficient balance

        assert!(coin::value(payment) >= amount, E_INSUFFICIENT_FUNDS); // Error if insufficient funds
        game_state.total_pool = game_state.total_pool + amount;
        
        let payment_balance = coin::split(payment, amount, ctx);
        let reward = payment_balance.value();
        balance::join(&mut game_state.treasury, into_balance(payment_balance));
    
          event::emit(BuyResult {
            player: sender(ctx),
            reward:reward
        });
    }

    // 庄家获取余额
    public fun get_treasury_balance(_adminCap: &F1CarGameAdminCap, game_state: &mut GameState,  ctx: &mut TxContext) {
        let out_balance = balance::split(&mut game_state.treasury, 1);
        let out_coin = coin::from_balance(out_balance, ctx);
        transfer::public_transfer(out_coin, sender(ctx));
    }


    // 猜测车手价格 front 实现
    // 计算比赛结果和奖励
   public  fun calculate_race_result(
        car: &Car,
        driver: &Driver,
        game_state: &mut GameState,
        ctx: &mut TxContext
    ): u8 {
        let out_balance;
        let mut treasury_amount= 0u64;

        let total_value = (car.engine_level) as u64 
            + (driver.skill_level as u64);
            
        let position = if (total_value == 10) { 
            out_balance = balance::split(&mut game_state.treasury, game_state.total_pool);
            let out_coin = from_balance(out_balance, ctx);
            treasury_amount = coin::value(&out_coin);
            public_transfer(out_coin, sender(ctx));
            0
        } else if (total_value > 8) { 
            out_balance = balance::split(&mut game_state.treasury, game_state.total_pool * 50 / 100);
            let out_coin = from_balance(out_balance, ctx);
            treasury_amount = out_coin.value();
            public_transfer(out_coin, sender(ctx));
            1
        } else { 
            2
        };

        event::emit(RaceResult {
            player: sender(ctx),
            position,
            reward:treasury_amount
        });
        
        position
    }

    public entry fun create_new_car(
    car_library: &mut CarLibrary,
    name: String,
    engine: u8,
    price: u64,
    url: String,
    ctx: &mut TxContext
) {    
        assert!(engine >= 1 && engine <= 5, E_INVALID_VALUE_RANGE);

    let new_car = Car {
        id: object::new(ctx),
        name,
        engine_level: engine,
        price,
        url
    };
    
    vector::push_back(&mut car_library.available_cars, new_car);
    event::emit(CreateCarResult {
        car_name: name,
        car_engine: engine,
        car_price: price
    });
}

 fun roll_dice(r: &Random,car_library: &CarLibrary, ctx: &mut TxContext): u64 {
        let mut generator = new_generator(r, ctx); 
        let user_length = vector::length(&car_library.available_cars);
        let result = random::generate_u64_in_range(&mut generator, 0, user_length);
        result
    }

// 添加获取可用赛车的函数
#[allow(lint(public_random))]
public entry fun get_random_car_info(
    r: &Random, 
    car_library: &CarLibrary, 
    ctx: &mut TxContext
): (ID,String, u8, u64, String) {
    let car = vector::borrow(&car_library.available_cars, roll_dice(r, car_library, ctx));
    (object::uid_to_inner(&car.id),car.name, car.engine_level, car.price, car.url)
}
  
 public entry fun update_car(car:&mut Car, url:String) {
        car.url = url;
    }
 public entry fun update_driver(driver:&mut Driver, url:String) {
        driver.url = url;
    }

// get driver
public fun read_driver_name(driver:&Driver):String {
    driver.name
}

public fun read_driver_price(driver:&Driver):u64 {
    driver.price
}

public fun read_driver_skill(driver:&Driver):u8 {
    driver.skill_level
}
   public fun read_driver_team(driver:&Driver):String {
    driver.team
}

 public fun read_driver_url(driver:&Driver):String {
    driver.url
}

//get car
public fun read_car_url(car:&Car):String {
    car.url
}

public fun read_car_price(car:&Car):u64 {
    car.price
}

public fun read_car_level(car:&Car):u8 {
    car.engine_level
}

}