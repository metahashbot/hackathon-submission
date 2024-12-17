module scihub::scihub{

use std::string::String;
use sui::{
    display,
    package,
    event::{emit},
};
use scihub::utils::{to_b36};

public struct State has key,store {
    id:UID,
    libraries:vector<ID>,
}

public struct BlobLibrary has key,store {
    id:UID,
    name:String,
    owner:address,
    b36addr:String,
    members:vector<address>,
    blobs:vector<String>,
}

public struct Event_LibraryCreated has copy,drop{
    id:ID,
    name:String,
    owner:address,
    b36addr:String,
}

public struct SCIHUB has drop{}

const LIBRARY_VISUALIZATION_SITE:address = @0x1;

const ENOT_OWNER:u64 = 0;
const EALREADY_EXISTS:u64 = 1;
const ENOT_MEMBER:u64 = 2;

fun init(otw:SCIHUB, ctx: &mut TxContext){
    let publisher = package::claim(otw,ctx);
    let mut site_display = display::new<BlobLibrary>(&publisher,ctx);
    
    site_display.add(
        b"link".to_string(),
        b"https://{b36addr}.walrus.site".to_string(),
    );

    site_display.add(
        b"walrus site address".to_string(),
        LIBRARY_VISUALIZATION_SITE.to_string(),
    );

    site_display.update_version();

    let state = State{
        id:object::new(ctx),
        libraries:vector::empty(),
    };

    transfer::public_share_object(state);
    transfer::public_transfer(publisher,ctx.sender());
    transfer::public_transfer(site_display,ctx.sender());

}

public entry fun create_library(state: &mut State,name:String,ctx: &mut TxContext){
    let sender = ctx.sender();
    let id = object::new(ctx);
    let object_address = id.uid_to_address();
    let b36addr = to_b36(object_address);
    let event_id = id.to_inner();
    

    let library = BlobLibrary{
        id:id,
        name:name,
        owner:sender,
        b36addr:b36addr,
        members:vector::empty(),
        blobs:vector::empty(),
    };

    vector::push_back(&mut state.libraries,event_id);

    transfer::public_transfer(library,sender);
    
    emit(Event_LibraryCreated{
        id:event_id,
        name:name,
        owner:sender,
        b36addr:b36addr,
    });
}

public fun add_member(library:&mut BlobLibrary, member:address,ctx:&mut TxContext){
    assert!(library.owner == ctx.sender(),ENOT_OWNER);
    assert!(!vector::contains(&library.members,&member),EALREADY_EXISTS);
    vector::push_back(&mut library.members,member);
}

public fun add_blob(library:&mut BlobLibrary, blob:String,ctx:&mut TxContext){
    assert!(vector::contains(&library.members,&ctx.sender()),ENOT_MEMBER);
    assert!(!vector::contains(&library.blobs,&blob),EALREADY_EXISTS);
    vector::push_back(&mut library.blobs,blob);
}
}