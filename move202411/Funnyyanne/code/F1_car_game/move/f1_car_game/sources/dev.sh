#create_new_driver
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_driver  --args 0xe04921231ca7c3c7cbc0b156f6cae229cceed2191637be80efedcbc138b34a34  0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390 LuLisi BusyKaren 4 2 ""
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_driver  --args 0xe04921231ca7c3c7cbc0b156f6cae229cceed2191637be80efedcbc138b34a34  0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390 Lustapan RedSheep 5 4 ""
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_driver  --args 0xe04921231ca7c3c7cbc0b156f6cae229cceed2191637be80efedcbc138b34a34  0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390 Zhou Sobo 2 3 ""
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_driver  --args 0xe04921231ca7c3c7cbc0b156f6cae229cceed2191637be80efedcbc138b34a34  0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390 SUKI BOCA 3 1 ""
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_driver  --args 0xe04921231ca7c3c7cbc0b156f6cae229cceed2191637be80efedcbc138b34a34  0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390 ZERO BENER 2 1 ""

#create_car
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_car  --args 0xe0bb621bf923c911c605f98f0de1fa3381594cc6909eabc6cf400bfb872b4f80   BusyKaren 5 4 ""

# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_car  --args 0xe0bb621bf923c911c605f98f0de1fa3381594cc6909eabc6cf400bfb872b4f80   RedSheep 4 4 ""

# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_car  --args 0xe0bb621bf923c911c605f98f0de1fa3381594cc6909eabc6cf400bfb872b4f80   Sobo 2 3 ""

# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_car  --args 0xe0bb621bf923c911c605f98f0de1fa3381594cc6909eabc6cf400bfb872b4f80   BOCA 3 2 ""

# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function create_new_car  --args 0xe0bb621bf923c911c605f98f0de1fa3381594cc6909eabc6cf400bfb872b4f80   BENER 1 1 ""

#get driver
# sui client call --gas-budget 50000000 --package 0x66d83a5e1ada336ead9cf4d311f89edd73657fa653a37bce85b90d99c78c5927 --module f1_car_game --function get_available_drivers  --args 0x02c9e4c0d892f24946e716e8860f77a2ac5ab9a30c1448b7ab2056316efd4390

# Buy game tokens
# sui client call \
#     --gas-budget 50000000 \
#     --package 0x744d83607f8a9974ab9d390d9cb522e21b5f407e637f16b4b5367eca4fec1378 \
#     --module f1_car_game \
#     --function buy_game_tokensv2 \
#     --args '0xe585a5be944a14b3898ee665edefca93a7221752e3c76af1ff641b0598e4e3d8' \
#           '0x66f53f8222a74586149e1214b4ce40e258a138241264b64e131457abf36b2916' \
#           100000000

# sui client upgrade  --upgrade-capability 0xfee103c670449ab96fdb4423cd794da384a92fe1f913a80bcd4f146da16bfb26
# sui client call --gas-budget 5000000000 --package 0x744d83607f8a9974ab9d390d9cb522e21b5f407e637f16b4b5367eca4fec1378 --module f1_car_game --function buy_game_tokensv2 --args 0xe585a5be944a14b3898ee665edefca93a7221752e3c76af1ff641b0598e4e3d8 0x66f53f8222a74586149e1214b4ce40e258a138241264b64e131457abf36b2916 100000000


#第三次升级命令
# PackageID: 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a
# GamePool：0xd88c7803ac911b716909ed500d0e9f1dc8f131a082d2662fa1eab4ea9c1bc686
# DriverLibrary：0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778
# F1CarGameAdminCap：0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5 
# CarLibrary：0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b 
# GameState：0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583

