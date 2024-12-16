
/// Module: sui_stack_overflow
module sui_stack_overflow::sui_stack_overflow;

use std::address;
use std::string::String;
use std::vector;
use sui::event;
use sui::sui::SUI;
use sui::transfer;
use wal::wal::WAL;
use sui::table;
use sui::table::Table;
use sui::tx_context::{TxContext, sender};
use sui::coin::{Self, Coin,value};
use sui::balance::{Self, Balance, Supply, supply_value};
use sui::pay;
use sui::object::{Self, UID, ID, borrow_id, id_address};
use sui_stack_overflow::constants::{get_default_fee,get_fee_base_of_percentage,get_wal_faucet_amount};
use sui_stack_overflow::core_amm::{get_fee,get_current_timestamp};
// === Errors ===
const EBlobAlreadyExists: u64 = 1;
const EBlobNotExits: u64 = 2;
const ENOTOWNERR: u64 = 3;
const EWALBalanceZero: u64 = 4;
const ENotEnoughWALBalance: u64 = 5;
const EWALFaucetFrequent: u64 = 6;
// const EPoolDoesNotExist: u64 = 2;
// const EPackageVersionNotEnabled: u64 = 3;
// const EVersionNotEnabled: u64 = 4;
// const EVersionAlreadyEnabled: u64 = 5;
// const ECannotDisableCurrentVersion: u64 = 6;

public struct StackOverflow has key, store {
    id: UID,
    owner: address,
    dao_fee: u64,
    blob_info_ids: vector<address>,
    blob_map: Table<String, address>, // 存储 blob跟信息射关系
    user_record: Table<address, UID>, // 发过blob的用户的nft记录
    fee_sui: u64,
    wal_balance: Balance<WAL>, // wal币的余额度
    wal_get_record: Table<address, u64>,
    wal_get_per_amount: u64, // 每次获取wal币的金额
    wal_get_gap: u64, // 获取wal币的时间间隔

    // fee_wal: Balance<WAL>,
}

public struct BlobInfo has key,store {
    id: UID,
    owner: address,
    title: String,
    blob_id: String,
    reword_sui_amount: u64,
}


/// BlobRegistry struct event.
public struct WalWithdramEvent has copy,store, drop {
    stack_over_flow_id: ID,
    amount: u64,
}


/// BlobRegistry struct event.
public struct WalFaucetEvent has copy,store, drop {
    stack_over_flow_id: ID,
    amount: u64,
    recipent_address: address
}


/// BlobRegistry struct event.
public struct BlobRegistry has copy,store, drop {
    stack_over_flow_id: ID,
    blob_id: String,
    blob_info_id: address,
    register: address,
}


/// BlobSuiReword struct event.
public struct BlobSuiReword has copy, store, drop {
    stack_over_flow_id: ID,
    blob_id: String,
    amount: u64,
    sender: address,
    reviver: address
}



// 创建
public entry fun create_stack_overflow(ctx: &mut TxContext){
    let address = sender(ctx);
    let dao_fee = get_default_fee();
    let stack_overflow = StackOverflow{
        id: object::new(ctx),
        dao_fee,
        owner: address,
        blob_map: table::new<String, address>(ctx),
        user_record: table::new<address, UID>(ctx),
        fee_sui: 0u64,
        blob_info_ids: vector::empty(),
        wal_balance:balance::zero<WAL>(),
        wal_get_record: table::new<address, u64>(ctx),
        wal_get_per_amount: 100_000_000u64,
        wal_get_gap: 28_800_000u64
    };

    transfer::share_object(stack_overflow)
}

public entry fun regist_blob(stack_overflow: &mut StackOverflow, title_name: String, blob_id: String, ctx: &mut TxContext){
    assert!(!exist_blob(stack_overflow, blob_id), EBlobAlreadyExists);
    let id = object::new(ctx);
    let object_address = object::uid_to_address(&id);
    let blobInfo = BlobInfo{
        id: id,
        title: title_name,
        owner: sender(ctx),
        blob_id: blob_id,
        reword_sui_amount: 0u64,
    };



    // let object_address = object::uid_to_address(id);
    table::add(&mut stack_overflow.blob_map, blob_id, sender(ctx));
    let stack_over_flow_id = stack_overflow.id.to_inner();
    vector::push_back(&mut stack_overflow.blob_info_ids, object_address);

    transfer::share_object(blobInfo);

    event::emit(BlobRegistry{
        stack_over_flow_id,
        blob_id,
        blob_info_id: object_address,
        register: sender(ctx),
    });
}

public fun exist_blob(stack_overflow: &StackOverflow, blob_id: String): bool {
    table::contains(&stack_overflow.blob_map, blob_id)
}

