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