#create_new_driver
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_driver  --args 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5  0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778 LuLisi BusyKaren 4 2 ""
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_driver  --args 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5  0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778 Lustapan RedSheep 5 4 ""
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_driver  --args 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5  0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778 Zhou Sobo 2 3 ""
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_driver  --args 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5  0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778 SUKI BOCA 3 1 ""
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_driver  --args 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5  0xd5202ad82b2333294145821e41b55237ddc043657c6cbc30f59efca51041a778 ZERO BENER 2 1 ""

#create_car
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_car  --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b   BusyKaren 5 4 ""

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_car  --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b   RedSheep 4 4 ""

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_car  --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b   Sobo 2 3 ""

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_car  --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b   BOCA 3 2 ""

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function create_new_car  --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b   BENER 1 1 ""

# false sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function buy_game_tokensv2 --args 0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583 0x66f53f8222a74586149e1214b4ce40e258a138241264b64e131457abf36b2916 100000000 success
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function buy_game_tokensv2 --args "0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583" "0x66f53f8222a74586149e1214b4ce40e258a138241264b64e131457abf36b2916" "100000000"

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function get_random_car_info --args 0x8 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b

# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function get_available_cars --args 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b


# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function calculate_race_result --args 0x7769b3091d5f9fa409b6c07c8b740bdf923c5e210edc48f4669533d417c90386 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5 0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function calculate_race_result --args 0 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5 0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583
# sui client call --gas-budget 50000000 --package 0x108da3248e29121fd54e0b5f436d49d94c7ac91489541d6cfc65a9f296c8064a --module f1_car_game --function get_random_car_info --args 0x8 0x546ecb2735a0e2d0579b476a11263aa33b4bf0332bdd291d055aafebf8751f3b 


# //testnet数据
# PackageID: 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6
# GamePool：0x05ce7d0e1285b2b03c446d12c430ba764c1e8b4c66138cccf9403725b01cf62f
# DriverLibrary：0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde 
# F1CarGameAdminCap：0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b
# CarLibrary：0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51
# GameState：0x5b5db3cac3d015966bdfcbb393d2d21a786e9e45d84617054f494b80ead80948
# UpgradeCap：0x05f49598c80311b93d26666d036ab50d2a89dd2b81be8638fb7446acc3f7162d

#create_new_driver
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_driver  --args 0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b  0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde LuLisi BusyKaren 4 2 ""
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_driver  --args 0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b  0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde Lustapan RedSheep 5 4 ""
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_driver  --args 0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b  0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde Zhou Sobo 2 3 ""
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_driver  --args 0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b  0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde SUKI BOCA 3 1 ""
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_driver  --args 0x4c30e07f3cfd9667d54a45bf1165a161b0b7670e8d23dcd5b35f33f10ac8937b  0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde ZERO BENER 2 1 ""

#create_car
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_car  --args 0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51   BusyKaren 5 4 ""

# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_car  --args 0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51   RedSheep 4 4 ""

# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_car  --args 0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51   Sobo 2 3 ""

# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_car  --args 0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51   BOCA 3 2 ""

# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function create_new_car  --args 0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51   BENER 1 1 ""

# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function calculate_race_result --args 0x7769b3091d5f9fa409b6c07c8b740bdf923c5e210edc48f4669533d417c90386 0x955757e954aff2be262664f5fab37ed5a505c38069017600f9a28e52098606a5 0x8106e20bda7ab1e8f98e2f49be1b5e20e26e3fc01212c5e6e3969d76fa9df583
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function get_random_car_info --args 0x8  0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function calculate_race_result --args 0x0000000000000000000000000000000000000000000000000000000000000008  0xc06ddd53ff30168dae0dc7b84de2a63739439c5eea275cbf63b6c119e78e1b51
# sui client call --gas-budget 50000000 --package 0xf8557c8df279eff891beaafd12d49ba9260aaaab89db93a86dd4a31c14f2f5f6 --module f1_car_game --function get_available_drivers --args 0x9045820143e5f35443fea30e1b3ef4be672a52bcdf342bd3171e078556f4afde   
# 0x0000000000000000000000000000000000000000000000000000000000000008