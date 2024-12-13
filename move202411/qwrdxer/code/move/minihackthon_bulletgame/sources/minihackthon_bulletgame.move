module minihackthon_bulletgame::minihackthon_bulletgame{

    use sui::address::from_u256;
    use sui::balance;
    use sui::balance::Balance;
    use sui::coin::{Coin, take, into_balance};
    use sui::object::id_address;
    use sui::random;
    use sui::random::Random;
    use sui::sui::SUI;
    use sui::transfer::{ share_object};
    use sui::vec_map;
    use sui::vec_map::VecMap;

    public struct Player has key {
        id:UID,
        playerround:u16,
        win:u16, //胜率
        lose:u16
    }
    public struct BattleInfo has key{//存储本局的对局信息
        id:UID,
        user:address,// 挑战的玩家
        userHP:u8, //血量
        gpt:address,// gpt的区块链地址
        gptHP:u8, //血量
        totalBullet:u8, //总子弹数
        realBullet:u8,
        fakeBullet:u8,
        realBulletLeft:u8,//剩余子弹数
        fakeBulletLeft:u8,
        shotedBullet:vector<bool>,//已发射的子弹
        currentPlayer:address, // 当前回合的地址,可能是玩家地址也可能是用户地址
        nextSwitchPlayer:address, //切换的玩家
        BattleStatus:bool // 游戏是否已结束
    }
    public struct GamePool has key{ //游戏资金池
        id:UID,
        balance:Balance<SUI>
    }
    public struct Battles has key{
        id:UID,
        playingBattles:VecMap<address,address>,//玩家回合的battle
        gptroundBattles:VecMap<address,address>//gpt回合的battle
    }
    fun init(ctx:&mut TxContext){
        let battles=Battles{
            id:object::new(ctx),
            playingBattles:vec_map::empty(),
            gptroundBattles:vec_map::empty()
        };
        let gamePool=GamePool{
            id:object::new(ctx),
            balance:balance::zero()
        };
        share_object(battles);
        share_object(gamePool);
    }
    public fun switch_Player_And_Round(battleInfo:&mut BattleInfo,battles:&mut Battles){

        //对 人类玩家:battleinfo进行移动
        let useraddress=battleInfo.user;
        let batttlesaddress=id_address(battleInfo);
        if(battles.playingBattles.contains(&useraddress)){
            battles.playingBattles.remove(&useraddress);
            battles.gptroundBattles.insert(battleInfo.user,batttlesaddress);
        }else { //这代表当前玩家为gpt
            battles.gptroundBattles.remove(&useraddress);
            battles.playingBattles.insert(battleInfo.user,batttlesaddress);
        };
        let tmpaddress=battleInfo.currentPlayer;
        battleInfo.currentPlayer=battleInfo.nextSwitchPlayer;
        battleInfo.nextSwitchPlayer=tmpaddress;
    }
    //创建一个比赛
    //  sui client call --package  0x5cc47b5b35dcb457efdec7611bf0b75f2313c7c176a2d7ef4e71f8e1265104a4   --module  minihackthon_bulletgame --function entry_game \
    // --args  0x13bed127242d288a6e90a600cc2a57c8406ddcbad327f4961cf77301dcdabdb6  0x1416425a899452c3128dcf96dc84809f8703af50b253514c0054a55407f4b36f 0x83ff07c954c703079df98e94afb6f4546fbdc220b40ae1a3d498a29c7bce138c --gas-budget 10000000
    //
    public fun entry_game(coin: Coin<SUI>,gamePool:&mut GamePool,battles:&mut Battles,ctx:&mut TxContext){
        assert!(coin.value()>=1_000_000,1);
        let battleInfo=BattleInfo{
            id:object::new(ctx),
            user:ctx.sender(),// 挑战的玩家
            userHP:2, //血量
            gpt:from_u256(0xe81c85e1b9fb67c3a6baefaafc1c269e40791243866516f1f61d797d848b609d),// gpt的区块链地址
            gptHP:2, //血量
            totalBullet:10, //总子弹数
            realBullet:5,
            fakeBullet:5,
            realBulletLeft:5,//剩余子弹数
            fakeBulletLeft:5,
            shotedBullet:vector::empty(),//已发射的子弹
            currentPlayer:ctx.sender(), // 当前回合的地址,可能是玩家地址也可能是用户地址
            nextSwitchPlayer:from_u256(0xe81c85e1b9fb67c3a6baefaafc1c269e40791243866516f1f61d797d848b609d), //切换的玩家
            BattleStatus:false // 游戏是否已结束
        };
        let split_balance = into_balance(coin);
        gamePool.balance.join(split_balance);
        let batttlesaddress=id_address(&battleInfo);
        share_object(battleInfo);
        battles.playingBattles.insert(ctx.sender(), batttlesaddress ); //将未结束的游戏都存在这里
    }
    // 射击!
    //  sui client call --package  0xe4815ffb6321b19eea417f0c38f1495497e46507e1536348de4cbf8122b6408c   --module  minihackthon_bulletgame --function shot \
    // --args  0x26d9cec3e57ff4798cfb9b628a3bd9f40492c7ad4836496829ba3b11c5a77422  0x8 0x1 0x1416425a899452c3128dcf96dc84809f8703af50b253514c0054a55407f4b36f --gas-budget 10000000
    //
    public fun shot(battleInfo:&mut BattleInfo,gamePool:&mut GamePool,battles:&mut Battles,rdm:&Random,instruct:u8, ctx:&mut TxContext){
        // 状态检查
        assert!(battleInfo.BattleStatus==false,0);//游戏还未结束
        assert!(battleInfo.currentPlayer==ctx.sender(),1);//发送者为当前玩家
        let currentplayer=battleInfo.currentPlayer;
        //随机数生成,按照剩余子弹数的范围生成随机数,如果这个随机数大于剩余真实子弹数，则为虚假子弹
        let totalLeft=battleInfo.realBulletLeft+battleInfo.fakeBulletLeft;
        let mut gen = random::new_generator(rdm, ctx);
        let r1 = random::generate_u16_in_range(&mut gen, 1, (totalLeft as u16));
        //状态更新 : 子弹数, HP数, 游戏轮数
        if(r1<= (battleInfo.realBulletLeft as u16)){ //这是真的子弹
            battleInfo.realBulletLeft=battleInfo.realBulletLeft-1;
            if(instruct==1){ // 1代表射击对方,切换玩家,hp减一
                if(battleInfo.currentPlayer==battleInfo.gpt){//如果当前玩家为gpt,userhp-1
                    battleInfo.userHP=battleInfo.userHP-1;
                }else {
                    battleInfo.gptHP=battleInfo.gptHP-1;
                };
            }else{//否则就是射自己,自己hp-1
                if(battleInfo.currentPlayer==battleInfo.gpt){//如果当前玩家为gpt,Gpthp-1
                    battleInfo.gptHP=battleInfo.gptHP-1;
                }else {
                    battleInfo.userHP=battleInfo.userHP-1;
                };

            };
            switch_Player_And_Round(battleInfo,battles);
            battleInfo.shotedBullet.push_back(true);
        }else { //这是假的子弹

            battleInfo.fakeBulletLeft=battleInfo.fakeBulletLeft-1;
            battleInfo.shotedBullet.push_back(false);
            if(instruct==1){ // 1代表射击对方,切换玩家
                switch_Player_And_Round(battleInfo,battles)
            };

        };

        if(battleInfo.realBulletLeft+battleInfo.fakeBulletLeft==0 || battleInfo.userHP==0 ||battleInfo.gptHP==0){
            battleInfo.BattleStatus=true ;//游戏结束

        }

    }
    //获取奖励
    public fun get_reword(battleInfo:BattleInfo,gamePool:&mut GamePool,battles:&mut Battles,ctx:&mut TxContext){
        // 结果判定 ,子弹数为 0 或者 某个人hp为0 ,则进入奖励清算环节
        assert!(battleInfo.BattleStatus==true,1);//游戏 结束
        assert!(battleInfo.realBulletLeft+battleInfo.fakeBulletLeft==0 || battleInfo.userHP==0 ||battleInfo.gptHP==0,1);
        if(battles.playingBattles.contains(&battleInfo.user)){
            battles.playingBattles.remove(&battleInfo.user);
        }else{
            battles.gptroundBattles.remove(&battleInfo.user);
        };
        if (battleInfo.userHP > battleInfo.gptHP) {
            //玩家胜利,发送1.5sui
            let coin = take(&mut gamePool.balance, 5_000_000, ctx);
            transfer::public_transfer(coin, battleInfo.user)
        }else{
            //失败,退还0.5sui
            let coin = take(&mut gamePool.balance, 2_000_000, ctx);
            transfer::public_transfer(coin, battleInfo.user)
        };
        let BattleInfo {
            id,
            user: _, // 挑战的玩家
            userHP: _, //血量
            gpt: _, // gpt的区块链地址
            gptHP: _, //血量
            totalBullet: _, //总子弹数
            realBullet: _,
            fakeBullet: _,
            realBulletLeft: _, //剩余子弹数
            fakeBulletLeft: _,
            shotedBullet: _, //已发射的子弹
            currentPlayer: _, // 当前回合的地址,可能是玩家地址也可能是用户地址
            nextSwitchPlayer: _, //切换的玩家
            BattleStatus: _ // 游戏是否已结束
        } = battleInfo;
        id.delete();

        }
    }

