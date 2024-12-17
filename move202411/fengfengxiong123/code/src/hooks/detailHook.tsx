import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import React, { useState, useEffect } from 'react';

import { useWallet } from '@suiet/wallet-kit';


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
	mystype: string, // "0x1::string::String" 合约中定义table的key的类型，
	myvalue: string  // 合约中定义table的key值，如本合约值是用户地址
) {
	try {
		// 初始化 Sui 客户端 https://fullnode.testnet.sui.io
		const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

		// 定义 GetDynamicFieldsParams
		const params = {
			parentId,
			name: { type: mystype, value: myvalue },
		};

		// 获取动态字段列表
		const response = await client.getDynamicFieldObject(params);
		console.log(response)
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
			id: id,
			options: {
				showType: false,
				showOwner: false,
				showPreviousTransaction: false,
				showContent: true,
				showStorageRebate: false,
			}
		};

		const response = await client.getObject(params);

		return response.data
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
			ids: ids,
			options: {
				showType: false,
				showOwner: false,
				showPreviousTransaction: false,
				showContent: true,
				showStorageRebate: false,
			}
		};

		const response = await client.multiGetObjects(params);
		return response
	} catch (error) {
		console.error('Error fetching dynamic fields:', error);
		throw error;
	}
}



//hook，用来获取数据
export function UseData() {
	type Report = {
		date: Date,
		platelets: string,
		wbc: string,
		rbc: string,
		crp: string,
		name: string,
	};
	type User = {
		age: string,
		count: string,
		name: string,
		gender: string,
	};
	const [myAddress, setMyAddress] = useState("");
	const [userTableId, setUserTableId] = useState(null);
	const [userObject, setUserObject] = useState<User>();
	const [reportTableId, setReportTableId] = useState(null);
	const [reportAllIds, setReportAllIds] = useState<string[]>([]);
	const [reportAllInfos, setReportAllInfos] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const wallet = useWallet();

	// hcsc_v3模块发布时的共享对象id  (合约init函数创建的共享对象AnalysisCenter)
	// let share_obj_id = "0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933";
	let share_obj_id = "0x66f2ce8d058b1cabbaaebeb19593dcddef850f37b3a232dcb462498f1445c35f";

	useEffect(() => {
		if (!myAddress) {

			if (wallet.connected && wallet.account) {
				console.log('已连接：', wallet.account?.address)
				setMyAddress(wallet.account?.address);
			}
		}
	}, [wallet]); // 监听钱包状态变化

	// 获取AnalysisCenterd的users字段（Table）的table id
	useEffect(() => {
		console.log(myAddress)
		if (myAddress && !userTableId) {
			const response = getObject(share_obj_id);
			response?.then((res) => {
				setLoading(true);
				console.log(res)
				if (res?.content) {
					console.log('获取user table id', (res.content as any)?.fields.users.fields.id.id)
					setUserTableId((res.content as any)?.fields.users.fields.id.id)  // 保存在userTableId变量中
				}
			}).catch((error) => {
				setError(error.message);
			}).finally(() => {
				setLoading(false);
			})
		}
	}, [myAddress]) // 监听地址状态变化

	// 使用users字段的table id 获取当前登录用户的用户信息和User对象 reports字段（Table） 的table id
	useEffect(() => {
		if (userTableId && myAddress && !userObject) {
			const response = fetchDynamicFieldObject(
				userTableId, // table id
				"0x1::string::String",
				myAddress.substring(2), // 钱包地址需要去掉0x
			);
			response?.then((res) => {
				setLoading(true);
				console.log(222, res)
				if (res?.content) {
					console.log('获取用户信息',(res.content as any)?.fields.value.fields.age)
					setUserObject((res.content as any)?.fields.value.fields)   // 保存用户信息到userObject中
					setReportTableId((res.content as any)?.fields.value.fields.reports.fields.id.id) // 保存reports字段（Table） 的table id到reportTableId中
				}
			}).catch((error) => {
				setError(error.message);
			}).finally(() => {
				setLoading(false);
			})
		}
	}, [userTableId]) // 用户字段（Table）的id

	// 使用reportTableId 获取所有的用户的报告id （report ids）
	useEffect(() => {
		if (reportTableId && reportAllIds.length == 0) {
			const response = fetchDynamicFields(
				reportTableId
			);
			response?.then((res) => {
				setLoading(true);
				console.log(444, res)
				let ids: string[] = [];
				res.forEach(element => {
					ids.push(element.objectId)
				});
				console.log(555, ids)
				if (ids) {
					setReportAllIds(ids); // 保存report ids
				}

			}).catch((error) => {
				setError(error.message);
			}).finally(() => {
				setLoading(false);
			})
		}
	}, [reportTableId]) // reportTableId获取到时在执行

	// 使用所有的报告id （reportAllIds）获取所有报告中的信息
	useEffect(() => {

		if (reportAllIds.length != 0 && reportAllInfos.length == 0) {
			console.log('reportAllInfos', reportAllInfos)
			console.log('reportAllIds', reportAllIds)
			const response = getObjects(
				reportAllIds
			);
			response?.then((res) => {
				setLoading(true);
				console.log(666, res)
				let reports: Report[] = [];
				res.forEach((element, index) => {
					let tmp = (element as any).data?.content.fields.value.fields;
					tmp["date"] = new Date(Number(BigInt(tmp["date"])) / 1000);
					reports.push(tmp)
				});

				setReportAllInfos(reports) // 保存报告中的信息
			}).catch((error) => {
				setError(error.message);
			}).finally(() => {
				setLoading(false);
			}
			)
		}
	}, [reportAllIds])



	return {
		userTableId,
		userObject,
		reportTableId,
		reportAllIds,
		reportAllInfos,
		loading,
		error
	};
}