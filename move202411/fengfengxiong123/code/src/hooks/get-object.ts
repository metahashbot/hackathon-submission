import suiClient from "~/lib/sui-client";

export async function getObject(id: string) {
  try {
    const params = {
      id: id,
      options: {
        showType: false,
        showOwner: false,
        showPreviousTransaction: false,
        showContent: true,
        showStorageRebate: false,
      },
    };

    const response = await suiClient.getObject(params);
    //   let report_table_id = await response.data?.content.reports.fields.id.id as string;
    //   let report_numer = user_obj.reports.fields.size;
    //   console.log("report_table_id",report_table_id);
    //   console.log("report_numer",report_numer);

    //   return [user_obj.name,user_obj.sex,report_table_id,report_numer];
    return response.data;
  } catch (error) {
    console.error("Error fetching dynamic fields:", error);
    throw error;
  }
}
