import suiClient from "~/lib/sui-client";

export async function fetchDynamicFields(parentId: string) {
  try {
    // 定义 GetDynamicFieldsParams
    const params = {
      parentId,
      limit: 100, // 每次查询返回的最大动态字段数量
    };

    // 获取动态字段列表
    const response = await suiClient.getDynamicFields(params);
    return response.data;
  } catch (error) {
    console.error("Error fetching dynamic fields:", error);
    throw error;
  }
}
