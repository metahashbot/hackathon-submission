import { SuiClient } from '@mysten/sui.js/client';
import React, { useState, useEffect } from 'react';

async function fetchDynamicFields(parentId: string) {
	try {
	  // 初始化 Sui 客户端 https://fullnode.testnet.sui.io
	  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
	  // 定义 GetDynamicFieldsParams
	  const params = {
		parentId,
		limit: 100, // 每次查询返回的最大动态字段数量
	  };
  
	  // 获取动态字段列表
	  const response = await client.getDynamicFields(params);  
	  return response.data;;

	} catch (error) {
	  console.error('Error fetching dynamic fields:', error);
	  throw error;
	}
  }

  async function fetchDynamicFieldObject(
		parentId: string, // table id
		mystype:string, // "0x1::string::String" 合约中定义table的key的类型，
		myvalue:string  // 合约中定义table的key值，如本合约值是用户地址
	) {
	try {
	  // 初始化 Sui 客户端 https://fullnode.testnet.sui.io
	  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
	  // 定义 GetDynamicFieldsParams
	  const params = {
		parentId,
		name: {type:mystype,value:myvalue}, 
	  };
  
	  // 获取动态字段列表
	  const response = await client.getDynamicFieldObject(params);  
	  return response.data;;

	} catch (error) {
	  console.error('Error fetching dynamic fields:', error);
	  throw error;
	}
  }

  async function getObject(id: string) {
	try {
	  // 初始化 Sui 客户端 https://fullnode.testnet.sui.io
	  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
	  const params = {
		id:id,
		options: {
			showType: false,
			showOwner: false,
			showPreviousTransaction: false,
			showContent: true,
			showStorageRebate: false,
		}
	  };
  
	  const response = await client.getObject(params);
	//   let report_table_id = await response.data?.content.reports.fields.id.id as string;
	//   let report_numer = user_obj.reports.fields.size;
	//   console.log("report_table_id",report_table_id);
	//   console.log("report_numer",report_numer);
  
	//   return [user_obj.name,user_obj.sex,report_table_id,report_numer];
	return  response.data
	} catch (error) {
	  console.error('Error fetching dynamic fields:', error);
	  throw error;
	}
  }

  async function getObjects(ids: Array<string>) {
	try {
	  // 初始化 Sui 客户端 https://fullnode.testnet.sui.io
	  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });
  
	  const params = {
		ids:ids,
		options: {
			showType: false,
			showOwner: false,
			showPreviousTransaction: false,
			showContent: true,
			showStorageRebate: false,
		}
	  };
  
	  const response = await client.multiGetObjects(params);
	  return  response
	} catch (error) {
	  console.error('Error fetching dynamic fields:', error);
	  throw error;
	}
  }



