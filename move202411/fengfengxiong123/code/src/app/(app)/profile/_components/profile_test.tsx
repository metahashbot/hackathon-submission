"use client";

import React, { useState, useEffect } from "react";
// import { fetchDynamicFields } from "~/hooks/fetch-dynamic-fields";
// import { fetchDynamicFieldObject } from "~/hooks/fetch-dynamic-object";
// import { getObject } from "~/hooks/get-object";
// import { getObjects } from "~/hooks/get-objects";

//hook，用来获取数据
export function ProfileTest() {
  const [userTableId, setUserTableId] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [reportTableId, setReportTableId] = useState(null);
  const [reportAllIds, setReportAllIds] = useState<string[]>([]);
  const [reportAllInfos, setReportAllInfos] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // // hcsc_v3模块发布时的共享对象id  (合约init函数创建的共享对象AnalysisCenter)
  // let share_obj_id =
  //   "0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933";

  // // 获取AnalysisCenterd的users字段（Table）的table id
  // useEffect(() => {
  //   const response = getObject(share_obj_id);
  //   response
  //     ?.then((res) => {
  //       setLoading(true);
  //       console.log(res);
  //       if (res?.content) {
  //         setUserTableId(res.content?.fields.users.fields.id.id); // 保存在userTableId变量中
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []); // []仅在组件挂载时执行

  // // 使用users字段的table id 获取当前登录用户的用户信息和User对象 reports字段（Table） 的table id
  // useEffect(() => {
  //   if (userTableId && !userObject) {
  //     const response = fetchDynamicFieldObject(
  //       userTableId, // table id
  //       "0x1::string::String",
  //       "d790d41adfffd48df8e38607991a297970743decff87517e647008a652587d4c", // 获取用户钱包地址。todo
  //     );
  //     response
  //       ?.then((res) => {
  //         setLoading(true);
  //         console.log(222, res);
  //         if (res?.content) {
  //           console.log(res?.content);
  //           console.log(res?.content.fields);
  //           console.log(res?.content.fields.value);
  //           console.log(res?.content.fields.value.fields);
  //           console.log("age", res?.content.fields.value.fields.age);
  //           setUserObject(res?.content.fields.value.fields); // 保存用户信息到userObject中
  //           setReportTableId(
  //             res?.content.fields.value.fields.reports.fields.id.id,
  //           ); // 保存reports字段（Table） 的table id到reportTableId中
  //         }
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [userTableId]); // userTableId获取到时在执行

  // // 使用reportTableId 获取所有的用户的报告id （report ids）
  // useEffect(() => {
  //   if (reportTableId && reportAllIds.length == 0) {
  //     const response = fetchDynamicFields(
  //       reportTableId,
  //       // "0x79f7eafef5aa3cb02afd897c7369ac4e9b40637fc642df18fc265f9e26b3acee", // 用户对象id
  //     );
  //     response
  //       ?.then((res) => {
  //         setLoading(true);
  //         console.log(444, res);
  //         let ids: string[] = [];
  //         res.forEach((element) => {
  //           ids.push(element.objectId);
  //         });
  //         console.log(555, ids);
  //         if (ids) {
  //           setReportAllIds(ids); // 保存report ids
  //         }
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [reportTableId]); // reportTableId获取到时在执行

  // // 使用所有的报告id （reportAllIds）获取所有报告中的信息
  // useEffect(() => {
  //   if (reportAllIds && reportAllInfos.length == 0) {
  //     const response = getObjects(reportAllIds);
  //     response
  //       ?.then((res) => {
  //         setLoading(true);
  //         console.log(666, res);
  //         let reports: object[] = [];
  //         let start_date = new Date();
  //         res.forEach((element, index) => {
  //           let tmp = element.data?.content.fields.value.fields;
  //           start_date.setDate(start_date.getDate() + index);
  //           tmp["date"] = start_date;
  //           reports.push(tmp);
  //         });

  //         setReportAllInfos(reports); // 保存报告中的信息
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [reportAllIds]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>错误：{error}...</p>;

  return (
    <div>
      <h1>初始数据</h1>
      <pre>{JSON.stringify(userTableId, null, 2)}</pre>
      <h1>第二次请求数据:userObject</h1>
      <pre>{JSON.stringify(userObject, null, 2)}</pre>
      <h1>第二次请求数据:reportTableId</h1>
      <pre>{JSON.stringify(reportTableId, null, 2)}</pre>
      <h1>第三次请求数据:reportAllIds</h1>
      <pre>{JSON.stringify(reportAllIds, null, 2)}</pre>
      <h1>第四次请求数据:reportAllInfos</h1>
      <pre>{JSON.stringify(reportAllInfos, null, 2)}</pre>
    </div>
  );
}
