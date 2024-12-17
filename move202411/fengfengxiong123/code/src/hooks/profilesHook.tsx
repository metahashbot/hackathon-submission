import { SuiClient } from '@mysten/sui/client';
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
	// let share_obj_id = "0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933";
	// hcsc_v4模块发布时的共享对象id  (合约init函数创建的共享对象AnalysisCenter)
	let share_obj_id = "0x1be961232f8682cb89f2d6b487f790a2e979d051f6cdb5a2d274b0cbe0d82608";
	
	// 获取AnalysisCenterd的users字段（Table）的table id
	useEffect(()=>{
		const response = getObject(share_obj_id);
		response?.then((res)=>{
			setLoading(true);
			console.log(res)
			if(res?.content){
				setUserTableId((res.content as any)?.fields.users.fields.id.id)  // 保存在userTableId变量中
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
				// "d790d41adfffd48df8e38607991a297970743decff87517e647008a652587d4c" //
				"0x2af6c1938280cf418ce388f62deffe9a56746d0887c9e6c031a4127016987e35" // 获取用户钱包地址。todo
				//地址二 0xc5608b3f246c832b6a0908abf0c61a22e0703f2a571e65f8b202db7b67fb366d
			);
			response?.then((res)=>{
				setLoading(true);
				console.log(222,res)
				if(res?.content){
					console.log((res.content as any)?.fields.value.fields)
					console.log('age',(res.content as any)?.fields.value.fields.age)
					setUserObject((res.content as any)?.fields.value.fields)   // 保存用户信息到userObject中
					setReportTableId((res.content as any)?.fields.value.fields.reports.fields.id.id) // 保存reports字段（Table） 的table id到reportTableId中
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
					let tmp = (element as any)?.data?.content.fields.value.fields;
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