module letsmoveoj::share;

use sui::vec_map::{Self, VecMap};
use std::string::String;
use letsmoveoj::personal::PersonList;
use letsmoveoj::admin::AdminList;

const E_NOT_ACCEPTED: u64 = 0;
const E_NOT_PERMISSION_TO_DELETE: u64 = 1;
const E_NOT_ADMIN: u64 = 2;

public struct ShareContent has store, drop {
    pid: u64,
    sharer: address,
    share_time: String,
    content: String,
}

public struct ShareList has key {
    id: UID,
    cur_sid: u64,
    list: VecMap<u64, ShareContent>
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(ShareList {
        id: object::new(ctx),
        cur_sid: 0,
        list: vec_map::empty<u64, ShareContent>()
    });
}

entry fun share(user: address, pid: u64, share_time: String, content: String, personal_list: &mut PersonList, list: &mut ShareList) {
    assert!(personal_list.accepted(user, pid), E_NOT_ACCEPTED);

    let sid = list.cur_sid + 1;
    list.cur_sid = sid;
    personal_list.share_content(user, sid);
    list.list.insert(sid, ShareContent {
        pid,
        sharer: user,
        share_time,
        content
    });
}

fun inner_delete(list: &mut ShareList, sid: u64): (u64, ShareContent) {
    list.list.remove(&sid)
}

entry fun delete(list: &mut ShareList, sid: u64, ctx: &TxContext) {
    let (_, content) = inner_delete(list, sid);
    assert!(content.sharer == ctx.sender(), E_NOT_PERMISSION_TO_DELETE);
}

entry fun delete_by_admin(list: &mut ShareList, sid: u64, admin_list: &AdminList, ctx: &TxContext) {
    assert!(admin_list.is_admin(ctx.sender()), E_NOT_ADMIN);
    inner_delete(list, sid);
}