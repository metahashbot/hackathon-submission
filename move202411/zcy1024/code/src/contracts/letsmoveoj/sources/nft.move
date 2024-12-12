module letsmoveoj::nft;

use std::string::String;
use sui::package;
use sui::display;

use letsmoveoj::admin::AdminList;
use letsmoveoj::personal::PersonList;

const SCORE: u64 = 3;

const E_NOT_ADMIN: u64 = 0;
const E_NOT_ENOUGH_SCORE: u64 = 1;

public struct NFT has drop {}

public struct LetsMoveNFT has key, store {
    id: UID,
    name: String,
    image_url: String
}

fun init(otw: NFT, ctx: &mut TxContext) {
    let keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let values = vector[
        b"{name}".to_string(),
        b"https://github.com/zcy1024/letsmove-oj".to_string(),
        b"{image_url}".to_string(),
        b"Congratulations! Now you can enjoy playing in Let's Move OJ!".to_string(),
        b"https://letsmove-oj.vercel.app/".to_string(),
        b"Debirth".to_string(),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<LetsMoveNFT>(
        &publisher, keys, values, ctx
    );

    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

public fun mint(ctx: &mut TxContext): LetsMoveNFT {
    LetsMoveNFT {
        id: object::new(ctx),
        name: b"Let's Move OJ!".to_string(),
        image_url: b"https://aggregator.walrus-testnet.walrus.space/v1/k3vVJcZfg2jF7XPbYpleF6f-XZG72qk00Edox7BIdX8".to_string()
    }
}

entry fun burn(nft: LetsMoveNFT) {
    let LetsMoveNFT {
        id,
        name: _,
        image_url: _
    } = nft;
    object::delete(id);
}

entry fun award(user: address, admin_list: &AdminList, personal_list: &PersonList, ctx: &mut TxContext) {
    assert!(admin_list.is_admin(ctx.sender()), E_NOT_ADMIN);
    assert!(personal_list.calculate_score(user) >= SCORE, E_NOT_ENOUGH_SCORE);
    transfer::public_transfer(mint(ctx), user);
}