//hook，用来获取数据
export  function MyComponent() {
	const [userTableId, setUserTableId] = useState(null); 
	const [userObject, setUserObject] = useState(null);
	const [reportTableId, setReportTableId] = useState(null);
	const [reportAllIds, setReportAllIds] = useState<string[]>([]);
	const [reportAllInfos, setReportAllInfos] = useState<object[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// hcsc_v3模块发布时的共享对象id  (合约init函数创建的共享对象AnalysisCenter)
	let share_obj_id = "0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933";
	
	// 获取AnalysisCenterd的users字段（Table）的table id
	useEffect(()=>{
		const response = getObject(share_obj_id);
		response?.then((res)=>{
			setLoading(true);
			console.log(res)
			if(res?.content){
				setUserTableId(res.content?.fields.users.fields.id.id)  // 保存在userTableId变量中
			}
		}).catch((error)=>{
			setError(error.message);
		}).finally (()=>{
			setLoading(false);
		})
		
	},[]) // []仅在组件挂载时执行

	// 使用users字段的table id 获取当前登录用户的用户信息和User对象 reports字段（Table） 的table id
	useEffect(()=>{
		if(userTableId && !userObject){
			const response = fetchDynamicFieldObject(
				userTableId, // table id
				"0x1::string::String",
				"d790d41adfffd48df8e38607991a297970743decff87517e647008a652587d4c" // 获取用户钱包地址。todo
			);
			response?.then((res)=>{
				setLoading(true);
				console.log(222,res)
				if(res?.content){
					console.log(res?.content.fields.value.fields)
					console.log('age',res?.content.fields.value.fields.age)
					setUserObject(res?.content.fields.value.fields)   // 保存用户信息到userObject中
					setReportTableId(res?.content.fields.value.fields.reports.fields.id.id) // 保存reports字段（Table） 的table id到reportTableId中
				}
			}).catch((error)=>{
				setError(error.message);
			}).finally (()=>{
				setLoading(false);
			})
		}
	},[userTableId]) // userTableId获取到时在执行

	// 使用reportTableId 获取所有的用户的报告id （report ids）
	useEffect(()=>{
		if(reportTableId && reportAllIds.length == 0){
			const response = fetchDynamicFields(
				reportTableId
				// "0x79f7eafef5aa3cb02afd897c7369ac4e9b40637fc642df18fc265f9e26b3acee", // 用户对象id
			);
			response?.then((res)=>{
				setLoading(true);
				console.log(444,res)
				let ids: string[]  = [];
				res.forEach(element => {
					ids.push(element.objectId)
				});
				console.log(555,ids)
				if(ids){
					setReportAllIds(ids); // 保存report ids
				}

			}).catch((error)=>{
				setError(error.message);
			}).finally (()=>{
				setLoading(false);
			})
		}
	},[reportTableId]) // reportTableId获取到时在执行

	// 使用所有的报告id （reportAllIds）获取所有报告中的信息
	useEffect(()=>{
		if(reportAllIds && reportAllInfos.length == 0){
			const response = getObjects(
				reportAllIds
			);
			response?.then((res)=>{
				setLoading(true);
				console.log(666,res)
				let reports:object[]=[];
				let start_date = new Date();
				res.forEach((element, index) => {
					let tmp = element.data?.content.fields.value.fields;
					start_date.setDate(start_date.getDate()+index) ;
					tmp["date"] = start_date
					reports.push(tmp)
				});

				setReportAllInfos(reports) // 保存报告中的信息
			}).catch((error)=>{
				setError(error.message);
			}).finally (()=>{
				setLoading(false);
			}
		)
		}
	},[reportAllIds])


	
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

	
	
	// 获取共享对象信息
	// let share_obj_id = "0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933";
	// let user_table_obj_id = "0x9512e95bb72179964ca4cced088606ab362887b426963d0a311541a6bc59c81d";
	// let user_address = "d790d41adfffd48df8e38607991a297970743decff87517e647008a652587d4c";
	// let user_all_reports: any[] = [];
	// const response = fetchDynamicFields(user_table_obj_id);
	// response.then((res)=>{
	// 	console.log(1,res)
	// 	let user_obj_id = "";
	// 	res.forEach(element => {
	// 		if(element.name.value==user_address){
	// 			user_obj_id = element.objectId
	// 		}
	// 	});
	// 	const response = getObject(user_obj_id);
	// 	response.then((res)=>{
	// 		console.log(2,res)
	// 		let user_info_obj = res?.content?.fields.value.fields
	// 		console.log(3,user_info_obj)
	// 		let report_table_id = res?.content?.fields.value.fields.reports.fields.id.id
	// 		console.log(4,report_table_id)
	// 		const response = fetchDynamicFields(report_table_id);
	// 		response.then((res)=>{
	// 			console.log(5,res)
	// 			let report_obj_ids: string[] = [];
	// 			res.forEach(element => {
	// 				report_obj_ids.push(element.objectId)
	// 			});
	// 			const response = getObjects(report_obj_ids)
	// 			response.then((res)=>{
	// 				console.log(6,res)
	// 				res.forEach(element => {
	// 					let fields = element.data?.content?.fields.value.fields
	// 					user_all_reports.push(fields)
	// 				});
	// 				console.log(7,user_all_reports)
	// 			})
	// 		})
	// 	})
		
	// })


	// const content_data = getObject(share_obj_id);
	

	// content_data.then((data)=>{
	// 	console.log("1 data",data);
	// 	let user_obj = data?.content?.fields.users;
	// 	console.log("2 user_obj",user_obj);
	// 	let user_table_id = user_obj.fields.id.id;
	// 	let user_table_count = user_obj.fields.size;
	// 	console.log("3 user_table_id",user_table_id);
	// 	console.log("4 user_table_count",user_table_count);

	// 	const response = fetchDynamicFields(user_table_id);
	// 	response.then((data)=>{
	// 		console.log('5 ========',data)
			
	// 		let user_obj_id = data[0]?.objectId
	// 		console.log('6 ========',user_obj_id)
	// 		const response = getObject(user_obj_id);
	// 		response.then((data)=>{
	// 			console.log('7 ========',data)
	// 			let t_obj_id = data?.content.fields.value.fields.reports.fields.id.id;
	// 			let size = data?.content.fields.value.fields.reports.fields.size;
	// 			console.log('8 ========',t_obj_id)
	// 			const response = fetchDynamicFields(t_obj_id);
	// 			response.then((data)=>{
	// 				console.log('9 ========',data)
	// 			})
	// 		})
	// 	})
	// })

	// const fields = fetchDynamicFields(report_table_id);

	// const { data, isPending, isError, error, refetch } = useSuiClientQuery(
	// 	'getObject',
	// 	//  0x43730530a28dc51baabc5911e30cf50d231b7eb020d4a2edc6a4c491be022fde
	// 	{ id: '0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933', options: {
	// 		showType: false,
	// 		showOwner: false,
	// 		showPreviousTransaction: false,
	// 		showContent: true,
	// 		showStorageRebate: false,
	// 	}, },
		
	// 	{
	// 		gcTime: 10000,
	// 	},
	// );
 
	// if (isPending) {
	// 	return <div>Loading...</div>;
	// }
 
	// if (isError) {
	// 	return <div>Error: {error.message}</div>;
	// }
 
	// return <div>
	// 	<pre>{JSON.stringify(data, null, 2)}</pre>
	// 	{/* <pre>{JSON.stringify(user_all_reports, null, 2)}</pre> */}
	// 	{/* <pre>{JSON.stringify(objData, null, 2)}</pre> */}
	// </div>;

