"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { suiClient } from "@/config";

import { useNetworkVariables } from "@/config";
import React, { useEffect, useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { BlobInfo } from "@/contracts/gallery";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface TitleContentProps {
  blobInfo: BlobInfo | null;
  showDetail: boolean;
  setShowDetail: (show: boolean) => void;
  disabled?: boolean;
  address: string;
  handleRewordSui: (blobId: string, blobInfo: string, amount: string,validCoinObjectIds: string[]) => Promise<void>
}

export function TitleContent({
  blobInfo,
  showDetail,
  setShowDetail,
  disabled,
  address,
  handleRewordSui
}: TitleContentProps) {
  const networkVariables = useNetworkVariables();
  const [value, setValue] = useState<string>("");
  const [amount, setAmount] = useState<string>(""); 
  const [suiAmount, setSuiAmount] = useState<string>(""); // New state for amount
  // New state for amount
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const rewordUser = async () => {
    if (disabled) {
      alert("请先登录钱包");
      return
    }

    const balances = await suiClient.getAllBalances({
      owner: address
    })
    let suiBalanceAmount = 0.0
    if (balances) {
      console.log(balances)
      const suiBalance = balances.find(balance => balance.coinType === "0x2::sui::SUI");
      if (suiBalance) {
        console.log(`Total Balance for SUI: ${suiBalance.totalBalance}`);
        if (suiBalance.totalBalance === '0') {
          alert("SUI coin balance is zero");
          return 0
        } else {
          suiBalanceAmount = Number(suiBalance.totalBalance) / 1000000000
          console.log(suiBalanceAmount)
        }
      } else {
        alert("SUI coin type not found.");
        return 0
      }
    }
    setSuiAmount(String(suiBalanceAmount))
    
    setIsDialogOpen(true)
  }
  const handleAmountSubmit = async() => {

    alert(`您提交的金额是: ${amount}`); // Handle the submission (replace with actual logic)
    if(blobInfo != null){
      const objects = await suiClient.getAllCoins({
        owner: address
      })
      
      if (objects) {
        console.log(objects)
        const validCoinObjectIds: string[] = []; // 新数组用于存储符合���件的 coinObjectId
        const requiredBalance = Number(amount) * 1000000000; // 计算所需的余额
        let totalBalance = 0; // 新增变量以累计余额
        for (const obj of objects.data) {
          if (obj.coinType === "0x2::sui::SUI") {
            console.log(requiredBalance)
            console.log(obj.balance)
             // 累加符合条件的余额
            if (totalBalance < requiredBalance) {
              validCoinObjectIds.push(obj.coinObjectId); // 添加符合条件的 coinObjectId
            }
            totalBalance += Number(obj.balance);
          }
        }
        console.log(validCoinObjectIds)

        handleRewordSui(blobInfo.blobId, blobInfo.id.id, amount, validCoinObjectIds)
      }
      
    }
    

    setIsDialogOpen(false); // Close the dialog after submission
    setAmount(""); // Reset the amount
  };

  const vaildSuiAmount = (rewordAmount: string) => {
     // valid sui coin
     const amountValue = Number(rewordAmount);
     const suiAmountValue = Number(suiAmount);
 
     if (amountValue >= suiAmountValue) {
       alert(`金额必须小于当前 SUI 数量: ${suiAmount}`);
       return;
     }
    setAmount(rewordAmount)
  }


  // 获取 Blob 内容
  useEffect(() => {
    if (blobInfo && showDetail) {
      const fetchContent = async () => {
        const aggregatorUrl = `${networkVariables.walrusAggreator}/v1/${blobInfo.blobId}`;
        console.log("Fetching from:", aggregatorUrl);

        try {
          const response = await fetch(aggregatorUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.text();
          console.log(data)
          setValue(data); // 将文件内容设置为 Markdown
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      };

      fetchContent();
    }

    return () => {
      // 组件卸���时清理内容
      setValue("");
    };
  }, [blobInfo, showDetail, networkVariables]);

  return (
    <Dialog
      open={showDetail}
      onOpenChange={() => {
        setShowDetail(false);
        setValue(""); // 清空内容
        setIsDialogOpen(false); 
      }}
    >
      <DialogTrigger asChild>
        {/* 如果需要触发按钮可以放置在这里 */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] h-[90%]">
        <DialogHeader >
          <DialogTitle>{blobInfo?.title}</DialogTitle>
          <div className="w-full flex text-center">

            <div className="flex items-center justify-center">如果觉得内容不错 </div>
            <button className="bg-green-400 w-[100px]  px-2 rounded-lg text-lg ml-4"
              onClick={rewordUser} >
              打赏作者
            </button>
          </div>

        </DialogHeader>
        {isDialogOpen && (
          <div className="p-4 mt-2">
            <div className="mb-2">当前 SUI 数量: {suiAmount}</div>
            <input
              type="string"
              value={amount}
              onChange={(e) => vaildSuiAmount(e.target.value)}
              placeholder="输入金额"
              className="border p-2 rounded"
            />
            <button onClick={handleAmountSubmit} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
              提交
            </button>
            <button onClick={() => setIsDialogOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
              取消
            </button>
          </div>
        )}
        <div className="h-[85%] border-2">
          <div className="w-full h-[80%] overflow-y-auto p-4">
            {/* Markdown 内容渲染 */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {value}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}