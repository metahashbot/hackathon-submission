import { suiClient } from "@/config";
export const isValidSuiCoin = async ( coinId: string) => {
    const suiCoin = await suiClient.getObject({
        id: coinId,
        options: {
            showContent: true
        }
    })

    
    console.log(suiCoin)
    
    return false
}

export const getAllBalance = async (address: string) => {
    console.log(address)
    const balances = await suiClient.getAllBalances({
        owner: address
    })
    if(balances){
        const suiBalance = balances.find(balance => balance.coinType === "0x2::sui::SUI");
        if (suiBalance) {
            console.log(`Total Balance for SUI: ${suiBalance.totalBalance}`);
            if(suiBalance.totalBalance === '0'){
                alert("SUI coin balance is zero"); 
                return 0
            }else {
               let  balance = Number(suiBalance.totalBalance) / 1000000000
                console.log(balance)
                return balance
            }
        } else {
            alert("SUI coin type not found.");
            return 0
        }
    }

}