#[allow(unused_use, unused_field, unused_mut_parameter)]
module sui_rog::equipment {
    use std::string::{Self, String, utf8};
    use sui::table::{Self, Table};
    use sui::package::{Self, Publisher};
    use sui::display::{Self, Display};

    public struct EQUIPMENT has drop {}

    public struct Sword has key, store {
        id: UID,
        name: String,
        attack: u64,
        creater: address,
        url: String,
    }



    public struct EquipmentList has key, store {
        id: UID,
        equipments: Table<String, Table<String, u64>>,
    }
 
    fun init(otw: EQUIPMENT, ctx: &mut TxContext) {
        let keys: vector<String> = vector[
            utf8(b"name"),  // 对象名称
            utf8(b"image_url"), // 图像 URL             
            utf8(b"creator"),       // 对象创建者
        ];

        let values: vector<String> = vector[
            utf8(b"{name}"),
            utf8(b"{url}"),
            utf8(b"{creater}"),
        ];

        let publisher: Publisher = package::claim(otw, ctx);
        let mut display: Display<Sword> = display::new_with_fields(&publisher, keys, values, ctx);
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));

    }

    public fun create_ep(name: String, creater: address, ctx: &mut TxContext): Sword {

        Sword {
            id: object::new(ctx),
            name: name,
            attack: 3,
            creater: creater,
            url: utf8(b"https://oss-of-ch1hiro.oss-cn-beijing.aliyuncs.com/imgs/202412082132939.png")
        }

    }

    public fun return_name(sword: &mut Sword): String {
        sword.name
    }

    public fun return_property(sword: &mut Sword): u64 {
        sword.attack
    }
    
}