module letsmoveoj::admin;

use sui::vec_set::{Self, VecSet};

const E_NOT_ADMIN: u64 = 0;
const E_NOT_REMOVE_PUBLISHER: u64 = 1;

public struct AdminList has key {
    id: UID,
    publisher: address,
    list: VecSet<address>
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(AdminList {
        id: object::new(ctx),
        publisher: ctx.sender(),
        list: vec_set::singleton(ctx.sender())
    });
}

entry fun add_admin(list: &mut AdminList, mut admins: vector<address>, ctx: &TxContext) {
    assert!(list.list.contains(&ctx.sender()), E_NOT_ADMIN);
    while (!admins.is_empty()) {
        let admin = admins.pop_back();
        list.list.insert(admin);
    };
}

entry fun remove_admin(list: &mut AdminList, mut admins: vector<address>, ctx: &TxContext) {
    assert!(list.list.contains(&ctx.sender()), E_NOT_ADMIN);
    assert!(!admins.contains(&list.publisher), E_NOT_REMOVE_PUBLISHER);
    while (!admins.is_empty()) {
        let admin = admins.pop_back();
        list.list.remove(&admin);
    };
}

public fun is_admin(list: &AdminList, person: address): bool {
    list.list.contains(&person)
}