public entry fun rewordSui(stack_overflow: &mut StackOverflow, blob_id: String, blob_info: &mut BlobInfo,coin_in: vector<Coin<SUI>>,amount: u64, ctx: &mut TxContext){
    let mut coin_sui_in = coin::zero<SUI>(ctx);
    pay::join_vec(&mut coin_sui_in, coin_in);

    // let reword_coin =  coin::split(&mut coin_sui_in, amount, ctx);
    // 1.blob must in the blob_map of stack_overflow
    assert!(exist_blob(stack_overflow, blob_id), EBlobNotExits);

    // 2. transfer coin to
    //  2.1 split coin for pay fee
    // let total_amount = reword_coin.value();
    let fee_amount = get_fee(amount, stack_overflow.dao_fee);
    let fee_coin:  Coin<SUI> = coin::split(&mut coin_sui_in, fee_amount, ctx);


    let owner_address =  blob_info.owner;
    transfer::public_transfer(fee_coin, stack_overflow.owner);
    stack_overflow.fee_sui = stack_overflow.fee_sui + fee_amount;


    // Transfer the remaining coin to the owner address
    let left_coin = coin::split(&mut coin_sui_in, amount - fee_amount, ctx);
    let left_value = left_coin.value();
    transfer::public_transfer(left_coin, owner_address);
    blob_info.reword_sui_amount =  blob_info.reword_sui_amount + left_value;
    transfer::public_transfer(coin_sui_in, sender(ctx));
    event::emit(BlobSuiReword{
        stack_over_flow_id: stack_overflow.id.to_inner(),
        blob_id,
        amount: amount,
        sender: sender(ctx),
        reviver: owner_address,
    });

}
    // transfer(*coin_in, *owner_address);
    /// get fee from amount
public fun get_dao_fee(amount: u64, fee: u64): u64{
    ((fee as u128) * (amount as u128) / (get_fee_base_of_percentage() as u128) as u64)
}

public entry fun withdram_wal(stack_overflow: &mut StackOverflow, wal_coin: Coin<WAL>, ctx: &mut TxContext){

    let wal_balance = coin::into_balance(wal_coin);
    let amount  = wal_balance.value();
    balance::join(&mut stack_overflow.wal_balance, wal_balance);

    event::emit(WalWithdramEvent{
        stack_over_flow_id: stack_overflow.id.to_inner(),
        amount: amount,
    });
}


public entry fun wal_faucet(stack_overflow: &mut StackOverflow,timeStamp: u64, ctx: &mut TxContext){

    // let total_wal_amount = total_wal_balance.value();
    let address = sender(ctx);

    if(table::contains(&stack_overflow.wal_get_record, address)){

        let pre_time = *table::borrow(&stack_overflow.wal_get_record, address);
        assert!((pre_time + stack_overflow.wal_get_gap) < timeStamp, EWALFaucetFrequent);
    };


    let faucet_amount = stack_overflow.wal_get_per_amount;
    assert!((faucet_amount < stack_overflow.wal_balance.value()), ENotEnoughWALBalance);
    let faucet_balance = balance::split(&mut stack_overflow.wal_balance, faucet_amount);
    transfer::public_transfer(coin::from_balance(faucet_balance, ctx), address);
    let records = table::borrow_mut(&mut stack_overflow.wal_get_record, address);
    // stack_overflow.wal_get_record
    table::remove(&mut stack_overflow.wal_get_record,address);
    table::add(&mut stack_overflow.wal_get_record,address, timeStamp);
    event::emit(WalFaucetEvent{
        stack_over_flow_id: stack_overflow.id.to_inner(),
        amount: faucet_amount,
        recipent_address: address
    });
}

public entry fun deposit_wal(stack_overflow: &mut StackOverflow, ctx: &mut TxContext){
    assert!((sender(ctx) == stack_overflow.owner), ENOTOWNERR);

    assert!(!(stack_overflow.wal_balance.value() == 0u64), EWALBalanceZero);
    let total_amount = stack_overflow.wal_balance.value();
    let totao_balance = coin::take(&mut stack_overflow.wal_balance, total_amount,ctx);
    transfer::public_transfer(totao_balance, sender(ctx));
}

public entry fun remove_blob(stack_overflow: &mut StackOverflow, blob_id: String, blob_address: address, ctx: &mut TxContext){
    assert!((sender(ctx) == stack_overflow.owner), ENOTOWNERR);
    if(table::contains(&mut stack_overflow.blob_map, blob_id)){
        table::remove(&mut stack_overflow.blob_map, blob_id);
    };

    let (cointains, index) = vector::index_of(&stack_overflow.blob_info_ids, &blob_address);
    if (cointains){
        vector::remove(&mut stack_overflow.blob_info_ids, index);
    }

}












