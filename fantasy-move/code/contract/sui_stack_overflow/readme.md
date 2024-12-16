# local test
package-id = 0x0aefed8383f9414ff436498c5ef3525431c0ae0d331470c4689c5e9f45073d0e
upgradecap = 0x23ff4bcc5d99b38ed7667843ee4d13e77535db8b534102d8ab88bdc73fdc1f3a
## first call create_stack_overflow


sui client call \
--package 0x0aefed8383f9414ff436498c5ef3525431c0ae0d331470c4689c5e9f45073d0e \
--module sui_stack_overflow \
--function create_stack_overflow

stack_overflow_id:  0x451c9de72bd22fd01ccc75f13c993bfa7827668eaaddbb4c76b0fa32f300b16c


### remove blob 
sui client call \
--package 0x0aefed8383f9414ff436498c5ef3525431c0ae0d331470c4689c5e9f45073d0e \
--module sui_stack_overflow \
--function remove_blob \
--args 0x451c9de72bd22fd01ccc75f13c993bfa7827668eaaddbb4c76b0fa32f300b16c f3fDk67Sh4zHVTip2eZb7ASc8N0WDxZ5NsbWeJhx9N8 0x4456ec56b5023d62ca203348698e365696abeba16f0e47e07b9dd96e5481fbeb
## withdram WAL coin
sui client call \
--package 0x98091c1259fc5b531eba20ad2e069f048ca0584a10ce90e9f4b0d68ded39c36a \
--module sui_stack_overflow \
--function withdram_wal \
--args 0x94a7fc99e5cc1381c69151a8ed7721d0f644c90508905a6553f5c4c9b1cdd70f 0xc5fa12a683cee31feecee061466e5b37342129514c315064ba2558eae07da55f \
--gas-budget 100000000

### wal faucet
sui client call \
--package 0xf41d67fc19e9f92a2f01afc4b727252c8c634d38bf9eb10ec4fbd7b640e8e64d \
--module sui_stack_overflow \
--function wal_faucet \
--args 0x94a7fc99e5cc1381c69151a8ed7721d0f644c90508905a6553f5c4c9b1cdd70f  \
--gas-budget 100000000

### deposit wal
### wal faucet
sui client call \
--package 0xf41d67fc19e9f92a2f01afc4b727252c8c634d38bf9eb10ec4fbd7b640e8e64d \
--module sui_stack_overflow \
--function deposit_wal \
--args 0x94a7fc99e5cc1381c69151a8ed7721d0f644c90508905a6553f5c4c9b1cdd70f  \
--gas-budget 100000000



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
sui client upgrade --gas-budget 100000000 \
--upgrade-capability 0x23ff4bcc5d99b38ed7667843ee4d13e77535db8b534102d8ab88bdc73fdc1f3a \
--skip-dependency-verification

