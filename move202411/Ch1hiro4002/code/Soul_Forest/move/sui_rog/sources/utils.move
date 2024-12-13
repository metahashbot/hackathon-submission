#[allow(unused_variable, unused_use, lint(unnecessary_unit))]
module sui_rog::utils {
    use sui::hash;
    use std::debug;
    use std::string::{Self, String};
    use sui_rog::role::Role;

    // 生成角色的序列号
    public fun create_role_serial_number(profession: u64, uid: &UID): u64 {

        let mut hash: vector<u8> = hash::keccak256(&object::uid_to_bytes(uid));

        let mut result_num: u64 = 0;

        // 哈希向量转换为 u64
        while(vector::length(&hash) > 0) {
            let element: u8 = vector::remove<u8>(&mut hash, 0);
            result_num = ((result_num << 8) | (element as u64))
        };

        // 只取出最后五位数
        result_num = result_num % 100000u64;

        // 拼接 profession
        profession * 100000u64 + result_num
    }

    // 将序列号转换为 image 的 ID 
    public fun serial_number_to_image_id(serial_number: u64): String {
        let id: u64 = serial_number / 10 % 10000u64;
        u64_to_string(id, 4)
    }

    public fun u64_to_string(id: u64, fixed_length: u64): String {
        let mut result: vector<u8> = vector::empty<u8>();
        let mut new_id = id;
        if(new_id == 0) {
            // 48 是 ASCII 码表示 0
            vector::push_back(&mut result, 48);
        } else {
            while(new_id > 0) {
                let n: u8 = ((new_id % 10) as u8) + 48;
                vector::push_back(&mut result, n);
                new_id = new_id / 10;
            };

            // 如果向量长度小于 fixed_length 则向后补0
            while(vector::length(&result) < fixed_length) {
                vector::push_back(&mut result, 48);
            };

            vector::reverse(&mut result);
        };

        string::utf8(result)
    }

}