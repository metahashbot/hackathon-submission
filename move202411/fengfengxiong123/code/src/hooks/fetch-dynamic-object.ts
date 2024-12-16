import suiClient from "~/lib/sui-client";

export async function fetchDynamicFieldObject(
  parentId: string, // table id
  mystype: string, // "0x1::string::String" 合约中定义table的key的类型，
  myvalue: string, // 合约中定义table的key值，如本合约值是用户地址
) {
  try {
    // 定义 GetDynamicFieldsParams
    const params = {
      parentId,
      name: { type: mystype, value: myvalue },
    };

    // 获取动态字段列表
    const response = await suiClient.getDynamicFieldObject(params);
    return response.data;
  } catch (error) {
    console.error("Error fetching dynamic fields:", error);
    throw error;
  }
}
