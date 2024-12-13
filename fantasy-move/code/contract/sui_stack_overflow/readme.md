# local test
package-id = 0x9fb75841fe96eb97b49e4bf6f11313e6caddafa0730d773913eb94877cd4e502
upgradecap = 0xa64b94f5a7eca061e014d82411543241103beef73b5f720571b9490ec5f09279
## first call create_stack_overflow


sui client call \
--package 0x9fb75841fe96eb97b49e4bf6f11313e6caddafa0730d773913eb94877cd4e502 \
--module sui_stack_overflow \
--function create_stack_overflow

stack_overflow_id:  0x8b00b87007e151cd5ebc868d28d3d7f3a4eac1c929753a2620a55355107c2691


## second  use another account registry blob

sui client call \
--package 0x9fb75841fe96eb97b49e4bf6f11313e6caddafa0730d773913eb94877cd4e502 \
--module sui_stack_overflow \
--function regist_blob \
--args 0x6bde80c0b81ef6773c0d1df2c50fa51ef217fb0ee327b400f1aa92efb5942256 001 \
--gas-budget 100000000

## split coin
sui client split-coin --coin-id 0x05fc16f1a451c19768a0a9d3aca5289f1d95a25343ec104c3f442c594a9147b6 --amounts 40000000 --gas-budget 5000
## reword
sui client call \
--package 0xca134f035a5ee8d6d8d1bb99cf5bca7b4ffc709e92035f91017474917f9f945d \
--module sui_stack_overflow \
--function rewordSui \
--args 0x6bde80c0b81ef6773c0d1df2c50fa51ef217fb0ee327b400f1aa92efb5942256 001 0xa6e1be7ab9d007881217333d067931640da1fb8a555a5b0f9e30b7631c7c75d8 0x27d4cf0524b9763c848fd109646d93bf3136e8ba3a62fff7b8efb44f207f7695

## upgrade contract
sui client upgrade --gas-budget 100000000 --upgrade-capability 0x7ecc41402d02570ef118dd91c9f14d1e99d7efc1c5e0aa44415f5876395d0296

